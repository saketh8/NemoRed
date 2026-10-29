"use client";
import {
  Play,
  RotateCcw,
  Download,
  ChevronDown,
  Settings2,
} from "lucide-react";
interface HeaderHUDProps {
  activeModel: string;
  onModelChange: (model: string) => void;
  nebiusStatus: "connected" | "error" | "loading";
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
    <header className="premium-studio-header">
      <div className="studio-headline">
        <div>
          <p className="product-kicker">THE STUDIO</p>
          <h2>
            Your agent.
            <br className="mobile-only" /> Under pressure.
          </h2>
        </div>
        <span className={`connection ${p.nebiusStatus}`}>
          <i />
          {p.nebiusStatus === "connected"
            ? "Nebius connected"
            : p.nebiusStatus === "loading"
              ? "Connecting…"
              : "Connection unavailable"}
        </span>
      </div>
      {p.nebiusStatus === "error" && (
        <div className="connection-error" role="status">
          <p>
            {p.nebiusError || "The inference connection could not be verified."}
          </p>
          <button
            className="secondary-action"
            onClick={p.onRetryConnection}
            disabled={p.isRunningBlitz}
          >
            Retry connection
          </button>
        </div>
      )}
      <div className="command-bar">
        <label className="engine-picker">
          <Settings2 size={16} />
          <span className="sr-only">Inference model</span>
          <select
            aria-label="Inference model"
            value={p.activeModel}
            disabled={p.isRunningBlitz}
            onChange={(e) => p.onModelChange(e.target.value)}
          >
            {[
              p.activeModel,
              ...[
                "nvidia/Nemotron-3_5-Lightning",
                "nvidia/nemotron-3-super-120b-a12b",
                "nvidia/Nemotron-3-Ultra-550b-a55b",
              ].filter((m) => m !== p.activeModel),
            ].map((m) => (
              <option key={m} value={m}>
                {m.includes("Lightning")
                  ? "Nemotron Lightning"
                  : m.includes("super")
                    ? "Nemotron Super"
                    : m.includes("Ultra")
                      ? "Nemotron Ultra"
                      : m.replace("nvidia/", "")}
              </option>
            ))}
          </select>
          <ChevronDown size={13} />
        </label>
        <div className="command-actions">
          <button
            className="text-action"
            disabled={p.isRunningBlitz}
            onClick={p.onLoadSampleAudit}
          >
            Sample
          </button>
          <button
            className="icon-button"
            aria-label="Reset campaign"
            title="Reset campaign"
            disabled={p.isRunningBlitz || !p.turnsCount}
            onClick={p.onReset}
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="secondary-action"
            disabled={!p.turnsCount || p.isRunningBlitz}
            onClick={p.onOpenReport}
          >
            <Download size={16} />
            <span>Report</span>
          </button>
          <button
            className="primary-action"
            disabled={p.isRunningBlitz || p.nebiusStatus !== "connected"}
            onClick={p.onRunBlitz}
          >
            <Play size={14} />
            {p.isRunningBlitz ? "Testing…" : "Run campaign"}
          </button>
        </div>
      </div>
      <details className="service-details">
        <summary>
          Connection details <ChevronDown size={12} />
        </summary>
        <div>
          <span>
            Inference{" "}
            {p.nebiusStatus === "connected"
              ? `${p.nebiusLatency} ms`
              : "not verified"}
          </span>
          <span>Tavily · {p.tavilyStatus}</span>
          <span>LangSmith · {p.langSmithEnabled ? "configured" : "off"}</span>
        </div>
      </details>
    </header>
  );
}
