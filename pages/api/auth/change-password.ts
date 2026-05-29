import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const ChangePasswordSchema = z.object({ token: z.string().min(1), currentPassword: z.string().min(1), newPassword: z.string().min(8) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const parsed = ChangePasswordSchema.safeParse(req.body || {});
    if (!parsed.success) return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
    const { token, currentPassword, newPassword } = parsed.data;

    await authManager.changePassword(String(token), currentPassword, newPassword);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(400).json({ error: message });
  }
}
