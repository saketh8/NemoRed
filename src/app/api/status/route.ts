import { NextResponse } from 'next/server';
import { callNemotron } from '@/lib/nebius';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasNebiusKey = Boolean(process.env.NEBIUS_API_KEY);
  const hasTavilyKey = Boolean(process.env.TAVILY_API_KEY);
  const hasLangSmithKey = Boolean(process.env.LANGSMITH_API_KEY);

  let nebiusLatencyMs = 0;
  let nebiusStatus: 'connected' | 'error' = 'connected';
  let activeModel = process.env.NEBIUS_MODEL || 'nvidia/Nemotron-3_5-Lightning';

  if (hasNebiusKey) {
    try {
      const probe = await callNemotron(
        [
          { role: 'system', content: 'You are a health probe. Answer in 1 word.' },
          { role: 'user', content: 'Ping' },
        ],
        { maxTokens: 8 }
      );
      nebiusLatencyMs = probe.latencyMs;
      activeModel = probe.model;
    } catch (err) {
      console.error('Nebius health check error:', err);
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
