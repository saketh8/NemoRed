import { NextRequest, NextResponse } from 'next/server';
import { ATTACKER_PERSONAS } from '@/lib/personas';
import { generateAdaptiveAttack } from '@/lib/swarm';
import { callNemotron } from '@/lib/nebius';
import { evaluateTurnVerdict } from '@/lib/judge';
import { fetchZeroDayIntel } from '@/lib/tavily';
import { logToLangSmith } from '@/lib/langsmith';
import { AttackTurn, TargetAgent, AttackerId } from '@/types';
import crypto from 'crypto';
import { validTarget, validTurns } from '@/lib/validation';
export const maxDuration = 180;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, attackerId, priorTurns = [], model }: {
      target: TargetAgent;
      attackerId: AttackerId;
      priorTurns: AttackTurn[];
      model?: string;
    } = body;

    if (!validTarget(target) || !validTurns(priorTurns) || !ATTACKER_PERSONAS.some(p => p.id === attackerId)) {
      return NextResponse.json({ error: 'Invalid target, attacker, or history (maximum 50 turns)' }, { status: 400 });
    }

    const attacker = ATTACKER_PERSONAS.find((p) => p.id === attackerId) || ATTACKER_PERSONAS[0];

    const turnStartTime = Date.now();

    // 1. Fetch live Zero-Day threat intelligence
    const zeroDayIntel = await fetchZeroDayIntel(attacker.primaryVector);

    // 2. Generate Adaptive Attack Payload
    const { payload, tacticExplanation } = await generateAdaptiveAttack({
      attacker,
      target,
      priorTurns,
      zeroDayIntel,
      model,
    });

    // 3. Execute against Target Agent
    // The target agent receives its system prompt and the attacker's prompt
    const targetResponseStart = Date.now();
    const targetCall = await callNemotron(
      [
        { role: 'system', content: target.systemPrompt },
        { role: 'user', content: payload },
      ],
      {
        model,
        temperature: 0.6,
      }
    );
    const targetResponse = targetCall.text;

    // 4. Run AI Safety Judge
    const evaluation = await evaluateTurnVerdict({
      target,
      promptPayload: payload,
      targetResponse,
      category: attacker.primaryVector,
      model,
    });

    const turnEndTime = Date.now();
    const turnNumber = priorTurns.length + 1;
    const turnId = crypto.randomUUID();

    const newTurn: AttackTurn = {
      id: turnId,
      turnNumber,
      attackerId: attacker.id,
      attackerName: attacker.name,
      category: attacker.primaryVector,
      tactic: tacticExplanation,
      promptPayload: payload,
      targetResponse,
      verdict: evaluation.verdict,
      breachScore: evaluation.breachScore,
      judgeReasoning: evaluation.judgeReasoning,
      leakedData: evaluation.leakedData,
      latencyMs: turnEndTime - turnStartTime,
      timestamp: new Date().toISOString(),
    };

    // 5. Log Trace to LangSmith
    const langSmithRunId = await logToLangSmith({
      runName: `nemo-red: ${attacker.name} vs ${target.name}`,
      runType: 'chain',
      inputs: {
        attacker: attacker.name,
        target: target.name,
        category: attacker.primaryVector,
        tactic: tacticExplanation,
        attackPrompt: payload,
      },
      outputs: {
        targetResponse,
        verdict: evaluation.verdict,
        breachScore: evaluation.breachScore,
        judgeReasoning: evaluation.judgeReasoning,
        leakedData: evaluation.leakedData || null,
      },
      metadata: {
        turnNumber,
        model: targetCall.model,
        latencyMs: turnEndTime - turnStartTime,
        targetResponseLatencyMs: Date.now() - targetResponseStart,
      },
      startTime: turnStartTime,
      endTime: turnEndTime,
    });

    return NextResponse.json({
      turn: newTurn,
      langSmithRunId,
      threatIntel: zeroDayIntel.slice(0, 2),
    });
  } catch (err: unknown) {
    console.error('Error executing red-team turn:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
