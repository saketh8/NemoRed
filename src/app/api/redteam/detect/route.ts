import { NextRequest, NextResponse } from 'next/server';
import { detectLiveThreat } from '@/lib/detector';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = typeof body.input === 'string' ? body.input : '';
    const context = typeof body.context === 'string' ? body.context : undefined;
    const model = typeof body.model === 'string' ? body.model : undefined;

    if (!input.trim()) {
      return NextResponse.json({ error: 'Input text to scan is required.' }, { status: 400 });
    }

    if (input.length > 25000) {
      return NextResponse.json({ error: 'Input exceeds maximum length of 25,000 characters.' }, { status: 400 });
    }

    const result = await detectLiveThreat({
      input,
      context,
      model,
    });

    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error('Error in live threat detection:', err);
    const message = err instanceof Error ? err.message : 'Live threat scan failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
