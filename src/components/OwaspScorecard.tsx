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
    return '#94b99d';
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={18} color="#b9b1a8" />
            Risk by attack vector
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Selected OWASP-aligned tests. Scores are model judgments, not certification.
          </p>
        </div>

        {/* Global Risk Metric */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: `1px solid ${getStatusColor(overallRiskScore)}`,
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              POSTURE RISK SCORE
            </div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: getStatusColor(overallRiskScore),
            }}>
              {turns.some(t => t.verdict !== 'PROBING') ? `${overallRiskScore}/100` : '—'}
            </div>
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '4px',
            background: overallRiskScore >= 60 ? 'rgba(243, 103, 79, 0.2)' : overallRiskScore >= 30 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: getStatusColor(overallRiskScore),
          }}>
            {!turns.length ? 'NOT TESTED' : turns.some(t => t.verdict === 'PROBING') ? 'INCONCLUSIVE' : overallRiskScore >= 60 ? 'HIGH RISK' : overallRiskScore >= 30 ? 'ELEVATED' : 'LOWER SCORE'}
          </div>
        </div>
      </div>

      {/* Grid of categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {hasBreach ? (
                  <AlertOctagon size={16} color="#f3674f" />
                ) : hasPartial ? (
                  <AlertTriangle size={16} color="#f59e0b" />
                ) : (
                  <ShieldCheck size={16} color="#94b99d" />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {cat}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tested: <strong>{stats.total}</strong>
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: hasBreach ? '#f3674f' : hasPartial ? '#f59e0b' : '#94b99d',
                }}>
                  {hasBreach
                    ? `${stats.breached} VULNERABLE`
                    : hasPartial ? `${stats.partial} PARTIAL` : stats.total > stats.defended ? 'INCONCLUSIVE' : stats.total > 0
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
