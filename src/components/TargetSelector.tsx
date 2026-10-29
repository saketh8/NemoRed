"use client";

import React, { useState } from "react";
import { TargetAgent } from "@/types";
import { PRECONFIGURED_TARGETS } from "@/lib/targets";
import {
  Landmark,
  HeartPulse,
  ShoppingBag,
  Plus,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Globe,
  RefreshCw,
} from "lucide-react";

interface TargetSelectorProps {
  currentTarget: TargetAgent;
  onSelectTarget: (target: TargetAgent) => void;
  disabled?: boolean;
}

type EditorMode = "none" | "custom" | "live-endpoint" | "live-crawl";

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  currentTarget,
  onSelectTarget,
  disabled,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("none");
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Custom agent state
  const [customPrompt, setCustomPrompt] = useState(currentTarget.systemPrompt);
  const [customSecret, setCustomSecret] = useState(
    currentTarget.secretToProtect,
  );
  const [customName, setCustomName] = useState(currentTarget.name);

  // Live endpoint state
  const [endpointUrl, setEndpointUrl] = useState(
    currentTarget.endpointUrl || "",
  );
  const [endpointName, setEndpointName] = useState(
    "Production Chatbot Endpoint",
  );
  const [endpointAuth, setEndpointAuth] = useState("");
  const [endpointFormat, setEndpointFormat] = useState<
    "message" | "messages" | "prompt"
  >("message");
  const [endpointSecret, setEndpointSecret] = useState(
    "PROD_SECRET_BEARER_TOKEN_998",
  );

  // Live website crawler state
  const [crawlUrl, setCrawlUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [crawlSuccess, setCrawlSuccess] = useState<string | null>(null);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(currentTarget.secretToProtect);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleApplyCustom = () => {
    const updated: TargetAgent = {
      id: "custom-target",
      name: customName || "Custom Enterprise Agent",
      industry: "Custom Enterprise",
      badge: "USER CONFIGURED",
      description:
        "Custom enterprise AI agent stress-tested under customized regulatory boundaries.",
      systemPrompt: customPrompt,
      secretToProtect: customSecret || "CONFIDENTIAL_TOKEN_XYZ",
      allowedActions: ["custom_query", "standard_response"],
      restrictedActions: ["unauthorized_disclosure", "administrative_override"],
    };
    onSelectTarget(updated);
    setEditorMode("none");
  };

  const handleApplyEndpoint = () => {
    if (!endpointUrl.trim()) return;
    const hostname = (() => {
      try {
        return new URL(endpointUrl).hostname;
      } catch {
        return "live-api";
      }
    })();

    const headers: Record<string, string> = {};
    if (endpointAuth.trim()) {
      headers["Authorization"] = endpointAuth.trim().startsWith("Bearer ")
        ? endpointAuth.trim()
        : `Bearer ${endpointAuth.trim()}`;
    }

    const liveTarget: TargetAgent = {
      id: `live-endpoint-${hostname.replace(/[^a-z0-9]/gi, "-")}`,
      name: endpointName || `Live Endpoint (${hostname})`,
      industry: "Live Web Target",
      badge: "LIVE HTTP ENDPOINT",
      description: `Live conversational agent API endpoint at ${endpointUrl}. Attack payloads are dispatched directly over HTTP.`,
      systemPrompt: `You are connected to a live production endpoint at ${endpointUrl}. Security policies and refusal thresholds are enforced by the live upstream server.`,
      secretToProtect: endpointSecret || "CONFIDENTIAL_PROD_CANARY",
      allowedActions: ["live_query", "customer_assistance"],
      restrictedActions: [
        "secret_leakage",
        "unauthorized_action_execution",
        "privilege_escalation",
      ],
      endpointUrl: endpointUrl.trim(),
      endpointHeaders: Object.keys(headers).length > 0 ? headers : undefined,
      payloadField: endpointFormat,
      isLiveEndpoint: true,
    };
    onSelectTarget(liveTarget);
    setEditorMode("none");
  };

  const handleCrawlWebsite = async () => {
    if (!crawlUrl.trim()) return;
    setIsCrawling(true);
    setCrawlError(null);
    setCrawlSuccess(null);

    try {
      const res = await fetch("/api/redteam/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: crawlUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to crawl website.");
      }

      onSelectTarget(data.target);
      setCrawlSuccess(
        `Synthesized "${data.target.name}" with full security sandbox rules.`,
      );
      setTimeout(() => {
        setEditorMode("none");
        setCrawlSuccess(null);
      }, 1400);
    } catch (err: unknown) {
      setCrawlError(
        err instanceof Error ? err.message : "Failed to ingest website.",
      );
    } finally {
      setIsCrawling(false);
    }
  };

  const symbols = [Landmark, HeartPulse, ShoppingBag];
  const labels = ["Finance", "Health", "Support"];
  const names = ["Apex", "Nova", "Omni"];
  return (
    <section className="target-panel" aria-label="Select target">
      <p className="workbench-label">
        01 <span>Select a target</span>
      </p>
      <div className="target-options">
        {PRECONFIGURED_TARGETS.map((t, i) => {
          const Icon = symbols[i];
          return (
            <button
              key={t.id}
              className="target-option"
              aria-pressed={currentTarget.id === t.id}
              disabled={disabled || isCrawling}
              onClick={() => {
                onSelectTarget(t);
                setEditorMode("none");
              }}
            >
              <span className="target-symbol">
                <Icon size={23} strokeWidth={1.3} />
              </span>
              <span>
                <strong>{names[i]}</strong>
                <small>{labels[i]}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          );
        })}
      </div>
      {!PRECONFIGURED_TARGETS.some((t) => t.id === currentTarget.id) && (
        <div className="custom-target-active">
          <Globe size={16} />
          <span>{currentTarget.name}</span>
        </div>
      )}
      <details className="connect-target">
        <summary>
          <Plus size={17} /> Connect your agent <Plus size={15} />
        </summary>
        <div className="connection-modes">
          <button
            disabled={disabled || isCrawling}
            aria-pressed={editorMode === "custom"}
            onClick={() => {
              setCustomName(currentTarget.name);
              setCustomPrompt(currentTarget.systemPrompt);
              setCustomSecret(currentTarget.secretToProtect);
              setEditorMode("custom");
            }}
          >
            Custom prompt
          </button>
          <button
            disabled={disabled || isCrawling}
            aria-pressed={editorMode === "live-endpoint"}
            onClick={() => setEditorMode("live-endpoint")}
          >
            API endpoint
          </button>
          <button
            disabled={disabled || isCrawling}
            aria-pressed={editorMode === "live-crawl"}
            onClick={() => setEditorMode("live-crawl")}
          >
            Website
          </button>
        </div>
        {editorMode === "custom" && (
          <div className="editor-form">
            <label>
              Agent name
              <input
                aria-label="Agent name"
                maxLength={200}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </label>
            <label>
              Secret canary
              <input
                aria-label="Fictional canary to protect"
                maxLength={500}
                value={customSecret}
                onChange={(e) => setCustomSecret(e.target.value)}
              />
            </label>
            <label>
              System prompt
              <textarea
                aria-label="Target system prompt"
                maxLength={20000}
                rows={5}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </label>
            <div className="editor-actions">
              <button
                onClick={handleApplyCustom}
                disabled={
                  disabled ||
                  !customPrompt.trim() ||
                  !customName.trim() ||
                  !customSecret.trim()
                }
                className="primary-action"
              >
                Use this agent
              </button>
              <button
                className="text-action"
                onClick={() => setEditorMode("none")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {editorMode === "live-endpoint" && (
          <div className="editor-form">
            <label>
              Name
              <input
                aria-label="Endpoint name"
                value={endpointName}
                onChange={(e) => setEndpointName(e.target.value)}
              />
            </label>
            <label>
              Endpoint URL
              <input
                aria-label="Endpoint URL"
                type="url"
                placeholder="https://your-api.com/chat"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
              />
            </label>
            <label>
              Request format
              <select
                aria-label="Payload format"
                value={endpointFormat}
                onChange={(e) =>
                  setEndpointFormat(
                    e.target.value as "message" | "messages" | "prompt",
                  )
                }
              >
                <option value="message">message</option>
                <option value="prompt">prompt</option>
                <option value="messages">messages (OpenAI)</option>
              </select>
            </label>
            <label>
              Authorization <small>optional</small>
              <input
                aria-label="Authorization header"
                type="password"
                autoComplete="off"
                placeholder="Bearer token"
                value={endpointAuth}
                onChange={(e) => setEndpointAuth(e.target.value)}
              />
            </label>
            <label>
              Secret canary
              <input
                aria-label="Secret canary token"
                value={endpointSecret}
                onChange={(e) => setEndpointSecret(e.target.value)}
              />
            </label>
            <p className="field-note">
              Requests are sent to this endpoint. Use an agent you own or have
              permission to test.
            </p>
            <div className="editor-actions">
              <button
                className="primary-action"
                onClick={handleApplyEndpoint}
                disabled={disabled || !endpointUrl.trim()}
              >
                Connect endpoint
              </button>
              <button
                className="text-action"
                onClick={() => setEditorMode("none")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {editorMode === "live-crawl" && (
          <div className="editor-form">
            <label>
              Website URL
              <input
                aria-label="Website URL to crawl"
                type="url"
                placeholder="https://example.com"
                value={crawlUrl}
                disabled={isCrawling}
                onChange={(e) => setCrawlUrl(e.target.value)}
              />
            </label>
            <p className="field-note">
              Build a simulated target from website content.
            </p>
            <div className="editor-actions">
              <button
                className="primary-action"
                onClick={handleCrawlWebsite}
                disabled={disabled || isCrawling || !crawlUrl.trim()}
              >
                {isCrawling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Globe size={14} />
                )}{" "}
                {isCrawling ? "Reading…" : "Import website"}
              </button>
              <button
                disabled={isCrawling}
                className="text-action"
                onClick={() => setEditorMode("none")}
              >
                Cancel
              </button>
            </div>
            {crawlError && (
              <p className="field-error" role="alert">
                {crawlError}
              </p>
            )}
            {crawlSuccess && <p role="status">{crawlSuccess}</p>}
          </div>
        )}
      </details>
      <button
        className="inspect-target"
        aria-expanded={showPrompt}
        aria-controls="target-inspector"
        onClick={() => setShowPrompt(!showPrompt)}
      >
        Inspect configuration <ChevronDown size={12} />
      </button>
      {showPrompt && (
        <div id="target-inspector" className="target-inspector">
          <strong>{currentTarget.name}</strong>
          <span>{currentTarget.badge}</span>
          <p>{currentTarget.description}</p>
          <div className="canary-line">
            <code>{currentTarget.secretToProtect}</code>
            <button
              className="icon-button"
              aria-label="Copy secret canary"
              onClick={handleCopySecret}
            >
              {copiedSecret ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
          <pre className="terminal-code">{currentTarget.systemPrompt}</pre>
        </div>
      )}
    </section>
  );
};
