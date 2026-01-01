import * as fs from "fs";
import * as path from "path";

type ApiCheckResult =
  | { ok: true }
  | { ok: false; response?: { status: number; body?: unknown } };

function requireApiKey(headers: unknown): ApiCheckResult {
  // Support Next.js Headers and plain object headers
  const get = (k: string) => {
    if (!headers) return undefined;
    if (typeof headers.get === "function") return headers.get(k);
    return headers[k.toLowerCase()] || headers[k];
  };

  const key = get("x-api-key") || get("authorization") || get("Authorization");
  const master = process.env.MASTER_TOKEN || process.env.API_KEY || "";

  if (!master) {
    // If no master key set in env, be permissive in local/dev
    return { ok: true };
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
    const id = payload?.id || `proposal-${Date.now()}`;
    const file = path.join(dir, `${id}.json`);
    const body = { ...payload, createdAt: new Date().toISOString() };
    await fs.promises.writeFile(file, JSON.stringify(body, null, 2), "utf8");
    return { ok: true, file, id };
  } catch (err) {
    console.error("Failed to write proposal:", err);
    return { ok: false, error: String(err) };
  }
}

export { requireApiKey, writeProposal };
export default { requireApiKey, writeProposal };
