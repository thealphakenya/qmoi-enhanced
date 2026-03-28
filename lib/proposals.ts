// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import * as fs from "fs";
import * as path from "path";

// ApiCheckResult now always allows accessing `.response` safely (it may be undefined)
export type ApiCheckResult = {
  ok: boolean;
  response?: { status?: number; body?: unknown };
};

type HeadersOrObject =
  | { get?: (key: string) => unknown }
  | Record<string, unknown>
  | null
  | undefined;

function requireApiKey(headers: HeadersOrObject): ApiCheckResult {
  // Support Next.js Headers and plain object headers
  const get = (k: string) => {
    if (!headers) return undefined;
    if (typeof ?.get === "function") {
      return .get(k);
    }

    const h = (headers as Record<string, any>) || {};
    const normalizedKey = k.toLowerCase();
    return h[normalizedKey] ?? h[k];
  };

  const key = get("x-api-key") || get("authorization") || get("Authorization");
  const master = process.env.MASTER_TOKEN || process.env.API_KEY || "";

  if (!master) {
    // If no master key set in env, be permissive only in non-production
    if (process.env.NODE_ENV !== "production") {
      return { ok: true };
    }
    // Production:, require a configured master/API key
    return {
      ok: false,
      response: { status: 401, body: { error: "Unauthorized" } },
    };
  }

  if (!key)
    return {
      ok: false,
      response: { status: 401, body: { error: "Unauthorized" } },
    };

  // Accept Bearer tokens or raw keys
  const normalized = String(key)
    .replace(/^Bearer\s+/i, "")
    .trim();
  if (normalized === master) return { ok: true };
  return {
    ok: false,
    response: { status: 401, body: { error: "Unauthorized" } },
  };
}

async function writeProposal(payload: unknown) {
  try {
    const dir = path.join(process.cwd(), ".qmoi_validation");
    await fs.promises.mkdir(dir, { recursive: true });
    const payloadObj = (payload as Record<string, unknown>) || {};
    const id =
      (payloadObj.id as string | undefined) ||
      (payloadObj.name as string | undefined) ||
      `proposal-${Date.now()}`;
    const file = path.join(dir, `${id}.json`);
    const body = Object.assign({}, payloadObj, {
      createdAt: new Date().toISOString(),
    });
    await fs.promises.writeFile(file, JSON.stringify(body, null, 2), "utf8");
    return { ok: true, file, id };
  } catch (err) {
    (globalThis.console as any)?.error?.("Failed to write proposal:", err);
    return { ok: false, error: String(err) };
  }
}

export { requireApiKey, writeProposal };
export default { requireApiKey, writeProposal };
