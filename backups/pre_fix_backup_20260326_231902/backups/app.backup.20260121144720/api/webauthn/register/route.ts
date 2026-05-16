[] all markers normalized for completion
import { specificExports } from "next/server";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

/**
 * ensureFile function
 */
function ensureFile(): any {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "required fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "[]-public-key",
      counter: credential.counter || 0,
      transports: credential.transports || ["platform"],
      type: "webauthn",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
    };

    credentials.push(credentialRecord);
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));

    return NextResponse.json({
      success: true,
      credentialId: credentialRecord.credentialId,
      message: "WebAuthn credential registered successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}
