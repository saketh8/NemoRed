import crypto from 'crypto';

export interface LangSmithTraceEvent {
  runName: string;
  runType: 'chain' | 'llm' | 'tool';
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  metadata: Record<string, unknown>;
  startTime: number;
  endTime: number;
}

export async function logToLangSmith(event: LangSmithTraceEvent): Promise<string | null> {
  const apiKey = process.env.LANGSMITH_API_KEY;
  if (!apiKey || process.env.LANGSMITH_TRACING !== 'true') {
    return null;
  }

  const endpoint = process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com';
  const projectName = process.env.LANGSMITH_PROJECT || 'nemored';
  const runId = crypto.randomUUID();

  try {
    const payload = {
      id: runId,
      name: event.runName,
      run_type: event.runType,
      project_name: projectName,
      start_time: new Date(event.startTime).toISOString(),
      end_time: new Date(event.endTime).toISOString(),
      inputs: event.inputs,
      outputs: event.outputs,
      extra: {
        metadata: {
          ...event.metadata,
          source: 'nemo-red-studio',
          engine: 'NVIDIA Nemotron on Nebius Token Factory',
        },
      },
    };

    const res = await fetch(`${endpoint}/runs`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`LangSmith tracing warning (${res.status}): Failed to record run.`);
      return null;
    }

    return runId;
  } catch (err) {
    console.error('LangSmith trace logging error:', err);
    return null;
  }
}
