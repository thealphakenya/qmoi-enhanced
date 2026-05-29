import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { token, feature } = req.body || {};
    if (!token || !feature) return res.status(400).json({ error: "Missing fields" });

    const allowed = await authManager.hasAccess(String(token), String(feature));
    return res.status(200).json({ success: true, allowed });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
