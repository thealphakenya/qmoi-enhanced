import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data", "webauthn_credentials.json");

if (!fs.existsSync(path.dirname(FILE))) fs.mkdirSync(path.dirname(FILE), { recursive: true });
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, credential } = body;
    if (!username || !credential) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const items = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    items.push({ username, credential, created_at: new Date().toISOString() });
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2));

    return NextResponse.json({ success: true, message: "Credential saved" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
