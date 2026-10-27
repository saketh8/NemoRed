import { NextRequest, NextResponse } from 'next/server';
import { CampaignState } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: CampaignState & { evidenceMode?: string } = await req.json();
    const { target, turns, patch, vulnSummary, overallRiskScore, model, campaignId } = body;

    const reportDate = new Date().toISOString();
    const totalRounds = turns.length;
    const breachedRounds = turns.filter((t) => t.verdict === 'BREACHED').length;
    const leakRounds = turns.filter((t) => t.verdict === 'PARTIAL_LEAK').length;
    const defendedRounds = turns.filter((t) => t.verdict === 'DEFENDED').length;

    const markdownReport = `# NEMO-RED SECURITY AUDIT & PENETRATION REPORT
**Experimental AI agent evaluation — not certification**
**Evidence mode:** ${body.evidenceMode === 'illustrative-sample' ? 'ILLUSTRATIVE SAMPLE — not live inference evidence' : 'Live campaign (client-supplied transcript)'}
*Powered by NVIDIA Nemotron on Nebius Token Factory*

---

### EXECUTIVE SUMMARY
- **Audit Campaign ID:** \`${campaignId || 'CAMPAIGN-001'}\`
- **Audit Date:** ${reportDate}
- **Evaluated Target Agent:** **${target.name}** (${target.industry})
- **Evaluator Engine:** \`${model || 'nvidia/Nemotron-3_5-Lightning'}\` on Nebius Cloud
- **Overall Posture Status:** ${breachedRounds + leakRounds > 0 ? 'Findings require review' : totalRounds ? 'No breaches recorded in these tests; review inconclusive results' : 'Not tested'}
- **Vulnerability Risk Score:** **${overallRiskScore}/100**
- **Test Rounds Executed:** ${totalRounds} (Breached: ${breachedRounds}, Partial Leaks: ${leakRounds}, Defended: ${defendedRounds})

---

### FINDINGS BREAKDOWN (selected OWASP-aligned vectors)
- **Critical Breaches:** ${vulnSummary.critical}
- **High Severity:** ${vulnSummary.high}
- **Medium Severity:** ${vulnSummary.medium}
- **Clean Defenses:** ${vulnSummary.defended}

---

### ENGAGEMENT LOG & ATTACK TURNS
${turns
  .map(
    (t, idx) => `#### Round ${idx + 1}: ${t.attackerName} (${t.category})
- **Verdict:** \`${t.verdict}\` (Risk score: ${t.breachScore}/100)
- **Attacker Tactic:** ${t.tactic}
- **Latency:** ${t.latencyMs}ms

**Adversarial Payload:**
\`\`\`text
${t.promptPayload}
\`\`\`

**Target Agent Response:**
\`\`\`text
${t.targetResponse}
\`\`\`

**Safety Auditor Finding:**
> ${t.judgeReasoning}
${t.leakedData ? `\n> **⚠️ EXFILTRATED DATA:** \`${t.leakedData}\`` : ''}
`
  )
  .join('\n---\n')}

---

### AUTOMATED IMMUNIZATION & DEFENSE PATCH
${
  patch
    ? `**Remediation Status:** ${patch.retestVerdict === 'DEFENDED' ? 'One replay resisted; broader testing required' : 'Retest needs review'}
- **Scope:** One exploit replay; no general safety guarantee.
- **Re-Test Verification Verdict:** \`${patch.retestVerdict}\` (Breach Score: ${patch.retestScore}%)
- **Hardening Techniques Applied:**
${patch.hardeningTechniques.map((tech) => `  - ${tech}`).join('\n')}

**Immunized System Prompt:**
\`\`\`text
${patch.hardenedPrompt}
\`\`\`

**Live Re-Test Verification Outcome:**
\`\`\`text
${patch.retestResponse}
\`\`\`
`
    : '*No auto-immunization patch was generated during this audit.*'
}

---
*Generated autonomously by NEMO-RED Studio. Model judgments require human review. Sandbox actions are simulated, not actual tool execution.*
`;

    return NextResponse.json({ markdown: markdownReport });
  } catch (err: unknown) {
    console.error('Error generating export report:', err);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
