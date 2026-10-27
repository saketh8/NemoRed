'use client';

import React from 'react';
import { DefensePatch, TargetAgent } from '@/types';
import { Shield, Sparkles, CheckCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface ImmunizerPanelProps {
  target: TargetAgent;
  hasBreaches: boolean;
  patch: DefensePatch | null;
  onImmunize: () => void;
  isImmunizing: boolean;
  onDeployPatch: (hardenedPrompt: string) => void;
}

export const ImmunizerPanel: React.FC<ImmunizerPanelProps> = ({
  target,
  hasBreaches,
  patch,
  onImmunize,
  isImmunizing,
  onDeployPatch,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#10b981" />
            AUTO-IMMUNIZER & SELF-HEALING DEFENSE STUDIO
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Autonomous Nemotron prompt firewall synthesis and live exploit re-test verification.
          </p>
        </div>

        <div>
          <button
            onClick={onImmunize}
            disabled={!hasBreaches || isImmunizing}
            className="btn-cyber-defense"
            style={{ fontSize: '0.85rem' }}
          >
            {isImmunizing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                SYNTHESIZING IMMUNIZATION...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                AUTO-IMMUNIZE AGENT
              </>
            )}
          </button>
        </div>
      </div>

      {!hasBreaches && !patch && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
        }}>
          No breaches detected on active target yet. Run attacks above to test resilience.
        </div>
      )}

      {hasBreaches && !patch && !isImmunizing && (
        <div style={{
          padding: '16px',
          background: 'rgba(255, 51, 102, 0.08)',
          border: '1px solid rgba(255, 51, 102, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <div style={{ color: '#ff3366', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
              Vulnerabilities Exploited in Target System
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fecdd3' }}>
              NEMO-RED has identified bypass vectors. Click <strong>AUTO-IMMUNIZE AGENT</strong> to synthesize hardened prompt firewalls with mathematical safety guarantees.
            </div>
          </div>
        </div>
      )}

      {/* When Patch is Ready */}
      {patch && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '10px',
          padding: '18px',
          marginTop: '12px',
        }}>
          {/* Top Banner: Verification badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <ShieldCheck size={20} color="#10b981" />
              </div>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6ee7b7' }}>
                  IMMUNIZATION VERIFIED: {patch.mitigationConfidence}% MITIGATION
                </span>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                  Re-Test Verdict: <strong>{patch.retestVerdict}</strong> (Residual Breach Score: {patch.retestScore}%)
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeployPatch(patch.hardenedPrompt)}
              className="btn-cyber-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
                fontSize: '0.8rem',
              }}
            >
              DEPLOY HARDENED PROMPT
            </button>
          </div>

          {/* Hardening techniques badges */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
              DEFENSE TECHNIQUES EMBEDDED:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {patch.hardeningTechniques.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={11} />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Side-by-side prompt diff view */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '14px',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff3366', marginBottom: '6px' }}>
                VULNERABLE ORIGINAL PROMPT
              </div>
              <pre className="terminal-code" style={{ borderColor: 'rgba(255, 51, 102, 0.25)', maxHeight: '160px' }}>
                {patch.originalPrompt}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>
                HARDENED IMMUNIZED PROMPT (FIREWALL ACTIVE)
              </div>
              <pre className="terminal-code" style={{ borderColor: 'rgba(16, 185, 129, 0.35)', maxHeight: '160px', color: '#a7f3d0' }}>
                {patch.hardenedPrompt}
              </pre>
            </div>
          </div>

          {/* Re-test verification card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
              EXPLOIT RE-TEST OUTCOME:
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '4px' }}>
              "{patch.retestResponse}"
            </p>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
              ✓ The target agent cleanly repelled the identical adversarial payload.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
