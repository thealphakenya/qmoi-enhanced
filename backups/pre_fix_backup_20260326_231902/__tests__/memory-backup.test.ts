// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import handler from "../routes/api/qmoi/memory-backup";
import fs from "fs";
import path from "path";

describe("memory-backup API", () => {
  const memoryDir = path.join(process.cwd(), "scripts", "models");
  const memoryPath = path.join(memoryDir, "qmoi_memory.json");

  beforeAll(() => {
    fs.mkdirSync(memoryDir, { recursive: true });
    fs.writeFileSync(
      memoryPath,
      JSON.stringify({ conversations: [] }, null, 2),
    );
  });

  afterAll(() => {
    // Clean up created files in memory_backups
    const backupsDir = path.join(memoryDir, "memory_backups");
    if (fs.existsSync(backupsDir)) {
      const files = fs.readdirSync(backupsDir);
      for (const f of files) {
        fs.unlinkSync(path.join(backupsDir, f));
      }
      fs.rmdirSync(backupsDir);
    }
    if (fs.existsSync(memoryPath)) fs.unlinkSync(memoryPath);
  });

  test("creates a timestamped backup and returns success", async () => {
    let statusCode = 0;
    let payload: unknown = null;

    const req: unknown = { method: "POST" };
    const res: unknown = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (p: unknown) => {
        payload = p;
        return p;
      },
    };

    await handler(req, res);

    expect(statusCode).toBe(200);
    expect(payload).toBeDefined();
    expect(payload.success).toBe(true);
    expect(typeof payload.backupFile).toBe("string");

    // Ensure file exists
    expect(fs.existsSync(payload.backupFile)).toBe(true);
  });
});
