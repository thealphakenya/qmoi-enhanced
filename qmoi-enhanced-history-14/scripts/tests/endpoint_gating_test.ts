#!/usr/bin/env node
import assert from "assert";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
// We'll dynamically import the app routes during test execution to capture import errors

// Minimal header helper
function makeHeaders(map: Record<string, string> = {}) {
  return {
    get: (k: string) => map[k.toLowerCase()] ?? null,
  };
}

function makeNextUrl(url = "http://localhost") {
  return {
    searchParams: new URL(url).searchParams,
    href: url,
  } as any;
}

async function testAiHealthGating(aiHealthGET: unknown) {
  console.log("Testing ai-health GET gating...");
  process.env.NODE_ENV = "production";
  delete process.env.API_KEY;
  // No header -> expect 401
  const res1: unknown = await aiHealthGET({
    headers: makeHeaders(),
    nextUrl: makeNextUrl(),
  } as any);
  assert(
    res1?.status === 401 ||
      (res1?.status === undefined &&
        JSON.stringify(res1)?.includes("Unauthorized")),
    "ai-health should 401 without API key",
  );

  // With API key -> 200
  process.env.API_KEY = "test-api";
  const res2: unknown = await aiHealthGET({
    headers: makeHeaders({ "x-api-key": "test-api" }),
    nextUrl: makeNextUrl(),
  } as any);
  assert(
    res2?.status === 200 || res2?.status === undefined,
    "ai-health should allow valid API key",
  );
  console.log("ai-health gating tests passed");
}

async function testLanguagePlaceholders(languageHandler: unknown) {
  console.log("Testing qmoi/language placeholder behavior and gating...");
  process.env.NODE_ENV = "production";
  delete process.env.API_KEY;

  // Mock _req/_res for NextApi handler
  const _res: unknown = {
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(obj: unknown) {
      this.body = obj;
      return this;
    },
  };

  // No key -> should be 401
  await languageHandler(
    {
      method: "POST",
      body: { action: "translate" },
      headers: makeHeaders(),
    } as any,
    _res as any,
  );
  assert(
    _res.statusCode === 401 || (_res.body && _res.body.error),
    "language route should 401 without key",
  );

  // With key -> 501 placeholder
  process.env.API_KEY = "test-api";
  const res2: unknown = {
    statusCode: 0,
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(obj: unknown) {
      this.body = obj;
      return this;
    },
  };
  await languageHandler(
    {
      method: "POST",
      body: { action: "translate" },
      headers: makeHeaders({ "x-api-key": "test-api" }),
    } as any,
    res2 as any,
  );
  assert(
    res2.statusCode === 501 ||
      (res2.body &&
        res2.body.error &&
        res2.body.error.includes("Not implemented")),
    "language route should return 501 despite key because placeholder",
  );
  console.log("language placeholder gating tests passed");
}

async function testQNewsGating(qnewsPOST: unknown) {
  console.log("Testing qnews gating and master fallback...");
  process.env.NODE_ENV = "production";
  delete process.env.API_KEY;

  // POST creating news requires key or master
  const body = { title: "Test", content: "x" };
  const resNoAuth: unknown = await qnewsPOST({
    headers: makeHeaders(),
    json: async () => body,
  } as any);
  assert(
    resNoAuth?.status === 401 || (resNoAuth?.body && resNoAuth.body.error),
    "qnews POST should be 401 without key",
  );

  // With API key: success
  process.env.API_KEY = "test-api";
  const resKey: unknown = await qnewsPOST({
    headers: makeHeaders({ "x-api-key": "test-api" }),
    json: async () => body,
  } as any);
  // qnews uses NextResponse; if not, success property
  assert(resKey?.status !== 401, "qnews POST allowed with API key");
  console.log("qnews gating tests passed");
}

async function runAll() {
  try {
    // Dynamically import route modules so we can handle import errors gracefully
    let aiHealthGET: unknown;
    let languageHandler: unknown;
    let qnewsPOST: unknown;
    try {
      // Prefer compiled server route if it exists (from `next build`), otherwise import source TS file.
      const compiledAiHealth = path.resolve(
        process.cwd(),
        ".next/server/app/api/ai-health/route.js",
      );
      if (fs.existsSync(compiledAiHealth)) {
        ({ GET: aiHealthGET } = await import(
          pathToFileURL(compiledAiHealth).href
        ));
      } else {
        ({ GET: aiHealthGET } =
          await import("../../../app/api/ai-health/route.ts"));
      }
    } catch (ie) {
      (console as any).error(
        "Error importing ai-health/route:",
        ie instanceof Error ? ie.stack : ie,
      );
      throw ie;
    }
    try {
      const compiledLanguage = path.resolve(
        process.cwd(),
        ".next/server/app/api/qmoi/language/route.js",
      );
      if (fs.existsSync(compiledLanguage)) {
        ({ default: languageHandler } = await import(
          pathToFileURL(compiledLanguage).href
        ));
      } else {
        ({ default: languageHandler } =
          await import("../../../app/api/qmoi/language/route.ts"));
      }
    } catch (ie) {
      (console as any).error(
        "Error importing qmoi/language/route:",
        ie instanceof Error ? ie.stack : ie,
      );
      throw ie;
    }
    try {
      const compiledQNews = path.resolve(
        process.cwd(),
        ".next/server/app/api/qnews/route.js",
      );
      if (fs.existsSync(compiledQNews)) {
        ({ POST: qnewsPOST } = await import(pathToFileURL(compiledQNews).href));
      } else {
        ({ POST: qnewsPOST } = await import("../../../app/api/qnews/route.ts"));
      }
    } catch (ie) {
      (console as any).error(
        "Error importing qnews/route:",
        ie instanceof Error ? ie.stack : ie,
      );
      throw ie;
    }

    await testAiHealthGating(aiHealthGET);
    await testLanguagePlaceholders(languageHandler);
    await testQNewsGating(qnewsPOST);
    console.log("All endpoint gating tests passed.");
    process.exit(0);
  } catch (e) {
    (console as any).error(
      "Endpoint gating tests failed:",
      _e instanceof Error ? _e.stack : _e,
    );
    process.exit(1);
  }
}

runAll();

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.328556Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.363818Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.491577Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.547860Z
