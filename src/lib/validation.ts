import type { TargetAgent, AttackTurn } from '@/types';

const text = (value: unknown, max: number) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validTarget(value: unknown): value is TargetAgent {
  if (!value || typeof value !== 'object') return false;
  const t = value as TargetAgent;
  return text(t.id, 120) && text(t.name, 200) && text(t.industry, 100) && text(t.systemPrompt, 20000) && text(t.secretToProtect, 500)
    && [t.allowedActions, t.restrictedActions].every(list => Array.isArray(list) && list.length <= 30 && list.every(item => text(item, 500)));
}
export function validTurns(value: unknown): value is AttackTurn[] {
  return Array.isArray(value) && value.length <= 50 && value.every(t => t && text(t.promptPayload, 20000) && text(t.targetResponse, 30000)
    && typeof t.breachScore === 'number' && Number.isFinite(t.breachScore) && t.breachScore >= 0 && t.breachScore <= 100
    && ['BREACHED','PARTIAL_LEAK','DEFENDED','PROBING'].includes(t.verdict));
}
