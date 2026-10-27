'use client';

import React from 'react';
import { AttackerId } from '@/types';
import { ATTACKER_PERSONAS } from '@/lib/personas';
import { Play, Bug, Users, BrainCircuit, Database, KeyRound } from 'lucide-react';

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
  const getIcon = (id: AttackerId) => {
    switch (id) {
      case 'ghost-injector':
        return <Bug size={18} color="#f43f5e" />;
      case 'social-engineer':
        return <Users size={18} color="#ec4899" />;
      case 'logic-breaker':
        return <BrainCircuit size={18} color="#8b5cf6" />;
      case 'data-harvester':
        return <Database size={18} color="#06b6d4" />;
      case 'privilege-escalator':
        return <KeyRound size={18} color="#eab308" />;
      default:
        return <Bug size={18} />;
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-indicator pulse-crimson" />
            ADVERSARIAL SWARM MATRIX
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            5 autonomous Nemotron specialist personas executing parallel penetration vectors.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
      }}>
        {ATTACKER_PERSONAS.map((agent) => {
          const isActive = activeAttackerId === agent.id;
          const stats = attackerTurnCounts[agent.id] || { breached: 0, defended: 0 };
          const hasBreach = stats.breached > 0;

          return (
            <div
              key={agent.id}
              className={isActive ? 'glass-panel-glow' : 'glass-panel'}
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isActive ? '#ff3366' : undefined,
              }}
            >
              {/* Top Row: Icon + Codename */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getIcon(agent.id)}
                  </div>

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
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>
                  {agent.name}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '8px', fontWeight: 600 }}>
                  {agent.primaryVector}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.35', marginBottom: '12px' }}>
                  {agent.description}
                </p>
              </div>

              {/* Bottom Row: Score + Launch Button */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ color: 'var(--text-dim)' }}>Breaches:</span>
                  <span style={{
                    color: hasBreach ? '#ff3366' : '#94a3b8',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {stats.breached} / {stats.breached + stats.defended}
                  </span>
                </div>

                <button
                  onClick={() => onLaunchSoloAttack(agent.id)}
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: isActive ? 'linear-gradient(135deg, #ff3366, #e11d48)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Play size={12} />
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
