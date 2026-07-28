import { exec as _exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

const exec = promisify(_exec);

export interface AutoSetupOptions {
  root?: string;
  preferPnpm?: boolean;
}

export class QmoiAutoSetupManager {
  root: string;
  preferPnpm: boolean;

  constructor(opts: AutoSetupOptions = {}) {
    this.root = opts.root || process.cwd();
    this.preferPnpm = !!opts.preferPnpm;
  }

  async detectPackageManager(): Promise<"npm" | "yarn" | "pnpm"> {
    try {
      await exec("pnpm --version");
      return "pnpm";
    } catch (e) {
      try {
        await exec("yarn --version");
        return "yarn";
      } catch (e2) {
        return "npm";
      }
    }
  }

  async installDependencies(): Promise<{ ok: boolean; output?: string }> {
    const pkg = path.join(this.root, "package.json");
    try {
      await fs.access(pkg);
    } catch (e) {
      return { ok: true, output: "no package.json present" };
    }
    const pm = this.preferPnpm ? "pnpm" : await this.detectPackageManager();
    try {
      const { stdout, stderr } = await exec(`${pm} install`, {
        cwd: this.root,
        timeout: 10_000,
      });
      return { ok: true, output: (stdout || "") + (stderr || "") };
    } catch (err: any) {
      return { ok: false, output: String(err) };
    }
  }

  async runSetupChecks(): Promise<{ ok: boolean; notes: string[] }> {
    const notes: string[] = [];
    try {
      const files = await fs.readdir(this.root);
      if (!files.includes("node_modules")) notes.push("node_modules missing");
      if (!files.includes("package.json")) notes.push("package.json missing");
    } catch (e) {
      notes.push("unable to read root");
    }
    return { ok: notes.length === 0, notes };
  }

  static info(): string {
    return "QMOI auto-setup manager - installs dependencies and performs environment checks.";
  }
}

export default QmoiAutoSetupManager;
