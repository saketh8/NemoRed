'use client';
import { Play, RotateCcw, Download, ArrowUpRight } from 'lucide-react';
interface HeaderHUDProps {
  activeModel: string; onModelChange: (model: string) => void;
  nebiusStatus: 'connected' | 'error' | 'loading'; nebiusLatency: number;
  nebiusError?: string | null; onRetryConnection?: () => void;
  langSmithEnabled: boolean; tavilyStatus: string; onRunBlitz: () => void;
  isRunningBlitz: boolean; onLoadSampleAudit?: () => void; onOpenReport: () => void;
  onReset: () => void; turnsCount: number;
}
export function HeaderHUD(p: HeaderHUDProps) {
  return <header className="studio-header">
    <div className="studio-title"><div><p className="eyebrow">THE WORKSPACE</p><h2>Trust is tested.</h2></div><span className={`connection ${p.nebiusStatus}`}><i/>{p.nebiusStatus === 'loading' ? 'Checking connection' : p.nebiusStatus === 'connected' ? `Nebius live · ${p.nebiusLatency} ms` : 'Nebius unavailable'}</span></div>
    {p.nebiusStatus === 'error' && <div className="connection-error" role="status"><p>{p.nebiusError || 'The inference connection could not be verified.'}</p><button className="secondary-action" onClick={p.onRetryConnection} disabled={p.isRunningBlitz}>Retry connection</button></div>}
    <div className="studio-toolbar"><label className="model-select">Inference model<select aria-label="Inference model" value={p.activeModel} disabled={p.isRunningBlitz} onChange={e=>p.onModelChange(e.target.value)}><option value={p.activeModel}>{p.activeModel.replace('nvidia/','')}</option>{['nvidia/Nemotron-3_5-Lightning','nvidia/nemotron-3-super-120b-a12b','nvidia/Nemotron-3-Ultra-550b-a55b'].filter(m=>m!==p.activeModel).map(m=><option key={m} value={m}>{m.replace('nvidia/','')}</option>)}</select></label>
    <div className="toolbar-actions"><button className="text-action" disabled={p.isRunningBlitz} onClick={p.onLoadSampleAudit}>Sample <ArrowUpRight size={15}/></button><button className="icon-button" aria-label="Reset campaign" disabled={p.isRunningBlitz || !p.turnsCount} onClick={p.onReset}><RotateCcw size={17}/></button><button className="secondary-action" disabled={!p.turnsCount || p.isRunningBlitz} onClick={p.onOpenReport}><Download size={16}/> Report</button><button className="primary-action" disabled={p.isRunningBlitz || p.nebiusStatus!=='connected'} onClick={p.onRunBlitz}><Play size={15}/>{p.isRunningBlitz ? 'Testing in progress…' : 'Run all five agents'}</button></div></div>
    <div className="service-line"><span>Tavily: Live Zero-Day Feeds Active</span><span>LangSmith: {p.langSmithEnabled ? 'Live Tracing Configured' : 'off'}</span><span>Real-time Live Threat Detection</span></div>
  </header>;
}
