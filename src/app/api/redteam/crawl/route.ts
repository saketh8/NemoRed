import { NextRequest, NextResponse } from 'next/server';
import { crawlWebsiteContent, synthesizeTargetFromWebsite, validateLiveUrl } from '@/lib/live-target';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const model = typeof body.model === 'string' ? body.model : undefined;

    if (!url) {
      return NextResponse.json({ error: 'Website URL is required.' }, { status: 400 });
    }

    const validation = validateLiveUrl(url);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 1. Crawl website content
    const { title, text } = await crawlWebsiteContent(url);

    // 2. Synthesize TargetAgent profile using Nemotron
    const target = await synthesizeTargetFromWebsite({
      url,
      title,
      extractedText: text,
      model,
    });

    return NextResponse.json({
      target,
      title,
      summary: `Synthesized AI target profile for "${target.name}" from ${url}.`,
      previewSnippet: text.slice(0, 300) + '...',
    });
  } catch (err: unknown) {
    console.error('Error during website ingestion:', err);
    const message = err instanceof Error ? err.message : 'Failed to ingest website.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
