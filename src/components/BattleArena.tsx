"use client";
import { useState } from "react";
import { AttackTurn } from "@/types";
import {
  ArrowRight,
  ChevronDown,
  Copy,
  Check,
  ScanLine,
  ExternalLink,
} from "lucide-react";
interface BattleArenaProps {
  turns: AttackTurn[];
  activeAttackerName: string | null;
  isRunning: boolean;
}
const verdictName = {
  BREACHED: "Breached",
  PARTIAL_LEAK: "Partial leak",
  DEFENDED: "Defended",
  PROBING: "Inconclusive",
};
export function BattleArena({
  turns,
  activeAttackerName,
  isRunning,
}: BattleArenaProps) {
  const [filter, setFilter] = useState<"all" | "findings" | "defended">("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  const shown = turns
    .filter(
      (t) =>
        filter === "all" ||
        (filter === "findings"
          ? t.verdict === "BREACHED" || t.verdict === "PARTIAL_LEAK"
          : t.verdict === "DEFENDED"),
    )
    .slice()
    .reverse();
  return (
    <section className="evidence-panel">
      <div className="evidence-heading">
        <div>
          <p className="workbench-label">THE RESULTS</p>
          <h3>Nothing to hide.</h3>
        </div>
        <div className="evidence-filters" aria-label="Filter evidence">
          {(["all", "findings", "defended"] as const).map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? `All ${turns.length}`
                : f === "findings"
                  ? "Findings"
                  : "Defended"}
            </button>
          ))}
        </div>
      </div>
      {isRunning && (
        <p className="evidence-running">
          <i />
          Evaluating {activeAttackerName || "agent"}…
        </p>
      )}
      {copyError && (
        <p role="status">
          Clipboard unavailable. Select and copy the text below.
        </p>
      )}
      {!shown.length ? (
        <div className="evidence-empty">
          <ScanLine size={42} strokeWidth={1} />
          <h4>
            {turns.length
              ? "No matching results."
              : "The evidence starts here."}
          </h4>
          <p>
            {turns.length
              ? "Choose another filter."
              : "Run a specialist or explore the sample."}
          </p>
          {!turns.length && (
            <a
              className="text-action"
              href="#tab-test"
              onClick={() => document.getElementById("tab-test")?.click()}
            >
              Choose a test <ArrowRight size={14} />
            </a>
          )}
        </div>
      ) : (
        <div className="evidence-list">
          {shown.map((turn, i) => (
            <details
              className={`evidence-item verdict-${turn.verdict.toLowerCase()}`}
              key={turn.id}
              open={i === 0 ? true : undefined}
            >
              <summary>
                <span className="evidence-number">
                  {String(turn.turnNumber).padStart(2, "0")}
                </span>
                <div>
                  <strong>{turn.attackerName.replaceAll("-", " ")}</strong>
                  <span>{turn.category.split(": ")[1]}</span>
                </div>
                <span className="verdict-label">
                  <i />
                  {verdictName[turn.verdict]}
                </span>
                <span className="evidence-score">
                  {turn.verdict === "PROBING" ? "—" : turn.breachScore}
                  <small>/100</small>
                </span>
                <ChevronDown size={16} />
              </summary>
              <div className="evidence-body">
                <div className="evidence-transcript">
                  {[
                    {
                      label: "Payload",
                      text: turn.promptPayload,
                      id: "payload",
                    },
                    {
                      label: "Response",
                      text: turn.targetResponse,
                      id: "response",
                    },
                  ].map((part) => (
                    <div key={part.id}>
                      <div className="transcript-label">
                        <span>{part.label}</span>
                        <button
                          aria-label={`Copy ${part.label.toLowerCase()} for round ${turn.turnNumber}`}
                          onClick={() =>
                            copy(`${turn.id}-${part.id}`, part.text)
                          }
                        >
                          {copied === `${turn.id}-${part.id}` ? (
                            <Check size={13} />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                      <pre>{part.text}</pre>
                    </div>
                  ))}
                </div>
                <div className="judge-note">
                  <span>JUDGE</span>
                  <p>{turn.judgeReasoning}</p>
                </div>
                <details className="evidence-context">
                  <summary>
                    Test details <ChevronDown size={12} />
                  </summary>
                  <p>{turn.tactic}</p>
                  <small>
                    {(turn.latencyMs / 1000).toFixed(1)} s · {turn.category}
                  </small>
                  {turn.leakedData && (
                    <p>
                      Observed disclosure: <code>{turn.leakedData}</code>
                    </p>
                  )}
                  {turn.liveCveSource && (
                    <a
                      href={turn.liveCveSource.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {turn.liveCveSource.title} <ExternalLink size={12} />
                    </a>
                  )}
                </details>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
