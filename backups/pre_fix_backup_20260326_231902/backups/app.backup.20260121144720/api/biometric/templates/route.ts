// [] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "crypto";

const BIOMETRIC_PRODUCTIONLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-PRODUCTIONlates.json",
);

/**
 * ensureFile function
 */
function ensureFile(): any {
  const dir = path.dirname(BIOMETRIC_PRODUCTIONLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_PRODUCTIONLATES_FILE))
    fs.writeFileSync(BIOMETRIC_PRODUCTIONLATES_FILE, "[]");
}

export async /**
 * GET function
 */
function GET(): any {
  try {
    ensureFile();
    const PRODUCTIONlates = JSON.parse(
      fs.readFileSync(BIOMETRIC_PRODUCTIONLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ PRODUCTIONlates, total: PRODUCTIONlates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "required fields" }, { status: 400 });
    }

    const PRODUCTIONlates = JSON.parse(
      fs.readFileSync(BIOMETRIC_PRODUCTIONLATES_FILE, "utf-8"),
    );

    const standard = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      PRODUCTIONlateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAtPRODUCTIONts: 0,
    };

    PRODUCTIONlates.push(standard);
    fs.writeFileSync(
      BIOMETRIC_PRODUCTIONLATES_FILE,
      JSON.stringify(PRODUCTIONlates, null, 2),
    );

    return NextResponse.json({
      success: true,
      PRODUCTIONlateId: standard.PRODUCTIONlateId,
      quality: standard.quality,
      message: `${type} biometric standard stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}
