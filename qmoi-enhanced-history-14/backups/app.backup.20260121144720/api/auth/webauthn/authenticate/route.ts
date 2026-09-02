import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data", "webauthn_credentials.json");

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, assertion } = body;
    if (!username || !assertion)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    if (!fs.existsSync(FILE))
      return NextResponse.json(
        { error: "No credentials stored" },
        { status: 404 },
      );
    const items = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const matches = items.filter((i: unknown) => i.username === username);
    // Simplified match: check if any credential id equals assertion.id
    const found = matches.find(
      (m: unknown) => m.credential?.id === assertion.id,
    );
    if (!found)
      return NextResponse.json(
        { success: false, message: "No matching credential" },
        { status: 401 },
      );

    return NextResponse.json({
      success: true,
      message: "Authentication succeeded",
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
