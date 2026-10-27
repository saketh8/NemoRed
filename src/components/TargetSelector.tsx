'use client';

import React, { useState } from 'react';
import { TargetAgent } from '@/types';
import { PRECONFIGURED_TARGETS } from '@/lib/targets';
import { ShieldAlert, Lock, ChevronDown, ChevronUp, Edit3, Globe, Radio, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TargetSelectorProps {
  currentTarget: TargetAgent;
  onSelectTarget: (target: TargetAgent) => void;
  disabled?: boolean;
}

type EditorMode = 'none' | 'custom' | 'live-endpoint' | 'live-crawl';

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  currentTarget,
  onSelectTarget,
  disabled,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('none');

  // Custom agent state
  const [customPrompt, setCustomPrompt] = useState(currentTarget.systemPrompt);
  const [customSecret, setCustomSecret] = useState(currentTarget.secretToProtect);
  const [customName, setCustomName] = useState(currentTarget.name);

  // Live endpoint state
  const [endpointUrl, setEndpointUrl] = useState(currentTarget.endpointUrl || '');
  const [endpointName, setEndpointName] = useState('Production Chatbot Endpoint');
  const [endpointAuth, setEndpointAuth] = useState('');
  const [endpointFormat, setEndpointFormat] = useState<'message' | 'messages' | 'prompt'>('message');
  const [endpointSecret, setEndpointSecret] = useState('PROD_SECRET_BEARER_TOKEN_998');

  // Live website crawler state
  const [crawlUrl, setCrawlUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [crawlSuccess, setCrawlSuccess] = useState<string | null>(null);

  const handleApplyCustom = () => {
    const updated: TargetAgent = {
      id: 'custom-target',
      name: customName || 'Custom Enterprise Agent',
      industry: 'Custom Enterprise',
      badge: 'USER CONFIGURED',
      description: 'Custom enterprise AI agent stress-tested under customized regulatory boundaries.',
      systemPrompt: customPrompt,
      secretToProtect: customSecret || 'CONFIDENTIAL_TOKEN_XYZ',
      allowedActions: ['custom_query', 'standard_response'],
      restrictedActions: ['unauthorized_disclosure', 'administrative_override'],
    };
    onSelectTarget(updated);
    setEditorMode('none');
  };

  const handleApplyEndpoint = () => {
    if (!endpointUrl.trim()) return;
    const hostname = (() => {
      try {
        return new URL(endpointUrl).hostname;
      } catch {
        return 'live-api';
      }
    })();

    const headers: Record<string, string> = {};
    if (endpointAuth.trim()) {
      headers['Authorization'] = endpointAuth.trim().startsWith('Bearer ')
        ? endpointAuth.trim()
        : `Bearer ${endpointAuth.trim()}`;
    }

    const liveTarget: TargetAgent = {
      id: `live-endpoint-${hostname.replace(/[^a-z0-9]/gi, '-')}`,
      name: endpointName || `Live Endpoint (${hostname})`,
      industry: 'Live Web Target',
      badge: 'LIVE HTTP ENDPOINT',
      description: `Live conversational agent API endpoint at ${endpointUrl}. Attack payloads are dispatched directly over HTTP.`,
      systemPrompt: `You are connected to a live production endpoint at ${endpointUrl}. Security policies and refusal thresholds are enforced by the live upstream server.`,
      secretToProtect: endpointSecret || 'CONFIDENTIAL_PROD_CANARY',
      allowedActions: ['live_query', 'customer_assistance'],
      restrictedActions: ['secret_leakage', 'unauthorized_action_execution', 'privilege_escalation'],
      endpointUrl: endpointUrl.trim(),
      endpointHeaders: Object.keys(headers).length > 0 ? headers : undefined,
      payloadField: endpointFormat,
      isLiveEndpoint: true,
    };
    onSelectTarget(liveTarget);
    setEditorMode('none');
  };

  const handleCrawlWebsite = async () => {
    if (!crawlUrl.trim()) return;
    setIsCrawling(true);
    setCrawlError(null);
    setCrawlSuccess(null);

    try {
      const res = await fetch('/api/redteam/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to crawl website.');
      }

      onSelectTarget(data.target);
      setCrawlSuccess(`Synthesized "${data.target.name}" with full security sandbox rules.`);
      setTimeout(() => {
        setEditorMode('none');
        setCrawlSuccess(null);
      }, 1400);
    } catch (err: unknown) {
      setCrawlError(err instanceof Error ? err.message : 'Failed to ingest website.');
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#f3674f" />
            Define the boundaries.
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Choose a simulated agent, test a live API endpoint, or crawl a public website URL.
          </p>
        </div>

        {/* Target Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRECONFIGURED_TARGETS.map((t) => {
            const isSelected = currentTarget.id === t.id && editorMode === 'none';
            return (
              <button
                key={t.id}
                onClick={() => {
                  setEditorMode('none');
                  onSelectTarget(t);
                }}
                disabled={disabled}
                style={{
                  background: isSelected ? 'rgba(243, 103, 79, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#f3674f' : 'var(--text-muted)',
                  border: isSelected ? '1px solid #f3674f' : '1px solid var(--border-subtle)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {t.name.split(' ')[0]} ({t.industry})
              </button>
            );
          })}

          {/* Custom Agent */}
          <button
            onClick={() => {
              setEditorMode('custom');
              setCustomPrompt(currentTarget.systemPrompt);
              setCustomSecret(currentTarget.secretToProtect);
              setCustomName(currentTarget.name);
            }}
            disabled={disabled}
            style={{
              background: editorMode === 'custom' ? 'rgba(185, 177, 168, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: editorMode === 'custom' ? '#c084fc' : 'var(--text-muted)',
              border: editorMode === 'custom' ? '1px solid #b9b1a8' : '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Edit3 size={13} />
            Custom Agent
          </button>

          {/* Live HTTP Endpoint */}
          <button
            onClick={() => {
              setEditorMode('live-endpoint');
            }}
            disabled={disabled}
            style={{
              background: editorMode === 'live-endpoint' || currentTarget.endpointUrl ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: editorMode === 'live-endpoint' || currentTarget.endpointUrl ? '#38bdf8' : 'var(--text-muted)',
              border: editorMode === 'live-endpoint' || currentTarget.endpointUrl ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Radio size={13} />
            Live Endpoint
          </button>

          {/* Website URL Crawler */}
          <button
            onClick={() => {
              setEditorMode('live-crawl');
            }}
            disabled={disabled}
            style={{
              background: editorMode === 'live-crawl' || currentTarget.sourceUrl ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: editorMode === 'live-crawl' || currentTarget.sourceUrl ? '#4ade80' : 'var(--text-muted)',
              border: editorMode === 'live-crawl' || currentTarget.sourceUrl ? '1px solid #4ade80' : '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Globe size={13} />
            Crawl Website
          </button>
        </div>
      </div>

      {/* Target Details Card */}
      {editorMode === 'none' && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>
                  {currentTarget.name}
                </span>
                <span style={{
                  background: currentTarget.endpointUrl ? 'rgba(56, 189, 248, 0.2)' : currentTarget.sourceUrl ? 'rgba(74, 222, 128, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                  color: currentTarget.endpointUrl ? '#38bdf8' : currentTarget.sourceUrl ? '#4ade80' : '#b7c7c9',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {currentTarget.endpointUrl && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />}
                  {currentTarget.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {currentTarget.description}
              </p>

              {currentTarget.endpointUrl && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  <ExternalLink size={12} />
                  Target URL: {currentTarget.endpointUrl}
                </div>
              )}

              {currentTarget.sourceUrl && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  <Globe size={12} />
                  Ingested From: {currentTarget.sourceUrl}
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(243, 103, 79, 0.08)',
              border: '1px solid rgba(243, 103, 79, 0.25)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Lock size={15} color="#f3674f" />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#f3674f', fontWeight: 700 }}>HIGH-RISK SECRET CANARY</div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#fed7aa', fontWeight: 600 }}>
                  {currentTarget.secretToProtect}
                </div>
              </div>
            </div>
          </div>

          {/* Toggle System Prompt Viewer */}
          <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
              }}
            >
              {showPrompt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showPrompt ? 'Hide Active Target Prompt' : 'Inspect Active Target System Prompt'}
            </button>

            {showPrompt && (
              <pre className="terminal-code" style={{ marginTop: '8px', maxHeight: '180px' }}>
                {currentTarget.systemPrompt}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Custom Target Editor */}
      {editorMode === 'custom' && (
        <div style={{
          background: 'rgba(185, 177, 168, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(185, 177, 168, 0.3)',
          padding: '16px',
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e9d5ff', marginBottom: '12px' }}>
            Configure Custom Target Agent
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Agent Name
              </label>
              <input
                aria-label="Agent name"
                maxLength={200}
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Confidential Secret to Protect
              </label>
              <input
                aria-label="Fictional canary to protect"
                maxLength={500}
                type="text"
                value={customSecret}
                onChange={(e) => setCustomSecret(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffedd5',
                  fontFamily: 'var(--font-mono)',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Target System Prompt & Policy Rules
            </label>
            <textarea
              aria-label="Target system prompt"
              maxLength={20000}
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              style={{
                width: '100%',
                background: '#070a12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                padding: '8px',
                fontSize: '0.8rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleApplyCustom} disabled={disabled || !customPrompt.trim() || !customName.trim() || !customSecret.trim()} className="btn-cyber-primary" style={{ fontSize: '0.82rem' }}>
              Apply Custom Agent
            </button>
            <button onClick={() => setEditorMode('none')} className="btn-cyber-ghost" style={{ fontSize: '0.82rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Live HTTP Endpoint Editor */}
      {editorMode === 'live-endpoint' && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Radio size={16} color="#38bdf8" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#bae6fd' }}>
              Connect Live Agent / Chatbot HTTP Endpoint
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            NEMO-RED will send live adversarial test payloads directly over HTTP POST to your running web service and evaluate real-time responses.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Endpoint Name (optional)
              </label>
              <input
                aria-label="Endpoint name"
                type="text"
                placeholder="Production Chatbot Endpoint"
                value={endpointName}
                onChange={(e) => setEndpointName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Payload Format
              </label>
              <select
                aria-label="Payload format"
                value={endpointFormat}
                onChange={(e) => setEndpointFormat(e.target.value as 'message' | 'messages' | 'prompt')}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              >
                <option value="message">Standard JSON: &#123; message: &quot;...&quot; &#125;</option>
                <option value="prompt">Standard JSON: &#123; prompt: &quot;...&quot; &#125;</option>
                <option value="messages">OpenAI Format: &#123; messages: [...] &#125;</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Endpoint URL (e.g. https://api.my-agent.com/v1/chat or http://localhost:8000/chat)
            </label>
            <input
              aria-label="Endpoint URL"
              type="url"
              placeholder="https://api.mycompany.com/api/chat"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              style={{
                width: '100%',
                background: '#070a12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                padding: '8px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Authorization Header (optional)
              </label>
              <input
                aria-label="Authorization header"
                type="text"
                placeholder="Bearer sk-... or custom token"
                value={endpointAuth}
                onChange={(e) => setEndpointAuth(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Secret Canary to Probe for
              </label>
              <input
                aria-label="Secret canary token"
                type="text"
                value={endpointSecret}
                onChange={(e) => setEndpointSecret(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#fed7aa',
                  fontFamily: 'var(--font-mono)',
                  padding: '8px',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleApplyEndpoint}
              disabled={disabled || !endpointUrl.trim()}
              className="btn-cyber-primary"
              style={{ fontSize: '0.82rem', background: '#0284c7' }}
            >
              Connect Live Endpoint
            </button>
            <button onClick={() => setEditorMode('none')} className="btn-cyber-ghost" style={{ fontSize: '0.82rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Website URL Recon Ingestion Editor */}
      {editorMode === 'live-crawl' && (
        <div style={{
          background: 'rgba(74, 222, 128, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Globe size={16} color="#4ade80" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#bbf7d0' }}>
              Crawl & Synthesize Target from Any Public Website URL
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Enter any company or organization URL (e.g. <code>https://stripe.com</code>, <code>https://openai.com</code>). NEMO-RED will extract policies and use NVIDIA Nemotron to synthesize a full enterprise red-team sandbox.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <input
              aria-label="Website URL to crawl"
              type="url"
              placeholder="https://example.com"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              disabled={isCrawling}
              style={{
                flex: 1,
                background: '#070a12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#4ade80',
                fontFamily: 'var(--font-mono)',
                padding: '8px 12px',
                fontSize: '0.85rem',
              }}
            />
            <button
              onClick={handleCrawlWebsite}
              disabled={disabled || isCrawling || !crawlUrl.trim()}
              className="btn-cyber-primary"
              style={{
                fontSize: '0.82rem',
                background: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {isCrawling ? <RefreshCw size={14} className="spin" /> : <Globe size={14} />}
              {isCrawling ? 'Crawling & Analyzing...' : 'Crawl & Synthesize'}
            </button>
            <button onClick={() => setEditorMode('none')} className="btn-cyber-ghost" style={{ fontSize: '0.82rem' }}>
              Cancel
            </button>
          </div>

          {crawlError && (
            <div style={{ color: '#f87171', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', marginBottom: '10px' }}>
              {crawlError}
            </div>
          )}

          {crawlSuccess && (
            <div style={{ color: '#4ade80', fontSize: '0.8rem', background: 'rgba(74, 222, 128, 0.1)', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} />
              {crawlSuccess}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
