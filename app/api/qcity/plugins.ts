/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  res.status(200).json({ plugins: files });
});

export default handler;
