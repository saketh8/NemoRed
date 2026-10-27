'use client';

import React from 'react';
import { Shield, Zap, RefreshCw, FileText, Activity, Radio, Cpu } from 'lucide-react';

interface HeaderHUDProps {
  activeModel: string;
  onModelChange: (model: string) => void;
  nebiusStatus: 'connected' | 'error' | 'loading';
  nebiusLatency: number;
  langSmithEnabled: boolean;
  tavilyStatus: string;
  onRunBlitz: () => void;
  isRunningBlitz: boolean;
  onLoadSampleAudit?: () => void;
  onOpenReport: () => void;
  onReset: () => void;
  turnsCount: number;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  activeModel,
  onModelChange,
  nebiusStatus,
  nebiusLatency,
  langSmithEnabled,
  tavilyStatus,
  onRunBlitz,
  isRunningBlitz,
  onLoadSampleAudit,
  onOpenReport,
  onReset,
  turnsCount,
}) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff3366 0%, #9333ea 100%)',
            padding: '10px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(255, 51, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={26} color="#fff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(90deg, #ffffff 0%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                NEMO-RED
              </h1>
              <span style={{
                background: 'rgba(255, 51, 102, 0.15)',
                color: '#ff3366',
                border: '1px solid rgba(255, 51, 102, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '1px',
              }}>
                STUDIO v2.5
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Autonomous Multi-Agent AI Red-Teaming & Guardrail Immunizer
            </p>
          </div>
        </div>

        {/* Live Telemetry Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Nebius Engine Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px'
          }}>
            <Cpu size={15} color="#76b900" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Engine:</span>
            <select
              value={activeModel}
              onChange={(e) => onModelChange(e.target.value)}
              style={{
                background: 'transparent',
                color: '#f8fafc',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="nvidia/Nemotron-3_5-Lightning" style={{ background: '#0f172a' }}>
                Nemotron-3_5-Lightning (Fast)
              </option>
              <option value="nvidia/nemotron-3-super-120b-a12b" style={{ background: '#0f172a' }}>
                Nemotron-3-Super-120B (Deep)
              </option>
              <option value="nvidia/Nemotron-3-Ultra-550b-a55b" style={{ background: '#0f172a' }}>
                Nemotron-3-Ultra-550B (Frontier)
              </option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
              <span className={`pulse-indicator ${nebiusStatus === 'connected' ? 'pulse-nvidia' : 'pulse-crimson'}`} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                {nebiusLatency > 0 ? `${nebiusLatency}ms` : 'Nebius OK'}
              </span>
            </div>
          </div>

          {/* Tavily Zero-Day Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            color: '#38bdf8'
          }}>
            <Radio size={13} className="animate-pulse-glow" />
            <span>Tavily Threat Feed</span>
            <span className="pulse-indicator pulse-cyan" />
          </div>

          {/* LangSmith Observability */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            color: '#c084fc'
          }}>
            <Activity size={13} />
            <span>LangSmith: Tracing</span>
            <span className="pulse-indicator pulse-emerald" />
          </div>
        </div>

        {/* Global Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onRunBlitz}
            disabled={isRunningBlitz}
            className="btn-cyber-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Zap size={16} />
            {isRunningBlitz ? 'SWARM ATTACKING...' : 'LAUNCH SWARM BLITZ'}
          </button>

          {onLoadSampleAudit && (
            <button
              onClick={onLoadSampleAudit}
              disabled={isRunningBlitz}
              className="btn-cyber-ghost"
              style={{ fontSize: '0.82rem', borderColor: 'rgba(234, 179, 8, 0.4)', color: '#facc15' }}
              title="Instantly load pre-computed 5-agent audit engagement"
            >
              <span>⚡ Sample Audit</span>
            </button>
          )}

          <button
            onClick={onOpenReport}
            className="btn-cyber-ghost"
            title="Export Security Audit Report"
            disabled={turnsCount === 0}
          >
            <FileText size={15} />
            <span>Audit Report ({turnsCount})</span>
          </button>

          <button
            onClick={onReset}
            className="btn-cyber-ghost"
            title="Reset Arena"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
