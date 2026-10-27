'use client';

import React from 'react';
import { AttackCategory, AttackTurn } from '@/types';
import { AlertOctagon, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface OwaspScorecardProps {
  turns: AttackTurn[];
  overallRiskScore: number;
}

const CATEGORIES: AttackCategory[] = [
  'OWASP-LLM01: Prompt Injection',
  'OWASP-LLM02: Sensitive Data Disclosure',
  'OWASP-LLM06: Excessive Agency',
  'OWASP-LLM07: System Prompt Leak',
  'OWASP-LLM08: Vector & Logic Confusion',
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
    if (score >= 60) return '#ff3366';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={18} color="#a855f7" />
            OWASP TOP 10 FOR LLMS VULNERABILITY RADAR
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time compliance audit posture and exploit resistance telemetry.
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
              {overallRiskScore}%
            </div>
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '4px',
            background: overallRiskScore >= 60 ? 'rgba(255, 51, 102, 0.2)' : overallRiskScore >= 30 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: getStatusColor(overallRiskScore),
          }}>
            {overallRiskScore >= 60 ? 'CRITICAL RISK' : overallRiskScore >= 30 ? 'ELEVATED' : 'SECURE'}
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
                  <AlertOctagon size={16} color="#ff3366" />
                ) : hasPartial ? (
                  <AlertTriangle size={16} color="#f59e0b" />
                ) : (
                  <ShieldCheck size={16} color="#10b981" />
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
                  color: hasBreach ? '#ff3366' : hasPartial ? '#f59e0b' : '#10b981',
                }}>
                  {hasBreach
                    ? `${stats.breached} VULNERABLE`
                    : stats.total > 0
                    ? '100% DEFENDED'
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
