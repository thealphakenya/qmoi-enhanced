import { NextRequest, NextResponse } from 'next/server';

// In-memory news store (replace with DB in production)
let newsStore: any[] = [];
let idCounter = 1;

// Helper: aggregate news from RSS/APIs/QMOI (stub)
async function aggregateNews() {
  // TODO: Fetch from RSS, APIs, QMOI activities
  return [];
}

function isMaster(req: NextRequest) {
  // TODO: Implement real master check (e.g., auth header)
  return req.headers.get('x-qmoi-master') === 'true';
}

export async function GET(req: NextRequest) {
  // Fetch all news (optionally aggregated)
  const url = new URL(req.url);
  const aggregate = url.searchParams.get('aggregate') === 'true';
  let news = [...newsStore];
  if (aggregate) {
    const external = await aggregateNews();
    news = [...news, ...external];
  }
  return NextResponse.json({ news });
}

export async function POST(req: NextRequest) {
  // Submit new news item (master only for advanced fields)
  const body = await req.json();
  const isMasterUser = isMaster(req);
  const item = {
    id: idCounter++,
    ...body,
    status: isMasterUser ? 'approved' : 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: body.category || 'general',
    media: body.media || [], // [{type: 'image', url: ''}, ...]
    analytics: { views: 0, shares: 0, engagement: 0 },
    scheduledAt: body.scheduledAt || null,
  };
  newsStore.push(item);
  return NextResponse.json({ success: true, item });
}

export async function PUT(req: NextRequest) {
  // Approve, edit, or schedule news (master only)
  if (!isMaster(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { id, ...updates } = body;
  const idx = newsStore.findIndex(n => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  newsStore[idx] = { ...newsStore[idx], ...updates, updatedAt: new Date().toISOString() };
  return NextResponse.json({ success: true, item: newsStore[idx] });
}

export async function POST_SCHEDULE(req: NextRequest) {
  // Schedule news (master only)
  if (!isMaster(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { id, scheduledAt } = body;
  const idx = newsStore.findIndex(n => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  newsStore[idx].scheduledAt = scheduledAt;
  newsStore[idx].status = 'scheduled';
  return NextResponse.json({ success: true, item: newsStore[idx] });
}

export async function GET_ANALYTICS(req: NextRequest) {
  // Return analytics for all news (master only)
  if (!isMaster(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({ analytics: newsStore.map(n => ({ id: n.id, views: n.analytics.views, shares: n.analytics.shares, engagement: n.analytics.engagement })) });
}

export async function POST_MEDIA(req: NextRequest) {
  // Add media to news (master only)
  if (!isMaster(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { id, media } = body;
  const idx = newsStore.findIndex(n => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  newsStore[idx].media = [...(newsStore[idx].media || []), ...media];
  return NextResponse.json({ success: true, item: newsStore[idx] });
}

// POST /api/qnews/post - Post news to external platforms
export async function POST_POST(req: NextRequest) {
  // TODO: Implement posting to WhatsApp, Telegram, etc.
  const body = await req.json();
  // Simulate post
  return NextResponse.json({ success: true, posted: body });
} 