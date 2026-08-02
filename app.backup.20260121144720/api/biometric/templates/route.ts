import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/templates/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);

function ensureFile() {
  const dir = path.dirname(BIOMETRIC_TEMPLATES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE))
    fs.writeFileSync(BIOMETRIC_TEMPLATES_FILE, "[]");
}

export async function GET() {
  try {
    ensureFile();
    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    return NextResponse.json({ templates, total: templates.length });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, type, data, quality } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );

    const template = {
      id: crypto.randomUUID(),
      userId,
      username,
      type, // "fingerprint", "face", "iris", "voice", "behavioral"
      templateId: `${type}-${userId}-${Date.now()}`,
      dataHash: crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex"),
      quality: quality || Math.random() * 0.2 + 0.8,
      status: "active",
      enrolledAt: new Date().toISOString(),
      lastUsed: null,
      failedAttempts: 0,
    };

    templates.push(template);
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      templateId: template.templateId,
      quality: template.quality,
      message: `${type} biometric template stored successfully`,
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}
