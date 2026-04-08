// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "axios";

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  try {
    const memoryPath = path.join(
      process.cwd(),
      "scripts",
      "models",
      "qmoi_memory.json",
    );
    if (!fs.existsSync(memoryPath)) {
      return res
        .status(404)
        .json({ success: false, error: "memory_not_found" });
    }

    const backupsDir = path.join(
      process.cwd(),
      "scripts",
      "models",
      "memory_backups",
    );
    fs.mkdirSync(backupsDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dest = path.join(backupsDir, `qmoi_memory_${timestamp}.json`);

    fs.copyFileSync(memoryPath, dest);

    // Optionally attempt to push to remote backends if configured via QMOI_SYNC_BACKENDS
    const backends = (process.env.QMOI_SYNC_BACKENDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const details: string[] = [];
    for (const b of backends) {
      try {
        if (b === "gist") {
          const gistId = process.env.QMOI_GIST_ID;
          const ghToken = process.env.QMOI_GH_TOKEN;
          if (gistId && ghToken) {
            const url = `https://api.github.com/gists/${gistId}`;
            const payload = {
              files: {
                "qmoi_memory.json": { content: fs.readFileSync(dest, "utf-8") },
              },
            };
            const r = await axios.patch(url, payload, {
              headers: { Authorization: `token ${ghToken}` },
              timeout: 15000,
            });
            details.push(
              r.status === 200 ? "gist:ok" : `gist:error:${r.status}`,
            );
          } else {
            details.push("gist:skipped:missing_config");
          }
        } else if (b === "hf") {
          const hfToken = process.env.QMOI_HF_TOKEN;
          const hfRepo = process.env.QMOI_HF_REPO;
          if (hfToken && hfRepo) {
            // Push via HF API commit endpoint
            const apiUrl = `https://huggingface.co/api/repos/${hfRepo}/commit`;
            const payload = {
              files: [
                {
                  path: "qmoi_memory.json",
                  content: fs.readFileSync(dest, "utf-8"),
                },
              ],
              commit_message: "sync qmoi memory",
            };
            const r = await axios.post(apiUrl, payload, {
              headers: { Authorization: `Bearer ${hfToken}` },
              timeout: 20000,
            });
            details.push(r.status === 200 ? "hf:ok" : `hf:error:${r.status}`);
          } else {
            details.push("hf:skipped:missing_config");
          }
        } else {
          details.push(`unknown_backend:${b}`);
        }
      } catch (e: unknown) {
        details.push(`${b}:error:${e.message || String(e)}`);
      }
    }

    return res.status(200).json({ success: true, backupFile: dest, details });
  } catch (error: unknown) {
    (globalThis.console as any)?.error?.("Memory backup failed:", error);
    return res.status(500).json({ success: false, error: String(error) });
  }
}
