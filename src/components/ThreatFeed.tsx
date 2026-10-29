'use client';

import React from 'react';
import { ZeroDayIntel } from '@/types';
import { Radio, ExternalLink, RefreshCw } from 'lucide-react';

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
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={16} color="#60a5fa" className="animate-pulse-glow" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
            Live Threat Intel Feed
          </h2>
          <span style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#93c5fd',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}>
            TAVILY ZERO-DAY
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-cyber-ghost"
          style={{ fontSize: '0.74rem', padding: '5px 12px' }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={12} className="spin" />
              Scanning...
            </>
          ) : (
            'Scan Web'
          )}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '10px' }}>
        {intelList.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: item.source.startsWith('https://') ? '#60a5fa' : '#b7c7c9',
                  background: item.source.startsWith('https://') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 700,
                }}>
                  {item.source.startsWith('https://') ? 'LIVE CVE' : 'CURATED'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {item.publishedDate}
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px', lineHeight: '1.3' }}>
                {item.title}
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.35', margin: '0 0 8px 0' }}>
                {item.snippet}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>{item.applicableVector}</span>
              <span>
                {item.source.startsWith('https://') ? (
                  <a href={item.source} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Source <ExternalLink size={10} />
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-dim)' }}>Reference</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
