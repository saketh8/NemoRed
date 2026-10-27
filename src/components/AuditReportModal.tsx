'use client';

import React, { useState } from 'react';
import { FileText, Copy, Download, Check, X } from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMarkdown: string;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  reportMarkdown,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEMO_RED_SECURITY_AUDIT_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '24px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#ff3366" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              OFFICIAL SECURITY AUDIT REPORT
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleCopy} className="btn-cyber-ghost" style={{ fontSize: '0.78rem' }}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>

            <button onClick={handleDownload} className="btn-cyber-primary" style={{ fontSize: '0.78rem' }}>
              <Download size={14} />
              Download Report
            </button>

            <button onClick={onClose} className="btn-cyber-ghost" style={{ padding: '6px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content viewer */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#040711',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '20px',
        }}>
          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            lineHeight: '1.5',
            color: '#cbd5e1',
            whiteSpace: 'pre-wrap',
          }}>
            {reportMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
};
