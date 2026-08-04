/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/device-fingerprint/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const FINGERPRINTS_FILE = path.join(process.cwd(), "data", "fingerprints.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(_request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const platform = headersList.get("sec-ch-ua-platform") || "";

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(fingerprint);
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(
      fs.readFileSync(FINGERPRINTS_FILE, "utf-8"),
    );
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
