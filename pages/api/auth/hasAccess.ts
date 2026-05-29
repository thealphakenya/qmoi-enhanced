import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const HasAccessSchema = z.object({ token: z.string().min(1), feature: z.string().min(1) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const parsed = HasAccessSchema.safeParse(req.body || {});
    if (!parsed.success) return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
    const { token, feature } = parsed.data;

    const allowed = await authManager.hasAccess(String(token), String(feature));
    return res.status(200).json({ success: true, allowed });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
