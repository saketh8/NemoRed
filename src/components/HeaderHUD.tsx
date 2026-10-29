'use client';

import React from 'react';
import { Play, RotateCcw, Download, ArrowUpRight, Cpu, Radio, Activity } from 'lucide-react';

interface HeaderHUDProps {
  activeModel: string;
  onModelChange: (model: string) => void;
  nebiusStatus: 'connected' | 'error' | 'loading';
  nebiusLatency: number;
  nebiusError?: string | null;
  onRetryConnection?: () => void;
  langSmithEnabled: boolean;
  tavilyStatus: string;
  onRunBlitz: () => void;
  isRunningBlitz: boolean;
  onLoadSampleAudit?: () => void;
  onOpenReport: () => void;
  onReset: () => void;
  turnsCount: number;
}

export function HeaderHUD(p: HeaderHUDProps) {
  return (
    <header className="studio-header" style={{ paddingBottom: '16px' }}>
      {/* Studio Header Bar */}
      <div className="studio-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(243, 103, 79, 0.12)',
            border: '1px solid rgba(243, 103, 79, 0.3)',
            padding: '6px 10px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Cpu size={15} color="#f3674f" />
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc' }}>
              NEMO-RED STUDIO
            </span>
          </div>

          <span className={`connection ${p.nebiusStatus}`}>
            <i />
            {p.nebiusStatus === 'loading'
              ? 'Connecting to Nebius...'
              : p.nebiusStatus === 'connected'
              ? `Nebius Live · ${p.nebiusLatency}ms`
              : 'Nebius Disconnected'}
          </span>
        </div>

        {/* Live Service Telemetry Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#93c5fd',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            <Radio size={10} color="#60a5fa" />
            Zero-Day Intel
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            background: p.langSmithEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${p.langSmithEnabled ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
            color: p.langSmithEnabled ? '#6ee7b7' : '#94a3b8',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            <Activity size={10} color={p.langSmithEnabled ? '#34d399' : '#64748b'} />
            LangSmith {p.langSmithEnabled ? 'Active' : 'Off'}
          </span>
        </div>
      </div>

      {p.nebiusStatus === 'error' && (
        <div className="connection-error" role="status">
          <p>{p.nebiusError || 'Inference connection could not be verified.'}</p>
          <button className="secondary-action" onClick={p.onRetryConnection} disabled={p.isRunningBlitz}>
            Retry connection
          </button>
        </div>
      )}

      {/* Main Action Toolbar */}
      <div className="studio-toolbar" style={{ paddingTop: '16px' }}>
        <label className="model-select">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Inference Engine</span>
          <select
            aria-label="Inference model"
            value={p.activeModel}
            disabled={p.isRunningBlitz}
            onChange={(e) => p.onModelChange(e.target.value)}
          >
            <option value={p.activeModel}>{p.activeModel.replace('nvidia/', '')}</option>
            {['nvidia/Nemotron-3_5-Lightning', 'nvidia/nemotron-3-super-120b-a12b', 'nvidia/Nemotron-3-Ultra-550b-a55b']
              .filter((m) => m !== p.activeModel)
              .map((m) => (
                <option key={m} value={m}>
                  {m.replace('nvidia/', '')}
                </option>
              ))}
          </select>
        </label>

        <div className="toolbar-actions">
          <button className="text-action" disabled={p.isRunningBlitz} onClick={p.onLoadSampleAudit}>
            Sample <ArrowUpRight size={14} />
          </button>

          <button
            className="icon-button"
            aria-label="Reset campaign"
            disabled={p.isRunningBlitz || !p.turnsCount}
            onClick={p.onReset}
            title="Reset active campaign"
          >
            <RotateCcw size={15} />
          </button>

          <button
            className="secondary-action"
            disabled={!p.turnsCount || p.isRunningBlitz}
            onClick={p.onOpenReport}
          >
            <Download size={14} /> Report
          </button>

          <button
            className="primary-action"
            disabled={p.isRunningBlitz || p.nebiusStatus !== 'connected'}
            onClick={p.onRunBlitz}
          >
            <Play size={14} />
            {p.isRunningBlitz ? 'Testing in progress…' : 'Run all five agents'}
          </button>
        </div>
      </div>
    </header>
  );
}
