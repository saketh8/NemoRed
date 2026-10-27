import { NextResponse } from 'next/server';
import { callNemotron } from '@/lib/nebius';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasNebiusKey = Boolean(process.env.NEBIUS_API_KEY);
  const hasTavilyKey = Boolean(process.env.TAVILY_API_KEY);
  const hasLangSmithKey = Boolean(process.env.LANGSMITH_API_KEY);

  let nebiusLatencyMs = 0;
  let reason: string | null = hasNebiusKey ? null : 'Set NEBIUS_API_KEY in the server environment.';
  let nebiusStatus: 'connected' | 'error' = hasNebiusKey ? 'connected' : 'error';
  let activeModel = process.env.NEBIUS_MODEL || 'nvidia/Nemotron-3_5-Lightning';

  if (hasNebiusKey) {
    try {
      const probe = await callNemotron(
        [
          { role: 'system', content: 'You are a health probe. Answer in 1 word.' },
          { role: 'user', content: 'Ping' },
        ],
        { maxTokens: 64, timeoutMs: 12000, healthCheck: true }
      );
      nebiusLatencyMs = probe.latencyMs;
      activeModel = probe.model;
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      reason = /401|403/.test(message) ? 'Nebius rejected the credentials or model access.'
        : /429/.test(message) ? 'Nebius rate limit reached. Retry shortly.'
        : /404/.test(message) ? 'The configured endpoint or model was not found.'
        : /abort/i.test(message) ? 'Nebius did not respond within 12 seconds. Retry.'
        : 'The inference probe failed. Check the endpoint, model, and account access.';
      nebiusStatus = 'error';
    }
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    nebius: {
      status: nebiusStatus,
      model: activeModel,
      latencyMs: nebiusLatencyMs,
      hasKey: hasNebiusKey,
      reason,
    },
    tavily: {
      hasKey: hasTavilyKey,
      status: hasTavilyKey ? 'active' : 'fallback',
    },
    langsmith: {
      hasKey: hasLangSmithKey,
      project: process.env.LANGSMITH_PROJECT || 'nemored',
      tracing: process.env.LANGSMITH_TRACING === 'true',
    },
  });
}
