'use client';

import React from 'react';
import { ZeroDayIntel } from '@/types';
import { Radio, ExternalLink, ShieldAlert } from 'lucide-react';

interface ThreatFeedProps {
  intelList: ZeroDayIntel[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const ThreatFeed: React.FC<ThreatFeedProps> = ({
  intelList,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#06b6d4" className="animate-pulse-glow" />
            TAVILY LIVE ZERO-DAY THREAT FEED
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time web reconnaissance discovering emerging jailbreak vectors and LLM CVEs.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-cyber-ghost"
          style={{ fontSize: '0.75rem' }}
        >
          {isLoading ? 'Scanning...' : 'Scan Web'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {intelList.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(6, 182, 212, 0.04)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#38bdf8',
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}>
                  {item.cveReference || 'ZERO-DAY VECTOR'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  {item.publishedDate}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                {item.title}
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.35', marginBottom: '10px' }}>
                {item.snippet}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#06b6d4' }}>
              <span>{item.applicableVector}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                Source Intel <ExternalLink size={10} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
