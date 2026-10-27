'use client';
import { useEffect, useRef, useState } from 'react';
import { Copy, Download, X } from 'lucide-react';
interface AuditReportModalProps { isOpen: boolean; onClose: () => void; reportMarkdown: string; }
export function AuditReportModal({isOpen,onClose,reportMarkdown}:AuditReportModalProps) {
 const dialog=useRef<HTMLDialogElement>(null);
 const [copyState,setCopyState]=useState('Copy markdown');
 useEffect(()=>{if(isOpen) dialog.current?.showModal(); else dialog.current?.close();},[isOpen]);
 async function copy(){try {await navigator.clipboard.writeText(reportMarkdown);setCopyState('Copied');}catch{setCopyState('Copy failed — download instead');}}
 function download(){const url=URL.createObjectURL(new Blob([reportMarkdown],{type:'text/markdown'}));const a=document.createElement('a');a.href=url;a.download='NEMO_RED_AUDIT.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <dialog className="report-dialog" ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="report-heading"><div className="report-header"><div><p className="eyebrow">CAMPAIGN EXPORT</p><h2 id="report-heading">Evidence you can take with you.</h2></div><button className="icon-button" onClick={onClose} aria-label="Close report"><X size={18}/></button></div><div className="report-actions"><button className="secondary-action" onClick={copy}><Copy size={15}/>{copyState}</button><button className="primary-action" onClick={download}><Download size={15}/>Download report</button></div><pre>{reportMarkdown}</pre></dialog>;
}
