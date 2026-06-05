import type { NextApiRequest, NextApiResponse } from "next";
import { authManager } from "../../../src/auth/AuthManager";
import { z } from "zod";

const PreferencesSchema = z.object({
  token: z.string().min(1),
  preferences: z.object({
    theme: z.union([z.literal("light"), z.literal("dark"), z.literal("system")]).optional(),
    notifications: z.boolean().optional(),
    tradingEnabled: z.boolean().optional(),
  }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const parsed = PreferencesSchema.safeParse(req.body || {});
    if (!parsed.success) return res.status(422).json({ error: "Invalid request", issues: parsed.error.errors });
    const { token, preferences } = parsed.data;

    const updated = await authManager.updateUserPreferences(String(token), preferences as Record<string, unknown>);
    const safe = { ...updated } as Record<string, unknown>;
    delete safe.passwordHash;
    delete safe.salt;
    return res.status(200).json({ success: true, user: safe });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
