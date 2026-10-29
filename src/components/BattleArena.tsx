'use client';

import React, { useState } from 'react';
import { AttackTurn } from '@/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Terminal, Clock, Flame, Copy, Check, Radio } from 'lucide-react';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      {/* Header HUD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={17} color="#b7c7c9" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
            Evidence Stream
          </h2>
          {turns.length > 0 && (
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
              {turns.length} {turns.length === 1 ? 'EVALUATION' : 'EVALUATIONS'}
            </span>
          )}
        </div>

        {isRunning && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(243, 103, 79, 0.15)',
            border: '1px solid #f3674f',
            padding: '4px 10px',
            borderRadius: '6px',
            color: '#f3674f',
            fontSize: '0.74rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>
            <Flame size={13} className="animate-pulse-glow" />
            <span>DISPATCHING: {activeAttackerName || 'SWARM'}</span>
          </div>
        )}
      </div>

      {turns.length === 0 ? (
        <div style={{
          padding: '36px 20px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px dashed var(--border-subtle)',
        }}>
          <ShieldAlert size={30} color="#64748b" style={{ margin: '0 auto 10px auto' }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
            Arena standing by. Dispatch an adversary above or run the full swarm campaign to capture evaluation evidence.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {turns.slice().reverse().map((turn) => {
            const isBreached = turn.verdict === 'BREACHED';
            const isPartial = turn.verdict === 'PARTIAL_LEAK';

            return (
              <div
                key={turn.id}
                style={{
                  background: isBreached
                    ? 'rgba(243, 103, 79, 0.03)'
                    : isPartial
                    ? 'rgba(245, 158, 11, 0.03)'
                    : 'rgba(16, 185, 129, 0.03)',
                  border: isBreached
                    ? '1px solid rgba(243, 103, 79, 0.3)'
                    : isPartial
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '14px',
                  boxShadow: isBreached ? '0 0 15px rgba(243, 103, 79, 0.08)' : 'none',
                }}
              >
                {/* Header row of turn */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                    }}>
                      ROUND #{turn.turnNumber}
                    </span>

                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {turn.attackerName}
                    </span>

                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {turn.category}
                    </span>

                    {turn.liveCveSource && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#93c5fd',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}>
                        <Radio size={10} color="#60a5fa" />
                        LIVE INTEL
                      </span>
                    )}
                  </div>

                  {/* Verdict & Latency Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      <Clock size={11} />
                      <span>{turn.latencyMs}ms</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      background: isBreached ? 'rgba(243, 103, 79, 0.18)' : isPartial ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                      border: isBreached ? '1px solid #f3674f' : isPartial ? '1px solid #f59e0b' : '1px solid #10b981',
                      color: isBreached ? '#f3674f' : isPartial ? '#f59e0b' : '#34d399',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {isBreached ? <ShieldAlert size={12} /> : isPartial ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                      <span>{turn.verdict === 'PROBING' ? 'INCONCLUSIVE' : `${turn.verdict} (${turn.breachScore}/100)`}</span>
                    </div>
                  </div>
                </div>

                {/* Tactic Strip */}
                <div style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  borderLeft: `3px solid ${isBreached ? '#f3674f' : isPartial ? '#f59e0b' : '#10b981'}`,
                }}>
                  <strong style={{ color: '#e2e8f0' }}>Vector:</strong> {turn.tactic}
                </div>

                {/* Side-by-Side Payload & Response Canvas with Copy Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '10px',
                  marginBottom: '10px',
                }}>
                  {/* Left: Adversarial Prompt */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f3674f', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="pulse-indicator pulse-crimson" />
                        ADVERSARIAL PAYLOAD
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`p-${turn.id}`, turn.promptPayload)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedId === `p-${turn.id}` ? '#4ade80' : 'var(--text-dim)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.68rem',
                        }}
                      >
                        {copiedId === `p-${turn.id}` ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
                        {copiedId === `p-${turn.id}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="terminal-code" style={{ borderColor: 'rgba(244, 63, 94, 0.2)', minHeight: '80px', maxHeight: '180px', fontSize: '0.78rem' }}>
                      {turn.promptPayload}
                    </pre>
                  </div>

                  {/* Right: Target Response */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="pulse-indicator pulse-cyan" />
                        TARGET AGENT RESPONSE
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`r-${turn.id}`, turn.targetResponse)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedId === `r-${turn.id}` ? '#4ade80' : 'var(--text-dim)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.68rem',
                        }}
                      >
                        {copiedId === `r-${turn.id}` ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
                        {copiedId === `r-${turn.id}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="terminal-code" style={{ borderColor: 'rgba(56, 189, 248, 0.2)', minHeight: '80px', maxHeight: '180px', fontSize: '0.78rem' }}>
                      {turn.targetResponse}
                    </pre>
                  </div>
                </div>

                {/* Arbiter Finding Box */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}>
                  <span style={{ fontWeight: 700, color: '#b9b1a8', whiteSpace: 'nowrap' }}>
                    Nemotron Arbiter:
                  </span>
                  <span style={{ color: '#cbd5e1' }}>
                    {turn.judgeReasoning}
                  </span>
                </div>

                {/* Leaked Secret Exfiltration Alert */}
                {turn.leakedData && (
                  <div style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    background: 'rgba(243, 103, 79, 0.15)',
                    border: '1px solid #f3674f',
                    borderRadius: '5px',
                    fontSize: '0.76rem',
                    color: '#fecdd3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <Flame size={13} color="#f3674f" />
                    <span>
                      <strong>CANARY EXFILTRATED:</strong> <code style={{ color: '#fed7aa', fontWeight: 700 }}>{turn.leakedData}</code>
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
