/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qapikey/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory key store (replace with persistent storage in production)
const apiKeys: {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}[] = [];

function generateKey() {
  return (crypto.randomBytes(32) as any).toString("hex");
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({
      key: generateKey(),
      createdAt: new Date().toISOString(),
      revoked: false,
      usage: 0,
    });
  }
  // Production: Persist API keys to keys/ directory using fs.writeFile
  // Keys should be stored encrypted using NODE_CRYPTO or similar
}

export async function GET(_req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(_req.url);
  const showRevoked = url.searchParams.get("showRevoked") === "true";
  const keys = showRevoked ? apiKeys : apiKeys.filter((k) => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(_req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({
    key,
    createdAt: new Date().toISOString(),
    revoked: false,
    usage: 0,
  });
  // Production: Persist new key to keys/ directory
  // Implementation: await fs.writeFile with encryption
  return NextResponse.json({ key });
}

export async function DELETE(_req: NextRequest) {
  // Revoke a key
  const body = (await _req.json()) as any;
  const { key } = body;
  const idx = apiKeys.findIndex((k) => k.key === key);
  if (idx === -1)
    return NextResponse.json({ _error: "Key not found" }, { status: 404 });
  apiKeys[idx].revoked = true;
  // Production: Persist revoked state to keys/ directory
  // Clear any cached auth tokens associated with revoked key
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(_req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({
    usage: apiKeys.map((k) => ({ key: k.key, usage: k.usage })),
  });
}
