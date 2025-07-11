import { NextRequest, NextResponse } from 'next/server';

// In-memory document store (replace with DB/cloud in production)
const documents: any[] = [];
let docId = 1;

export async function POST_UPLOAD(req: NextRequest) {
  // Upload document (stub)
  const body = await req.json();
  const { name, type, content } = body;
  const doc = { id: docId++, name, type, content, createdAt: new Date().toISOString() };
  documents.push(doc);
  // TODO: Upload to GDrive, S3, HuggingFace
  return NextResponse.json({ success: true, doc });
}

export async function GET_SEARCH(req: NextRequest) {
  // Search documents by name/type
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.toLowerCase() || '';
  const type = url.searchParams.get('type');
  let results = documents.filter(d => d.name.toLowerCase().includes(q));
  if (type) results = results.filter(d => d.type === type);
  return NextResponse.json({ results });
}

export async function POST_RESTORE(req: NextRequest) {
  // Restore document (stub)
  const body = await req.json();
  const { id } = body;
  const doc = documents.find(d => d.id === id);
  // TODO: Restore from GDrive, S3, HuggingFace
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, doc });
}

export async function GET_LIST(req: NextRequest) {
  // List all documents
  return NextResponse.json({ documents });
} 