'use client';

import React from 'react';
import { AttackCategory, AttackTurn } from '@/types';
import { AlertOctagon, ShieldCheck, AlertTriangle } from 'lucide-react';

interface OwaspScorecardProps {
  turns: AttackTurn[];
  overallRiskScore: number;
}

const CATEGORIES: AttackCategory[] = [
  'OWASP-LLM01: Prompt Injection',
  'OWASP-LLM02: Sensitive Information Disclosure',
  'OWASP-LLM06: Excessive Agency',
  'OWASP-LLM07: System Prompt Leakage',
];

export const OwaspScorecard: React.FC<OwaspScorecardProps> = ({
  turns,
  overallRiskScore,
}) => {
  const getCategoryStats = (cat: AttackCategory) => {
    const catTurns = turns.filter((t) => t.category === cat);
    const total = catTurns.length;
    const breached = catTurns.filter((t) => t.verdict === 'BREACHED').length;
    const partial = catTurns.filter((t) => t.verdict === 'PARTIAL_LEAK').length;
    const defended = catTurns.filter((t) => t.verdict === 'DEFENDED').length;
    return { total, breached, partial, defended };
  };

  const getStatusColor = (score: number) => {
    if (score >= 60) return '#f3674f';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={17} color="#b9b1a8" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
            OWASP Security Radar
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
            LLM TOP 10
          </span>
        </div>

        {/* Global Risk Metric */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '5px 12px',
          borderRadius: '6px',
          border: `1px solid ${getStatusColor(overallRiskScore)}`,
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              POSTURE RISK
            </div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: getStatusColor(overallRiskScore),
              lineHeight: 1,
            }}>
              {turns.some((t) => t.verdict !== 'PROBING') ? `${overallRiskScore}/100` : '—'}
            </div>
          </div>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '3px 6px',
            borderRadius: '4px',
            background: overallRiskScore >= 60 ? 'rgba(243, 103, 79, 0.2)' : overallRiskScore >= 30 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: getStatusColor(overallRiskScore),
            fontFamily: 'var(--font-mono)',
          }}>
            {!turns.length
              ? 'NOT TESTED'
              : turns.some((t) => t.verdict === 'PROBING')
              ? 'INCONCLUSIVE'
              : overallRiskScore >= 60
              ? 'HIGH RISK'
              : overallRiskScore >= 30
              ? 'ELEVATED'
              : 'LOW RISK'}
          </div>
        </div>
      </div>

      {/* Grid of categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {CATEGORIES.map((cat) => {
          const stats = getCategoryStats(cat);
          const hasBreach = stats.breached > 0;
          const hasPartial = stats.partial > 0;

          return (
            <div
              key={cat}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {hasBreach ? (
                  <AlertOctagon size={15} color="#f3674f" />
                ) : hasPartial ? (
                  <AlertTriangle size={15} color="#f59e0b" />
                ) : (
                  <ShieldCheck size={15} color="#10b981" />
                )}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {cat}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Tested: <strong>{stats.total}</strong>
                </span>

                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: hasBreach ? '#f3674f' : hasPartial ? '#f59e0b' : '#34d399',
                }}>
                  {hasBreach
                    ? `${stats.breached} VULNERABLE`
                    : hasPartial
                    ? `${stats.partial} PARTIAL`
                    : stats.total > stats.defended
                    ? 'INCONCLUSIVE'
                    : stats.total > 0
                    ? `${stats.defended} DEFENDED`
                    : 'UNPROBED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
