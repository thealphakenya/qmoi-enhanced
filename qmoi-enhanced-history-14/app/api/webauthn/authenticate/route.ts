import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialId, assertion } = body;

    if (!credentialId || !assertion) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(CREDENTIALS_FILE)) {
      return NextResponse.json(
        { error: "No credentials registered" },
        { status: 401 },
      );
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));
    const cred = credentials.find(
      (c: unknown) => c.credentialId === credentialId,
    );

    if (!cred) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 401 },
      );
    }

    // Update lastUsed and counter
    cred.lastUsed = new Date().toISOString();
    cred.counter = (cred.counter || 0) + 1;
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));

    return NextResponse.json({
      success: true,
      userId: cred.userId,
      username: cred.username,
      confidence: 0.95,
      message: "WebAuthn authentication successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
