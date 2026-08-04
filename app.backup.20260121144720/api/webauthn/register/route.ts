import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webauthn/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_FILE = path.resolve(
  process.cwd(),
  "data",
  "webauthn-credentials.json",
);

function ensureFile() {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CREDENTIALS_FILE))
    fs.writeFileSync(CREDENTIALS_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));

    // Store credential with timestamp
    const credentialRecord = {
      id: crypto.randomUUID(),
      userId,
      username,
      credentialId: credential.id || crypto.randomUUID(),
      publicKey: credential.publicKey || "mock-public-key",
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
