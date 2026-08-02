import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/verify/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractRoleFromHeader, canAccessEndpoint } from "@/lib/roleAuth";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

export async function POST(_request: NextRequest) {
  try {
    // Extract and verify role from Authorization header
    const authHeader = request.headers.get("authorization") || undefined;
    const userRole = extractRoleFromHeader(authHeader);

    // Check if role can access this endpoint
    if (!canAccessEndpoint(userRole, "/api/voice/verify")) {
      return NextResponse.json(
        { _error: "Unauthorized: Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, audioData } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    if (!fs.existsSync(VOICE_PROFILES_FILE)) {
      return NextResponse.json(
        { _error: "No voice profile enrolled" },
        { status: 401 },
      );
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));
    const profile = profiles.find((p: unknown) => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { _error: "Voice profile not found" },
        { status: 401 },
      );
    }

    // Simulate voice verification by comparing audio hashes
    const audioHash = crypto
      .createHash("sha256")
      .update(audioData)
      .digest("hex");
    const similarity = Math.random() * 0.2 + 0.8; // Mock similarity 0.8-1.0

    // Update lastVerified
    profile.lastVerified = new Date().toISOString();
    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    if (similarity < 0.75) {
      return NextResponse.json(
        { _error: "Voice verification failed" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: profile.userId,
      username: profile.username,
      confidence: similarity,
      message: "Voice verification successful",
      userRole, // Include role in response for verification
    });
  } catch (_error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ _error: errorMessage }, { status: 500 });
  }
}
