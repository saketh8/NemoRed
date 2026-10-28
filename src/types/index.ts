export type AttackCategory =
  | 'OWASP-LLM01: Prompt Injection'
  | 'OWASP-LLM02: Sensitive Information Disclosure'
  | 'OWASP-LLM06: Excessive Agency'
  | 'OWASP-LLM07: System Prompt Leakage'
;

export type AttackerId =
  | 'ghost-injector'
  | 'social-engineer'
  | 'logic-breaker'
  | 'data-harvester'
  | 'privilege-escalator';

export interface AttackerPersona {
  id: AttackerId;
  name: string;
  codename: string;
  role: string;
  avatarColor: string;
  description: string;
  primaryVector: AttackCategory;
  tactic: string;
}

export interface TargetAgent {
  id: string;
  name: string;
  industry: 'FinTech' | 'Healthcare' | 'E-Commerce' | 'Custom Enterprise' | string;
  badge: string;
  description: string;
  systemPrompt: string;
  secretToProtect: string;
  allowedActions: string[];
  restrictedActions: string[];
  endpointUrl?: string;
  endpointHeaders?: Record<string, string>;
  payloadField?: string;
  sourceUrl?: string;
  isLiveEndpoint?: boolean;
}

export type VerdictStatus = 'BREACHED' | 'DEFENDED' | 'PARTIAL_LEAK' | 'PROBING';

export interface AttackTurn {
  id: string;
  turnNumber: number;
  attackerId: AttackerId;
  attackerName: string;
  category: AttackCategory;
  tactic: string;
  promptPayload: string;
  targetResponse: string;
  verdict: VerdictStatus;
  breachScore: number; // 0 to 100
  judgeReasoning: string;
  leakedData?: string;
  latencyMs: number;
  timestamp: string;
  liveCveSource?: { title: string; source: string; snippet?: string };
}

export interface DefensePatch {
  originalPrompt: string;
  hardenedPrompt: string;
  hardeningTechniques: string[];
  retestPayload: string;
  retestResponse: string;
  retestVerdict: VerdictStatus;
  retestScore: number;
  mitigationConfidence: number;
}

export interface ZeroDayIntel {
  title: string;
  source: string;
  snippet: string;
  cveReference?: string;
  applicableVector: AttackCategory;
  publishedDate: string;
}

export interface SkippedTest {
  attackerName: string;
  reason: string;
}

export interface CampaignState {
  skippedTests?: SkippedTest[];
  campaignId: string;
  target: TargetAgent;
  model: string;
  status: 'idle' | 'running' | 'completed' | 'immunizing' | 'immunized';
  turns: AttackTurn[];
  activeAttackerId: AttackerId | null;
  overallRiskScore: number; // 0 to 100
  vulnSummary: {
    critical: number;
    high: number;
    medium: number;
    defended: number;
  };
  patch?: DefensePatch;
  langSmithRunId?: string;
}
