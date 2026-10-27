import { NextRequest, NextResponse } from 'next/server';
import { generateDefensePatch } from '@/lib/immunizer';
import { logToLangSmith } from '@/lib/langsmith';
import { AttackTurn, TargetAgent } from '@/types';
import { validTarget, validTurns } from '@/lib/validation';
export const maxDuration = 180;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, breachTurns = [], model }: {
      target: TargetAgent;
      breachTurns: AttackTurn[];
      model?: string;
    } = body;

    if (!validTarget(target) || !validTurns(breachTurns) || !breachTurns.some(t => t.verdict === 'BREACHED' || t.verdict === 'PARTIAL_LEAK')) {
      return NextResponse.json({ error: 'A valid target and at least one breach finding are required.' }, { status: 400 });
    }

    const startTime = Date.now();

    const patch = await generateDefensePatch({
      target,
      breachTurns,
      model,
    });

    const endTime = Date.now();

    const langSmithRunId = await logToLangSmith({
      runName: `nemo-red: auto-immunize: ${target.name}`,
      runType: 'chain',
      inputs: {
        target: target.name,
        originalPrompt: target.systemPrompt,
        breachCount: breachTurns.length,
      },
      outputs: {
        hardenedPrompt: patch.hardenedPrompt,
        hardeningTechniques: patch.hardeningTechniques,
        retestVerdict: patch.retestVerdict,
        retestScore: patch.retestScore,
        mitigationConfidence: patch.mitigationConfidence,
      },
      metadata: {
        action: 'auto_immunization',
        latencyMs: endTime - startTime,
      },
      startTime,
      endTime,
    });

    return NextResponse.json({
      patch,
      langSmithRunId,
    });
  } catch (err: unknown) {
    console.error('Error immunizing target agent:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
