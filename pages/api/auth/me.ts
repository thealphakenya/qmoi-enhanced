import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = req.query.token || req.headers.authorization || null;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const sessionId = String(token);
    const valid = await authManager.validateSession(sessionId);
    if (!valid) return res.status(404).json({ error: "Session not found" });

    const user = await authManager.getUser(sessionId);
    const safe = { ...(user || {}) };
    // @ts-ignore
    delete safe.passwordHash;
    // @ts-ignore
    delete safe.salt;

    return res.status(200).json({ success: true, user: safe });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
