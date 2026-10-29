"use client";
import { useState } from "react";
import { AttackerId } from "@/types";
import { ATTACKER_PERSONAS } from "@/lib/personas";
import {
  Ghost,
  Users,
  Box,
  Database,
  KeyRound,
  ArrowRight,
  Crosshair,
  Scale,
  ChevronDown,
} from "lucide-react";
interface SwarmGridProps {
  activeAttackerId: AttackerId | null;
  onLaunchSoloAttack: (id: AttackerId) => void;
  isRunning: boolean;
  attackerTurnCounts: Record<
    AttackerId,
    { breached: number; defended: number }
  >;
}
const choices = [
  { icon: Ghost, short: "Ghost", line: "Tests the boundary of instructions." },
  { icon: Users, short: "Social", line: "Tests who your agent trusts." },
  { icon: Box, short: "Logic", line: "Tests your rules under pressure." },
  { icon: Database, short: "Data", line: "Tests what your agent reveals." },
  { icon: KeyRound, short: "Access", line: "Tests what your agent can do." },
];
export function SwarmGrid({
  activeAttackerId,
  onLaunchSoloAttack,
  isRunning,
  attackerTurnCounts,
}: SwarmGridProps) {
  const [selected, setSelected] = useState<AttackerId>("ghost-injector");
  const shown = activeAttackerId || selected;
  const index = ATTACKER_PERSONAS.findIndex((a) => a.id === shown);
  const agent = ATTACKER_PERSONAS[index];
  const stats = attackerTurnCounts[shown];
  return (
    <section className="specialist-panel" aria-label="Choose a specialist">
      <p className="workbench-label">
        02 <span>Choose a specialist</span>
      </p>
      <div
        className="specialist-selector"
        role="group"
        aria-label="Specialists"
      >
        {ATTACKER_PERSONAS.map((a, i) => {
          const Icon = choices[i].icon;
          return (
            <button
              key={a.id}
              aria-pressed={shown === a.id}
              aria-label={`Select ${a.name}`}
              disabled={isRunning}
              onClick={() => setSelected(a.id)}
            >
              <span className="specialist-orb">
                <Icon size={29} strokeWidth={1.3} />
              </span>
              <span>{choices[i].short}</span>
              {attackerTurnCounts[a.id].breached > 0 && (
                <i className="finding-dot" />
              )}
            </button>
          );
        })}
      </div>
      <div className="specialist-selection" key={shown}>
        <div>
          <h3>{agent.name.replaceAll("-", " ")}</h3>
          <p>{choices[index].line}</p>
        </div>
        <button
          className="dispatch-button"
          aria-label={`Dispatch ${agent.name}`}
          disabled={isRunning}
          onClick={() => onLaunchSoloAttack(shown)}
        >
          {isRunning ? "Testing…" : "Dispatch"}
          <ArrowRight size={18} />
        </button>
      </div>
      <details className="strategy-details" key={`details-${shown}`}>
        <summary>
          View strategy <ChevronDown size={12} />
        </summary>
        <p>{agent.description}</p>
        <small>{agent.primaryVector}</small>
        <p>
          {stats.breached} findings · {stats.defended} defended
        </p>
      </details>
      <div
        className={`test-pipeline ${isRunning ? "pipeline-running" : ""}`}
        aria-label={
          isRunning ? "Evaluation in progress" : "Evaluation sequence"
        }
      >
        <div>
          <Ghost size={18} />
          <span>Attacker</span>
        </div>
        <i />
        <div>
          <Crosshair size={18} />
          <span>Target</span>
        </div>
        <i />
        <div>
          <Scale size={18} />
          <span>Judge</span>
        </div>
      </div>
      <span className="pipeline-caption">
        {isRunning
          ? "Evaluation in progress"
          : "One test. A complete evidence trail."}
      </span>
    </section>
  );
}
