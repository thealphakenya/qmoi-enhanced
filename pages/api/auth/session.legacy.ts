import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const TokenSchema = z.string().min(1);
const SessionActionSchema = z.object({ action: z.string(), token: z.string().min(1) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    if (method === "GET") {
      // validate session id
      const token = req.query.token || req.headers.authorization || null;
      if (!token) return res.status(400).json({ error: "Missing token" });

      const parse = TokenSchema.safeParse(String(token));
      if (!parse.success) return res.status(422).json({ error: "Invalid token" });

      const sessionId = parse.data;
      const valid = await authManager.validateSession(sessionId);
      if (!valid) return res.status(404).json({ error: "Session not found" });

      const user = await authManager.getUser(sessionId);
      return res.status(200).json({ success: true, sessionId, user });
    }

    if (method === "POST") {
      // logout/revoke
      const parsed = SessionActionSchema.safeParse(req.body || {});
      if (!parsed.success) return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
      const { action, token } = parsed.data;

      if (action === "revoke" || action === "logout") {
        await authManager.logout(String(token));
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Unknown action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
