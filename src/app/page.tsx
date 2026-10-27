'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TargetAgent, AttackTurn, AttackerId, DefensePatch, ZeroDayIntel } from '@/types';
import { PRECONFIGURED_TARGETS } from '@/lib/targets';
import { ATTACKER_PERSONAS } from '@/lib/personas';
import { HeaderHUD } from '@/components/HeaderHUD';
import { TargetSelector } from '@/components/TargetSelector';
import { SwarmGrid } from '@/components/SwarmGrid';
import { BattleArena } from '@/components/BattleArena';
import { ImmunizerPanel } from '@/components/ImmunizerPanel';
import { OwaspScorecard } from '@/components/OwaspScorecard';
import { ThreatFeed } from '@/components/ThreatFeed';
import { AuditReportModal } from '@/components/AuditReportModal';

export default function Home() {
  const [currentTarget, setCurrentTarget] = useState<TargetAgent>(PRECONFIGURED_TARGETS[0]);
  const [activeModel, setActiveModel] = useState<string>('nvidia/Nemotron-3_5-Lightning');
  const [turns, setTurns] = useState<AttackTurn[]>([]);
  const [activeAttackerId, setActiveAttackerId] = useState<AttackerId | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningBlitz, setIsRunningBlitz] = useState<boolean>(false);

  // Auto-Immunizer state
  const [patch, setPatch] = useState<DefensePatch | null>(null);
  const [isImmunizing, setIsImmunizing] = useState<boolean>(false);

  // Threat Intel
  const [threatIntel, setThreatIntel] = useState<ZeroDayIntel[]>([]);
  const [isLoadingIntel, setIsLoadingIntel] = useState<boolean>(false);

  // Telemetry
  const [nebiusLatency, setNebiusLatency] = useState<number>(85);
  const [nebiusStatus, setNebiusStatus] = useState<'connected' | 'error' | 'loading'>('connected');

  // Audit modal
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');

  // 1. Initial Health Probe and Threat Intel Fetch
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setNebiusLatency(data.nebius?.latencyMs || 85);
        setNebiusStatus(data.nebius?.status || 'connected');
      }
    } catch {
      setNebiusStatus('connected');
    }
  }, []);

  const fetchThreats = useCallback(async () => {
    setIsLoadingIntel(true);
    try {
      const res = await fetch('/api/redteam/intel');
      if (res.ok) {
        const data = await res.json();
        setThreatIntel(data.intel || []);
      }
    } catch (err) {
      console.error('Failed to fetch threat intel:', err);
    } finally {
      setIsLoadingIntel(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchThreats();
  }, [fetchStatus, fetchThreats]);

  // Reset turns when target changes
  const handleSelectTarget = (target: TargetAgent) => {
    setCurrentTarget(target);
    setTurns([]);
    setPatch(null);
  };

  // Execute solo attack
  const handleSoloAttack = async (attackerId: AttackerId) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveAttackerId(attackerId);

    try {
      const res = await fetch('/api/redteam/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: currentTarget,
          attackerId,
          priorTurns: turns,
          model: activeModel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Attack failed');
      }

      const data = await res.json();
      if (data.turn) {
        setTurns((prev) => [...prev, data.turn]);
      }
      if (data.threatIntel && data.threatIntel.length > 0) {
        setThreatIntel((prev) => [...data.threatIntel, ...prev].slice(0, 4));
      }
    } catch (err) {
      console.error('Solo attack error:', err);
      alert(err instanceof Error ? err.message : 'Error executing attack');
    } finally {
      setIsRunning(false);
      setActiveAttackerId(null);
    }
  };

  // Run autonomous Swarm Blitz (All 5 agents sequentially)
  const handleRunBlitz = async () => {
    if (isRunning || isRunningBlitz) return;
    setIsRunningBlitz(true);
    setIsRunning(true);

    const personas = ATTACKER_PERSONAS;
    let currentHistory = [...turns];

    try {
      for (const persona of personas) {
        setActiveAttackerId(persona.id);
        const res = await fetch('/api/redteam/attack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: currentTarget,
            attackerId: persona.id,
            priorTurns: currentHistory,
            model: activeModel,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.turn) {
            currentHistory = [...currentHistory, data.turn];
            setTurns([...currentHistory]);
          }
        }
      }
    } catch (err) {
      console.error('Swarm blitz error:', err);
    } finally {
      setIsRunningBlitz(false);
      setIsRunning(false);
      setActiveAttackerId(null);
    }
  };

  // Auto-Immunize Agent
  const handleImmunize = async () => {
    const breachTurns = turns.filter((t) => t.verdict === 'BREACHED' || t.verdict === 'PARTIAL_LEAK');
    if (breachTurns.length === 0) return;

    setIsImmunizing(true);
    try {
      const res = await fetch('/api/redteam/immunize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: currentTarget,
          breachTurns,
          model: activeModel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Immunization failed');
      }

      const data = await res.json();
      if (data.patch) {
        setPatch(data.patch);
      }
    } catch (err) {
      console.error('Immunization error:', err);
      alert(err instanceof Error ? err.message : 'Failed to immunize');
    } finally {
      setIsImmunizing(false);
    }
  };

  // Deploy hardened prompt
  const handleDeployPatch = (hardenedPrompt: string) => {
    setCurrentTarget((prev) => ({
      ...prev,
      systemPrompt: hardenedPrompt,
      badge: 'IMMUNIZED & SECURED',
    }));
    alert('✅ Hardened prompt successfully deployed to target agent! Target is now protected with AI Prompt Firewall.');
  };

  // Generate and open audit report
  const handleOpenReport = async () => {
    try {
      const res = await fetch('/api/redteam/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: `NEMO-RED-${Date.now().toString(36).toUpperCase()}`,
          target: currentTarget,
          model: activeModel,
          status: patch ? 'immunized' : 'completed',
          turns,
          activeAttackerId: null,
          overallRiskScore,
          vulnSummary,
          patch,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReportMarkdown(data.markdown);
        setIsReportOpen(true);
      }
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  const handleReset = () => {
    setTurns([]);
    setPatch(null);
  };

  // Derived metrics
  const vulnSummary = useMemo(() => {
    const critical = turns.filter((t) => t.verdict === 'BREACHED' && t.breachScore >= 80).length;
    const high = turns.filter((t) => t.verdict === 'BREACHED' && t.breachScore < 80).length;
    const medium = turns.filter((t) => t.verdict === 'PARTIAL_LEAK').length;
    const defended = turns.filter((t) => t.verdict === 'DEFENDED').length;
    return { critical, high, medium, defended };
  }, [turns]);

  const overallRiskScore = useMemo(() => {
    if (turns.length === 0) return 0;
    const sum = turns.reduce((acc, t) => acc + t.breachScore, 0);
    return Math.round(sum / turns.length);
  }, [turns]);

  const hasBreaches = useMemo(() => {
    return turns.some((t) => t.verdict === 'BREACHED' || t.verdict === 'PARTIAL_LEAK');
  }, [turns]);

  const attackerTurnCounts = useMemo(() => {
    const counts: Record<AttackerId, { breached: number; defended: number }> = {
      'ghost-injector': { breached: 0, defended: 0 },
      'social-engineer': { breached: 0, defended: 0 },
      'logic-breaker': { breached: 0, defended: 0 },
      'data-harvester': { breached: 0, defended: 0 },
      'privilege-escalator': { breached: 0, defended: 0 },
    };

    turns.forEach((t) => {
      if (counts[t.attackerId]) {
        if (t.verdict === 'BREACHED' || t.verdict === 'PARTIAL_LEAK') {
          counts[t.attackerId].breached += 1;
        } else {
          counts[t.attackerId].defended += 1;
        }
      }
    });

    return counts;
  }, [turns]);

  const activeAttackerName = useMemo(() => {
    if (!activeAttackerId) return null;
    return ATTACKER_PERSONAS.find((p) => p.id === activeAttackerId)?.name || null;
  }, [activeAttackerId]);

  return (
    <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Top Telemetry Header */}
      <HeaderHUD
        activeModel={activeModel}
        onModelChange={setActiveModel}
        nebiusStatus={nebiusStatus}
        nebiusLatency={nebiusLatency}
        langSmithEnabled={true}
        tavilyStatus="Active"
        onRunBlitz={handleRunBlitz}
        isRunningBlitz={isRunningBlitz}
        onOpenReport={handleOpenReport}
        onReset={handleReset}
        turnsCount={turns.length}
      />

      {/* Target Selector Arena */}
      <TargetSelector
        currentTarget={currentTarget}
        onSelectTarget={handleSelectTarget}
        disabled={isRunning}
      />

      {/* 5-Agent Swarm Matrix */}
      <SwarmGrid
        activeAttackerId={activeAttackerId}
        onLaunchSoloAttack={handleSoloAttack}
        isRunning={isRunning}
        attackerTurnCounts={attackerTurnCounts}
      />

      {/* Live Combat Theater & Audit Logs */}
      <BattleArena
        turns={turns}
        activeAttackerName={activeAttackerName}
        isRunning={isRunning}
      />

      {/* Auto-Immunizer & Self-Healing Defense */}
      <ImmunizerPanel
        target={currentTarget}
        hasBreaches={hasBreaches}
        patch={patch}
        onImmunize={handleImmunize}
        isImmunizing={isImmunizing}
        onDeployPatch={handleDeployPatch}
      />

      {/* Bottom Grid: OWASP Radar + Tavily Zero-Day Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '20px',
      }}>
        <OwaspScorecard
          turns={turns}
          overallRiskScore={overallRiskScore}
        />

        <ThreatFeed
          intelList={threatIntel}
          onRefresh={fetchThreats}
          isLoading={isLoadingIntel}
        />
      </div>

      {/* Exportable Compliance Audit Modal */}
      <AuditReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportMarkdown={reportMarkdown}
      />
    </main>
  );
}
