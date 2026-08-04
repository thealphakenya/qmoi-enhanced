import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/biometric/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const BIOMETRIC_TEMPLATES_FILE = path.resolve(
  process.cwd(),
  "data",
  "biometric-templates.json",
);
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/biometric/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type || !data) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(BIOMETRIC_TEMPLATES_FILE)) {
      return NextResponse.json(
        { _error: "No biometric templates found" },
        { status: 401 },
      );
    }

    const templates = JSON.parse(
      fs.readFileSync(BIOMETRIC_TEMPLATES_FILE, "utf-8"),
    );
    const userTemplates = templates.filter(
      (t: unknown) => t.userId === userId && t.type === type,
    );

    if (userTemplates.length === 0) {
      return NextResponse.json(
        { _error: "No biometric template for verification" },
        { status: 401 },
      );
    }

    // Simulate biometric matching
    const confidence = Math.random() * 0.2 + 0.8; // Mock confidence 0.8-1.0

    if (confidence < 0.75) {
      return NextResponse.json(
        { _error: "Biometric verification failed" },
        { status: 401 },
      );
    }

    // Update lastUsed on matched template
    userTemplates[0].lastUsed = new Date().toISOString();
    fs.writeFileSync(
      BIOMETRIC_TEMPLATES_FILE,
      JSON.stringify(templates, null, 2),
    );

    return NextResponse.json({
      success: true,
      userId,
      type,
      confidence,
      message: `${type} biometric verification successful`,
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}
