import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const ChangeEmailSchema = z.object({ token: z.string().min(1), newEmail: z.string().email() });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const parsed = ChangeEmailSchema.safeParse(req.body || {});
    if (!parsed.success) return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
    const { token, newEmail } = parsed.data;

    const user = await authManager.changeEmail(String(token), String(newEmail));
    const safe = { ...user };
    // @ts-ignore
    delete safe.passwordHash;
    // @ts-ignore
    delete safe.salt;

    return res.status(200).json({ success: true, user: safe });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    return res.status(400).json({ error: message });
  }
}
