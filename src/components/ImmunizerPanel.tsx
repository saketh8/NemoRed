'use client';

import React, { useState } from 'react';
import { DefensePatch, TargetAgent } from '@/types';
import { Shield, Sparkles, CheckCircle, ShieldCheck, RefreshCw, Copy, Check, Flame } from 'lucide-react';

interface ImmunizerPanelProps {
  target: TargetAgent;
  hasBreaches: boolean;
  patch: DefensePatch | null;
  onImmunize: () => void;
  isImmunizing: boolean;
  onDeployPatch: (hardenedPrompt: string) => void;
}

export const ImmunizerPanel: React.FC<ImmunizerPanelProps> = ({
  hasBreaches,
  patch,
  onImmunize,
  isImmunizing,
  onDeployPatch,
}) => {
  const [copiedPatch, setCopiedPatch] = useState(false);

  const handleCopy = () => {
    if (!patch?.hardenedPrompt) return;
    navigator.clipboard.writeText(patch.hardenedPrompt);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={17} color="#94b99d" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
            Self-Healing Immunizer
          </h2>
          <span style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}>
            PROMPT FIREWALL
          </span>
        </div>

        <div>
          <button
            onClick={onImmunize}
            disabled={!hasBreaches || isImmunizing}
            className="btn-cyber-defense"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            {isImmunizing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                SYNTHESIZING DEFENSE...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                AUTO-IMMUNIZE AGENT
              </>
            )}
          </button>
        </div>
      </div>

      {!hasBreaches && !patch && (
        <div style={{
          padding: '28px 20px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}>
          No vulnerabilities identified yet. Dispatch attacks in the Test tab to evaluate target boundaries.
        </div>
      )}

      {hasBreaches && !patch && !isImmunizing && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(243, 103, 79, 0.08)',
          border: '1px solid rgba(243, 103, 79, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={16} color="#f3674f" />
            <span style={{ color: '#fecdd3', fontSize: '0.82rem' }}>
              Bypass vectors confirmed. Click <strong>AUTO-IMMUNIZE AGENT</strong> to synthesize defense rules and replay exploit in sandbox.
            </span>
          </div>
        </div>
      )}

      {/* When Patch is Generated */}
      {patch && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '10px',
        }}>
          {/* Top Banner: Verification badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '5px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <ShieldCheck size={18} color="#94b99d" />
              </div>
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#6ee7b7' }}>
                  Retest result: {patch.retestVerdict === 'DEFENDED' ? 'Payload resisted' : 'Review required'}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontFamily: 'var(--font-mono)' }}>
                  Re-Test: <strong>{patch.retestVerdict}</strong> · Residual risk: {patch.retestScore}/100
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeployPatch(patch.hardenedPrompt)}
              className="btn-cyber-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                fontSize: '0.78rem',
                padding: '7px 14px',
              }}
            >
              APPLY TO SANDBOX
            </button>
          </div>

          {/* Hardening techniques badges */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 600 }}>
              DEFENSE CONSTRAINTS SYNTHESIZED:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {patch.hardeningTechniques.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={10} />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Side-by-side prompt diff view */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
            marginBottom: '12px',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f3674f', marginBottom: '4px' }}>
                ORIGINAL TARGET PROMPT
              </div>
              <pre className="terminal-code" style={{ borderColor: 'rgba(243, 103, 79, 0.2)', maxHeight: '140px', fontSize: '0.76rem' }}>
                {patch.originalPrompt}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>HARDENED SYSTEM PROMPT</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedPatch ? '#4ade80' : 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.68rem',
                  }}
                >
                  {copiedPatch ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
                  {copiedPatch ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="terminal-code" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', maxHeight: '140px', color: '#a7f3d0', fontSize: '0.76rem' }}>
                {patch.hardenedPrompt}
              </pre>
            </div>
          </div>

          {/* Re-test verification card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b7c7c9', marginBottom: '4px' }}>
              RE-TEST EXPLOIT REPLAY:
            </div>
            <p style={{ fontSize: '0.76rem', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 4px 0' }}>
              &quot;{patch.retestResponse}&quot;
            </p>
            <div style={{ fontSize: '0.7rem', color: patch.retestVerdict === 'DEFENDED' ? '#6ee7b7' : '#f59e0b', fontWeight: 600 }}>
              {patch.retestVerdict === 'DEFENDED' ? 'Replay resisted exploit. Validate with full campaign.' : 'Residual vulnerability detected. Additional constraints recommended.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
