"use client";

import React, { useState } from "react";
import { DefensePatch, TargetAgent } from "@/types";
import { Shield, Sparkles, RefreshCw, Copy, Check } from "lucide-react";

interface ImmunizerPanelProps {
  target: TargetAgent;
  hasBreaches: boolean;
  isSample?: boolean;
  totalEvaluations?: number;
  patch: DefensePatch | null;
  onImmunize: () => void;
  isImmunizing: boolean;
  onDeployPatch: (hardenedPrompt: string) => void;
}

export const ImmunizerPanel: React.FC<ImmunizerPanelProps> = ({
  hasBreaches,
  isSample,
  totalEvaluations = 0,
  patch,
  onImmunize,
  isImmunizing,
  onDeployPatch,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);

  const handleCopy = () => {
    if (!patch?.hardenedPrompt) return;
    navigator.clipboard.writeText(patch.hardenedPrompt);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <section className="quiet-panel">
      <div className="quiet-panel-heading">
        <div>
          <span className="eyebrow">HARDEN</span>
          <h2>Close the loop.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
          <button
            className="product-button primary-action"
            onClick={onImmunize}
            disabled={!hasBreaches || isImmunizing}
          >
            {isImmunizing ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            {isImmunizing ? "Generating…" : "Generate defense"}
          </button>
          {!hasBreaches && (
            <span style={{ fontSize: "0.75rem", color: "var(--muted, #888)", textAlign: "right" }}>
              {isSample
                ? "Sample mode: Run a live attack to synthesize defense"
                : totalEvaluations > 0
                  ? "Requires an attack finding with verdict BREACHED"
                  : "Dispatch an attacker first to discover vulnerabilities"}
            </span>
          )}
        </div>
      </div>
      {!patch ? (
        <div className="quiet-empty">
          <Shield size={48} strokeWidth={1} />
          <h3>A finding becomes your next defense.</h3>
          <p>
            {hasBreaches
              ? "Generate a stronger prompt and replay the test."
              : isSample
                ? "Sample mode active. Go to the Test tab and dispatch Social-Engineer against Apex to breach the canary and unlock live defense synthesis."
                : totalEvaluations > 0
                  ? "Target resisted evaluated tests (DEFENDED). Dispatch Social-Engineer or an adversary that breaches the canary to synthesize an exploit patch."
                  : "Run a test to find a boundary worth strengthening."}
          </p>
        </div>
      ) : (
        <>
          <div className="quiet-result">
            <Shield size={32} />
            <div>
              <h3>
                Retest result:{" "}
                {patch.retestVerdict === "DEFENDED"
                  ? "Payload resisted"
                  : "Review required"}
              </h3>
              <p>
                {patch.retestVerdict} · Residual risk {patch.retestScore}/100
              </p>
            </div>
            <button
              className="product-button secondary-action"
              onClick={() => onDeployPatch(patch.hardenedPrompt)}
            >
              Apply to sandbox
            </button>
          </div>
          <div className="quiet-toolbar">
            <div className="quiet-options">
              <button
                aria-pressed={showOriginal}
                onClick={() => setShowOriginal(true)}
              >
                Original
              </button>
              <button
                aria-pressed={!showOriginal}
                onClick={() => setShowOriginal(false)}
              >
                Proposed
              </button>
            </div>
            <button
              className="product-button secondary-action"
              onClick={handleCopy}
            >
              {copiedPatch ? <Check size={14} /> : <Copy size={14} />}{" "}
              {copiedPatch ? "Copied" : "Copy proposal"}
            </button>
          </div>
          <pre className="terminal-code">
            {showOriginal ? patch.originalPrompt : patch.hardenedPrompt}
          </pre>
          <details className="quiet-details">
            <summary>Defense details &amp; replay</summary>
            <ul>
              {patch.hardeningTechniques.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <p>{patch.retestResponse}</p>
          </details>
          <p className="quiet-note">
            One replay. Broader testing still needed.
          </p>
        </>
      )}
    </section>
  );
};
