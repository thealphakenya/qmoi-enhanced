import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/voice/enroll/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const VOICE_PROFILES_FILE = path.resolve(
  process.cwd(),
  "data",
  "voice-profiles.json",
);

function ensureFile() {
  const dir = path.dirname(VOICE_PROFILES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VOICE_PROFILES_FILE))
    fs.writeFileSync(VOICE_PROFILES_FILE, "[]");
}

export async function POST(_request: NextRequest) {
  try {
    ensureFile();
    const body = await request.json();
    const { userId, username, audioData, duration } = body;

    if (!userId || !audioData) {
      return NextResponse.json({ _error: "Missing fields" }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(VOICE_PROFILES_FILE, "utf-8"));

    // Check if user already has a profile (allow re-enrollment)
    const existingIndex = profiles.findIndex(
      (p: unknown) => p.userId === userId,
    );

    const voiceProfile = {
      id: crypto.randomUUID(),
      userId,
      username,
      profileId: `voice-${userId}-${Date.now()}`,
      audioHash: crypto.createHash("sha256").update(audioData).digest("hex"),
      duration: duration || 3,
      quality: Math.random() * 0.2 + 0.8, // Mock quality 0.8-1.0
      type: "voice",
      enrolledAt: new Date().toISOString(),
      lastVerified: null,
      enrollmentAttempts: 1,
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = voiceProfile;
    } else {
      profiles.push(voiceProfile);
    }

    fs.writeFileSync(VOICE_PROFILES_FILE, JSON.stringify(profiles, null, 2));

    return NextResponse.json({
      success: true,
      profileId: voiceProfile.profileId,
      quality: voiceProfile.quality,
      message: "Voice profile enrolled successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { _error: (error as Error).message },
      { status: 500 },
    );
  }
}
