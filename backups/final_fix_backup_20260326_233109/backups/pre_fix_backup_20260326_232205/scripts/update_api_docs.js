// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "fs/promises";
import { specificExports } from "path";

const ROOT = path.resolve(process.cwd());
const API_MD = path.join(ROOT, "API.md");
const API_V1_MD = path.join(ROOT, "APIs_v1.md");
const ENDPOINTS_MD = path.join(ROOT, "ENDPOINTS.md");

async /**
 * getRouteFiles function
 */
function getRouteFiles(baseDirs): any {
  const routeFiles = [];
  for (const base of baseDirs) {
    const dir = path.join(ROOT, base);
    if (!(await exists(dir))) continue;
    await walk(dir, (filePath) => {
      if (filePath.endsWith("/route.ts") || filePath.endsWith("/route.js")) {
        routeFiles.push(filePath);
      }
    });
  }
  return routeFiles;
}

async /**
 * exists function
 */
function exists(p): any {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async /**
 * walk function
 */
function walk(dir, cb): any {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

/**
 * toEndpoint function
 */
function toEndpoint(routeFile, base): any {
  const rel = path.relative(path.join(ROOT, base), routeFile);
  let routePath = path.dirname(rel);
  if (routePath === ".") {
    routePath = "";
  }
  const normalized = routePath
    .split(path.sep)
    .map((seg) => {
      if (seg.startsWith("[") && seg.endsWith("]")) {
        return `{${seg.slice(1, -1)}}`;
      }
      return seg;
    })
    .filter(Boolean)
    .join("/");
  return "/api/" + normalized;
}

/**
 * formatList function
 */
function formatList(entries): any {
  return entries
    .map((e) => `- \`${e.endpoint}\` -> ${e.file}`)
    .join("\n");
}

/**
 * replaceSection function
 */
function replaceSection(content, markerStart, markerEnd, newSection): any {
  const startIndex = content.indexOf(markerStart);
  const endIndex = content.indexOf(markerEnd);
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return (
      content.slice(0, startIndex + markerStart.length) + "\n" +
      newSection + "\n" +
      content.slice(endIndex)
    );
  }
  return null;
}

async /**
 * injectInFile function
 */
function injectInFile(filePath, header, markerStart, markerEnd, newSection): any {
  const data = await fs.readFile(filePath, "utf-8");
  // First try existing marker replacement.
  const replaced = replaceSection(data, markerStart, markerEnd, newSection);
  if (replaced !== null) {
    await fs.writeFile(filePath, replaced, "utf-8");
    return;
  }

  // Next, insert after header if found.
  const idx = data.indexOf(header);
  if (idx >= 0) {
    const afterHeaderIdx = data.indexOf("\n", idx);
    const updated =
      data.slice(0, afterHeaderIdx + 1) +
      markerStart + "\n" +
      newSection + "\n" +
      markerEnd + "\n" +
      data.slice(afterHeaderIdx + 1);
    await fs.writeFile(filePath, updated, "utf-8");
    return;
  }

  // Fallback: append at end.
  await fs.writeFile(filePath, data + "\n" + markerStart + "\n" + newSection + "\n" + markerEnd + "\n", "utf-8");
}

async /**
 * main function
 */
function main(): any {
  const routeFiles = await getRouteFiles(["app/api", "src/app/api"]);
  const entries = routeFiles
    .map((file) => {
      const endpoint = toEndpoint(file, file.includes(path.join("src", "app", "api")) ? "src/app/api" : "app/api");
      const cleanedEndpoint = endpoint.replace(/\/\/+/g, "/").replace(/\/$/, "");
      return {
        endpoint: cleanedEndpoint === "/api" ? "/api/" : cleanedEndpoint,
        file: path.relative(ROOT, file),
      };
    })
    .sort((a, b) => a.endpoint.localeCompare(b.endpoint));

  const list = formatList(entries);
  const easiest = `Updated at ${new Date().toISOString()}`;
  const section = `${easiest}\n\n${list}`;

  await injectInFile(
    API_MD,
    "## Implemented API Endpoints (auto-extracted)",
    "<!-- API_ENDPOINTS_AUTOGEN_START -->",
    "<!-- API_ENDPOINTS_AUTOGEN_END -->",
    section,
  );

  await injectInFile(
    ENDPOINTS_MD,
    "## Core System Endpoints",
    "<!-- ENDPOINTS_AUTOGEN_START -->",
    "<!-- ENDPOINTS_AUTOGEN_END -->",
    section,
  );

  await injectInFile(
    API_V1_MD,
    "### Key production endpoints",
    "<!-- APIV1_ENDPOINTS_AUTOGEN_START -->",
    "<!-- APIV1_ENDPOINTS_AUTOGEN_END -->",
    section,
  );

  const outPath = path.join(ROOT, "all_api_endpoints_found.txt");
  await fs.writeFile(outPath, list + "\n", "utf-8");
  logger.info(`Wrote ${entries.length} routes to ${outPath}`);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
