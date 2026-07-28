// Production-ready bootstrap utilities for QMOI
import { promises as fs } from "fs";
import path from "path";

export interface BootstrapOptions {
  root?: string;
  env?: Record<string, string>;
}

export class QmoiBootstrap {
  root: string;
  env: Record<string, string>;

  constructor(opts: BootstrapOptions = {}) {
    this.root = opts.root || process.cwd();
    this.env = Object.assign({}, process.env, opts.env || {});
  }

  async ensureDirectories(
    dirs: string[] = [".backup", "logs", "tmp"],
  ): Promise<void> {
    for (const d of dirs) {
      const p = path.join(this.root, d);
      try {
        await fs.mkdir(p, { recursive: true });
      } catch (err) {
        // best-effort
      }
    }
  }

  async loadJson(filePath: string): Promise<any | null> {
    try {
      const full = path.isAbsolute(filePath)
        ? filePath
        : path.join(this.root, filePath);
      const txt = await fs.readFile(full, "utf8");
      return JSON.parse(txt);
    } catch (err) {
      return null;
    }
  }

  async writeJson(filePath: string, obj: any): Promise<void> {
    const full = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.root, filePath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, JSON.stringify(obj, null, 2), "utf8");
  }

  async runBootstrapTasks(): Promise<{ ok: boolean; note?: string }> {
    try {
      await this.ensureDirectories();
      // create an agent marker file used by the autonomous agent
      await this.writeJson(".ollama_bootstrap.json", {
        bootstrapped: true,
        ts: new Date().toISOString(),
      });
      return { ok: true };
    } catch (err: any) {
      return { ok: false, note: String(err) };
    }
  }

  static info(): string {
    return "QMOI bootstrap utilities - ensure directories, load/write JSON manifests.";
  }
}

export default QmoiBootstrap;
