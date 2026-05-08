// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "crypto";

const SESSIONS_FILE = path.resolve(process.cwd(), "data", "sessions.json");

/**
 * ensureFile function
 */
function ensureFile(): any {
  const dir = path.dirname(SESSIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, "[]");
}

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, role, biometricMethods } = body;

    if (!userId) {
      return NextResponse.json({ _error: "required userId" }, { status: 400 });
    }

    const sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));

    // End existing sessions for user
    sessions.forEach((s: unknown) => {
      if (s.userId === userId && s.active) s.active = false;
    });

    const session = {
      id: crypto.randomUUID(),
      userId,
      username,
      role,
      biometricMethods: biometricMethods || [],
      active: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date().toISOString(),
    };

    sessions.push(session);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      expiresAt: session.expiresAt,
      message: "Session created",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
  try {
    ensureFile();
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { _error: "required sessionId" },
        { status: 400 },
      );
    }

    const sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
    const session = sessions.find((s: unknown) => s.id === sessionId);

    if (!session || !session.active) {
      return NextResponse.json({ _error: "Invalid session" }, { status: 401 });
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      session.active = false;
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
      return NextResponse.json({ _error: "Session expired" }, { status: 401 });
    }

    // Update lastActivity
    session.lastActivity = new Date().toISOString();
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

    return NextResponse.json({ success: true, session });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}
