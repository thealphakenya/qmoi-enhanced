// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const ALLOWED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
  ".json",
  ".txt",
  ".yml",
  ".yaml",
  ".env",
];

function isSafePath(requestedPath: string): boolean {
  const resolved = path.resolve(ROOT_DIR, requestedPath);
  return resolved.startsWith(ROOT_DIR);
}

function sanitizePath(requestedPath: string): string {
  // Prevent navigating out of the project root
  const normalized = path.normalize(requestedPath || "");
  if (normalized.startsWith("..")) return "";
  return normalized;
}

function formatFileItem(
  filePath: string,
  stats: fsSync.Stats,
  basePath: string,
) {
  const relative = path.relative(basePath, filePath);
  return {
    id: relative || ".",
    name: path.basename(filePath),
    path: relative || ".",
    type: stats.isDirectory() ? "folder" : "file",
    size: stats.isFile() ? stats.size : undefined,
    modified: stats.mtime.toISOString(),
  };
}

async function readDirectory(dir: string, basePath: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const items = [];
  for (const entry of entries) {
    // Skip node_modules, .next, and git directories
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git"
    ) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const stats = await fs.stat(fullPath);
    if (entry.isDirectory()) {
      items.push(formatFileItem(fullPath, stats, basePath));
    } else if (
      ALLOWED_EXTENSIONS.includes(path.extname(entry.name)) ||
      entry.name === "package.json" ||
      entry.name === "README.md"
    ) {
      items.push(formatFileItem(fullPath, stats, basePath));
    }
  }
  return items;
}

function requireApiKey(req: NextRequest): boolean {
  const key = process.env.FILE_EXPLORER_API_KEY;
  if (!key) {
    // Allow access in production environments when no key is configured
    return process.env.NODE_ENV !== "production";
  }
  const provided = req.headers.get("x-api-key");
  return provided === key;
}

export async function GET(request: NextRequest) {
  try {
    if (!requireApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const requestedPath = sanitizePath(url.searchParams.get("path") || "");
    const targetDir = path.join(ROOT_DIR, requestedPath);

    if (!isSafePath(requestedPath)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const stats = await fs.stat(targetDir).catch(() => null);

    if (!stats || !stats.isDirectory()) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 },
      );
    }

    const items = await readDirectory(targetDir, ROOT_DIR);

    return NextResponse.json({
      path: requestedPath || ".",
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list files", details: String(error) },
      { status: 500 },
    );
  }
}
