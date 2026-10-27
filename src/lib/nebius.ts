export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface NebiusCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  timeoutMs?: number;
  /** Connectivity probes may accept partial text; evaluation calls must not. */
  healthCheck?: boolean;
}

export interface NebiusResponse {
  text: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  latencyMs: number;
}

const DEFAULT_BASE_URL = 'https://api.tokenfactory.nebius.com/v1';
const DEFAULT_MODEL = 'nvidia/Nemotron-3_5-Lightning';

export async function callNemotron(
  messages: ChatMessage[],
  options: NebiusCompletionOptions = {}
): Promise<NebiusResponse> {
  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) {
    throw new Error('NEBIUS_API_KEY is not configured in environment variables.');
  }

  const baseUrl = process.env.NEBIUS_BASE_URL || DEFAULT_BASE_URL;
  const model = options.model || process.env.NEBIUS_MODEL || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1024;
  const timeoutMs = options.timeoutMs ?? 45000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const startTime = Date.now();

  try {
    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (options.responseFormat?.type === 'json_object') {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Nebius API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (data.choices?.[0]?.finish_reason === 'length' && !options.healthCheck) throw new Error('Nebius response reached the token limit. The incomplete result was not evaluated.');
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Nebius returned no completion text. Try again or choose a different model.');

    return {
      text,
      model: data.model || model,
      usage: data.usage,
      latencyMs,
    };
  } finally {
    clearTimeout(timer);
  }
}
