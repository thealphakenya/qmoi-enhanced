import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";

    const session = await authManager.login(email, password, String(ip), String(userAgent));
    const user = await authManager.getUser(session.id);

    const safeUser = { ...(user || {}) };
    // @ts-ignore
    delete safeUser.passwordHash;
    // @ts-ignore
    delete safeUser.salt;

    return res.status(200).json({ success: true, user: safeUser, session });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(401).json({ error: message });
  }
}
