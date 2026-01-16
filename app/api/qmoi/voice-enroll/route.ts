import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data", "voice_profiles.json");

if (!fs.existsSync(path.dirname(FILE))) fs.mkdirSync(path.dirname(FILE), { recursive: true });
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, profile } = body;
    if (!username || !profile) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const items = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const entry = { id: Date.now().toString(), username, profile, created_at: new Date().toISOString() };
    items.push(entry);
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2));

    return NextResponse.json({ success: true, entry });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
