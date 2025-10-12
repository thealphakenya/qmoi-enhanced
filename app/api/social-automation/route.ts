import { NextRequest, NextResponse } from 'next/server';

// In-memory stores (replace with DB/integration in production)
const posts: any[] = [];
const contacts: any[] = [
  { id: 1, name: 'Alice', platform: 'WhatsApp', tags: ['friend'] },
  { id: 2, name: 'Bob', platform: 'Telegram', tags: ['work'] },
];
let postId = 1;

export async function POST_POST(req: NextRequest) {
  // Post status/news to platform
  const body = await req.json();
  const { content, platform } = body;
  // TODO: Integrate with WhatsApp, Telegram, etc.
  const post = { id: postId++, content, platform, createdAt: new Date().toISOString() };
  posts.push(post);
  return NextResponse.json({ success: true, post });
}

export async function GET_CONTACTS(req: NextRequest) {
  // List contacts
  return NextResponse.json({ contacts });
}

export async function POST_TAG(req: NextRequest) {
  // Auto-tag a contact
  const body = await req.json();
  const { id, tag } = body;
  const idx = contacts.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  if (!contacts[idx].tags.includes(tag)) contacts[idx].tags.push(tag);
  return NextResponse.json({ success: true, contact: contacts[idx] });
}

export async function GET_INFO(req: NextRequest) {
  // Gather info (stub)
  // TODO: Implement info gathering from platforms
  return NextResponse.json({ info: 'Info gathering not yet implemented.' });
}

export async function GET_FEATURES(req: NextRequest) {
  // List available features
  return NextResponse.json({ features: ['post', 'contacts', 'tag', 'info', 'communities'] });
} 