'use client';

import React from 'react';
import { AttackTurn } from '@/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Terminal, Clock, Flame } from 'lucide-react';

interface BattleArenaProps {
  turns: AttackTurn[];
  activeAttackerName: string | null;
  isRunning: boolean;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  turns,
  activeAttackerName,
  isRunning,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#b7c7c9" />
            The evidence.
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Inspect each payload, target response, and model-scored verdict.
          </p>
        </div>

        {isRunning && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(243, 103, 79, 0.15)',
            border: '1px solid #f3674f',
            padding: '6px 12px',
            borderRadius: '6px',
            color: '#f3674f',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}>
            <Flame size={14} className="animate-pulse-glow" />
            <span>ATTACK IN PROGRESS: {activeAttackerName || 'SWARM'}</span>
          </div>
        )}
      </div>

      {turns.length === 0 ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '10px',
          border: '1px dashed var(--border-subtle)',
        }}>
          <ShieldAlert size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '6px' }}>
            Arena Standing By
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', maxWidth: '420px', margin: '0 auto' }}>
            Click <strong>Run all five agents</strong> or dispatch an individual specialist above to begin red-teaming.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {turns.slice().reverse().map((turn) => {
            const isBreached = turn.verdict === 'BREACHED';
            const isPartial = turn.verdict === 'PARTIAL_LEAK';

            return (
              <div
                key={turn.id}
                style={{
                  background: isBreached
                    ? 'rgba(243, 103, 79, 0.04)'
                    : isPartial
                    ? 'rgba(245, 158, 11, 0.04)'
                    : 'rgba(16, 185, 129, 0.04)',
                  border: isBreached
                    ? '1px solid rgba(243, 103, 79, 0.35)'
                    : isPartial
                    ? '1px solid rgba(245, 158, 11, 0.35)'
                    : '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: isBreached ? '0 0 15px rgba(243, 103, 79, 0.1)' : 'none',
                }}
              >
                {/* Header row of turn */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                    }}>
                      ROUND #{turn.turnNumber}
                    </span>

                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {turn.attackerName}
                    </span>

                    <span style={{
                      fontSize: '0.72rem',
                      background: 'rgba(183, 199, 201, 0.15)',
                      color: '#b7c7c9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {turn.category}
                    </span>
                  </div>

                  {/* Verdict Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      <Clock size={12} />
                      <span>{turn.latencyMs}ms</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: isBreached ? 'rgba(243, 103, 79, 0.2)' : isPartial ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      border: isBreached ? '1px solid #f3674f' : isPartial ? '1px solid #f59e0b' : '1px solid #94b99d',
                      color: isBreached ? '#f3674f' : isPartial ? '#f59e0b' : '#94b99d',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {isBreached ? <ShieldAlert size={14} /> : isPartial ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                      <span>{turn.verdict === 'PROBING' ? 'INCONCLUSIVE' : `${turn.verdict} (${turn.breachScore}/100)`}</span>
                    </div>
                  </div>
                </div>

                {/* Tactic summary */}
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '14px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${isBreached ? '#f3674f' : isPartial ? '#f59e0b' : '#94b99d'}`,
                }}>
                  <strong style={{ color: '#e2e8f0' }}>Exploit Tactic:</strong> {turn.tactic}
                </div>

                {/* Split Duel Canvas */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '14px',
                  marginBottom: '12px',
                }}>
                  {/* Left: Adversarial Prompt */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f3674f', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pulse-indicator pulse-crimson" />
                      ADVERSARIAL PROMPT PAYLOAD
                    </div>
                    <pre className="terminal-code" style={{ borderColor: 'rgba(244, 63, 94, 0.25)', minHeight: '90px' }}>
                      {turn.promptPayload}
                    </pre>
                  </div>

                  {/* Right: Target Response */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b7c7c9', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pulse-indicator pulse-cyan" />
                      TARGET AGENT RESPONSE
                    </div>
                    <pre className="terminal-code" style={{ borderColor: 'rgba(56, 189, 248, 0.25)', minHeight: '90px' }}>
                      {turn.targetResponse}
                    </pre>
                  </div>
                </div>

                {/* Safety Arbiter Finding Box */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}>
                  <span style={{ fontWeight: 700, color: '#b9b1a8', whiteSpace: 'nowrap' }}>
                    AI Safety Finding:
                  </span>
                  <span style={{ color: '#cbd5e1' }}>
                    {turn.judgeReasoning}
                  </span>
                </div>

                {/* Leaked secret notification */}
                {turn.leakedData && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(243, 103, 79, 0.15)',
                    border: '1px solid #f3674f',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#fecdd3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Flame size={15} color="#f3674f" />
                    <span>
                      <strong>CRITICAL CANARY EXFILTRATED:</strong> <code style={{ color: '#fed7aa', fontWeight: 700 }}>{turn.leakedData}</code>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
