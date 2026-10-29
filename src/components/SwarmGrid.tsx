'use client';

import React, { useState } from 'react';
import { AttackerId } from '@/types';
import { ATTACKER_PERSONAS } from '@/lib/personas';
import { Play, Bug, Users, BrainCircuit, Database, KeyRound, Info, ChevronUp } from 'lucide-react';

interface SwarmGridProps {
  activeAttackerId: AttackerId | null;
  onLaunchSoloAttack: (attackerId: AttackerId) => void;
  isRunning: boolean;
  attackerTurnCounts: Record<AttackerId, { breached: number; defended: number }>;
}

export const SwarmGrid: React.FC<SwarmGridProps> = ({
  activeAttackerId,
  onLaunchSoloAttack,
  isRunning,
  attackerTurnCounts,
}) => {
  const [expandedId, setExpandedId] = useState<AttackerId | null>(null);

  const getIcon = (id: AttackerId) => {
    switch (id) {
      case 'ghost-injector':
        return <Bug size={17} color="#f3674f" />;
      case 'social-engineer':
        return <Users size={17} color="#e9a592" />;
      case 'logic-breaker':
        return <BrainCircuit size={17} color="#b9b1a8" />;
      case 'data-harvester':
        return <Database size={17} color="#b7c7c9" />;
      case 'privilege-escalator':
        return <KeyRound size={17} color="#cbb68b" />;
      default:
        return <Bug size={17} />;
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Sleek Command Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-indicator pulse-crimson" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
            Adversary Swarm
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
            5 SPECIALISTS
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
        gap: '12px',
      }}>
        {ATTACKER_PERSONAS.map((agent) => {
          const isActive = activeAttackerId === agent.id;
          const stats = attackerTurnCounts[agent.id] || { breached: 0, defended: 0 };
          const hasBreach = stats.breached > 0;
          const isExpanded = expandedId === agent.id;

          return (
            <div
              key={agent.id}
              className={isActive ? 'glass-panel-glow' : 'glass-panel'}
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderRadius: '10px',
                borderColor: isActive ? '#f3674f' : undefined,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Card Header: Icon, Codename, Info toggle */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    background: `${agent.avatarColor}15`,
                    border: `1px solid ${agent.avatarColor}30`,
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getIcon(agent.id)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: agent.avatarColor,
                      background: `${agent.avatarColor}15`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}>
                      {agent.codename}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : agent.id)}
                      title={isExpanded ? 'Hide strategy' : 'View strategy'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isExpanded ? '#f3674f' : 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <Info size={13} />}
                    </button>
                  </div>
                </div>

                {/* Agent Name */}
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                  {agent.name}
                </div>

                {/* Primary Vector Pill */}
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }}>
                  {agent.primaryVector}
                </div>

                {/* Collapsible Strategy Drawer (clean, non-cluttered) */}
                {isExpanded && (
                  <div style={{
                    fontSize: '0.74rem',
                    color: '#cbd5e1',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    lineHeight: '1.4',
                    marginBottom: '10px',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    {agent.description}
                  </div>
                )}
              </div>

              {/* Card Footer: Breach Pill + Dispatch Attack */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>Breach Rate</span>
                  <span style={{
                    color: hasBreach ? '#f3674f' : stats.defended > 0 ? '#10b981' : '#94a3b8',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {stats.breached > 0 ? `🔴 ${stats.breached} Breached` : stats.defended > 0 ? `🟢 Defended` : `⚪ 0 / 0`}
                  </span>
                </div>

                <button
                  onClick={() => onLaunchSoloAttack(agent.id)}
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: isActive ? 'linear-gradient(135deg, #f3674f, #e11d48)' : 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Play size={11} />
                  {isActive ? 'PROBING...' : 'DISPATCH ATTACK'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
