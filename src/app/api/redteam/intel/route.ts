import { NextRequest, NextResponse } from 'next/server';
import { fetchZeroDayIntel } from '@/lib/tavily';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || undefined;
    const intel = await fetchZeroDayIntel(query);
    return NextResponse.json({ intel });
  } catch (err: unknown) {
    console.error('Error in intel route:', err);
    return NextResponse.json({ intel: [] }, { status: 500 });
  }
}
