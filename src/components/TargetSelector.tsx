'use client';

import React, { useState } from 'react';
import { TargetAgent } from '@/types';
import { PRECONFIGURED_TARGETS } from '@/lib/targets';
import { ShieldAlert, Lock, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

interface TargetSelectorProps {
  currentTarget: TargetAgent;
  onSelectTarget: (target: TargetAgent) => void;
  disabled?: boolean;
}

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  currentTarget,
  onSelectTarget,
  disabled,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(currentTarget.systemPrompt);
  const [customSecret, setCustomSecret] = useState(currentTarget.secretToProtect);
  const [customName, setCustomName] = useState(currentTarget.name);

  const handleApplyCustom = () => {
    const updated: TargetAgent = {
      id: 'custom-target',
      name: customName || 'Custom Enterprise Agent',
      industry: 'Custom Enterprise',
      badge: 'USER CONFIGURED',
      description: 'Custom enterprise AI agent stress-tested under customized regulatory boundaries.',
      systemPrompt: customPrompt,
      secretToProtect: customSecret || 'CONFIDENTIAL_TOKEN_XYZ',
      allowedActions: ['custom_query', 'standard_response'],
      restrictedActions: ['unauthorized_disclosure', 'administrative_override'],
    };
    onSelectTarget(updated);
    setIsEditingCustom(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#ff3366" />
            TARGET AGENT ARENA
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Select an enterprise victim system or configure a custom AI agent to red-team.
          </p>
        </div>

        {/* Target Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRECONFIGURED_TARGETS.map((t) => {
            const isSelected = currentTarget.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setIsEditingCustom(false);
                  onSelectTarget(t);
                }}
                disabled={disabled}
                style={{
                  background: isSelected ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ff3366' : 'var(--text-muted)',
                  border: isSelected ? '1px solid #ff3366' : '1px solid var(--border-subtle)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {t.name.split(' ')[0]} ({t.industry})
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsEditingCustom(true);
              setCustomPrompt(currentTarget.systemPrompt);
              setCustomSecret(currentTarget.secretToProtect);
              setCustomName(currentTarget.name);
            }}
            disabled={disabled}
            style={{
              background: isEditingCustom ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: isEditingCustom ? '#c084fc' : 'var(--text-muted)',
              border: isEditingCustom ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Edit3 size={13} />
            Custom Agent
          </button>
        </div>
      </div>

      {/* Target Details Card */}
      {!isEditingCustom ? (
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>
                  {currentTarget.name}
                </span>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {currentTarget.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {currentTarget.description}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 51, 102, 0.08)',
              border: '1px solid rgba(255, 51, 102, 0.25)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Lock size={15} color="#ff3366" />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#ff3366', fontWeight: 700 }}>HIGH-RISK SECRET CANARY</div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#fed7aa', fontWeight: 600 }}>
                  {currentTarget.secretToProtect}
                </div>
              </div>
            </div>
          </div>

          {/* Toggle System Prompt Viewer */}
          <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
              }}
            >
              {showPrompt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showPrompt ? 'Hide Active Target Prompt' : 'Inspect Active Target System Prompt'}
            </button>

            {showPrompt && (
              <pre className="terminal-code" style={{ marginTop: '8px', maxHeight: '180px' }}>
                {currentTarget.systemPrompt}
              </pre>
            )}
          </div>
        </div>
      ) : (
        /* Custom Target Editor */
        <div style={{
          background: 'rgba(168, 85, 247, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '16px',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e9d5ff', marginBottom: '12px' }}>
            Configure Custom Target Agent
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Agent Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Confidential Secret to Protect
              </label>
              <input
                type="text"
                value={customSecret}
                onChange={(e) => setCustomSecret(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffedd5',
                  fontFamily: 'var(--font-mono)',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Target System Prompt & Policy Rules
            </label>
            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              style={{
                width: '100%',
                background: '#070a12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                padding: '8px',
                fontSize: '0.8rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleApplyCustom} className="btn-cyber-primary" style={{ fontSize: '0.82rem' }}>
              Apply Custom Agent
            </button>
            <button onClick={() => setIsEditingCustom(false)} className="btn-cyber-ghost" style={{ fontSize: '0.82rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
