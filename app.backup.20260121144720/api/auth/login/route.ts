import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/login/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ _error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (_error) {
    return NextResponse.json({ _error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}
