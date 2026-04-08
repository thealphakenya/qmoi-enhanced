// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  req: NextApiRequest,
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
