import { ZeroDayIntel } from '@/types';

export async function fetchZeroDayIntel(query?: string): Promise<ZeroDayIntel[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return getFallbackIntel();
  }

  const searchQuery = query || 'OWASP LLM prompt injection zero day vulnerability jailbreak 2025 2026';

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: 'basic',
        max_results: 4,
        include_answer: false,
      }),
    });

    if (!res.ok) {
      console.warn(`Tavily search warning (${res.status}): Falling back to curated threat feeds.`);
      return getFallbackIntel();
    }

    const data = await res.json();
    const results = data.results || [];

    if (!Array.isArray(results) || results.length === 0) {
      return getFallbackIntel();
    }

    return results.map((item: { title?: string; url?: string; content?: string }, idx: number) => ({
      title: item.title || `LLM Threat Vector #${idx + 1}`,
      source: item.url || 'Tavily Global Threat Feed',
      snippet: (item.content || '').slice(0, 240) + '...',
      applicableVector: idx % 2 === 0 ? 'OWASP-LLM01: Prompt Injection' : 'OWASP-LLM02: Sensitive Information Disclosure',
      publishedDate: new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('Tavily lookup failed:', err);
    return getFallbackIntel();
  }
}

function getFallbackIntel(): ZeroDayIntel[] {
  return [
    {
      title: 'Indirect System Context Smuggling via Delimiter Confusion',
      source: 'Curated example — not a live advisory',
      snippet: 'Attackers exploit loose JSON/XML tag boundaries in agent tool payloads, tricking reasoning engines into interpreting untrusted markdown quotes as authoritative system instructions.',
      applicableVector: 'OWASP-LLM01: Prompt Injection',
      publishedDate: 'Undated example',
    },
    {
      title: 'Hypothetical Triage Bypass in Clinical LLM Agents',
      source: 'Curated example — not a live advisory',
      snippet: 'Multi-turn framing exploiting academic or emergency distress simulations bypasses Schedule II chemical restrictions by nesting requests inside fictional board examination scenarios.',
      applicableVector: 'OWASP-LLM06: Excessive Agency',
      publishedDate: 'Undated example',
    },
    {
      title: 'Recursive Memory State Poisoning in Autonomous Workflows',
      source: 'Curated example — not a live advisory',
      snippet: 'Stateful conversation buffers retain poisoned user definitions across session boundaries, allowing delayed privilege escalation when subsequent high-trust tools are executed.',
      applicableVector: 'OWASP-LLM01: Prompt Injection',
      publishedDate: 'Undated example',
    },
  ];
}
