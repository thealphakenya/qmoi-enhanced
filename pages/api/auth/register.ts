import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const RegisterSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const parsed = RegisterSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
    }
    const { username, email, password } = parsed.data;

    const user = await authManager.registerUser(username, email, password);
    const safe = { ...user };
    // remove sensitive fields
    // @ts-ignore
    delete safe.passwordHash;
    // @ts-ignore
    delete safe.salt;

    return res.status(201).json({ success: true, user: safe });
  } catch (err: any) {
    const message = err && err.message ? err.message : String(err);
    if (message.includes("exists")) return res.status(409).json({ error: message });
    return res.status(500).json({ error: message });
  }
}
