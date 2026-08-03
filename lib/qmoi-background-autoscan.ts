import fs from "fs/promises";
import path from "path";

export interface ScanResult {
  path: string;
  markers: string[];
}

export class QmoiBackgroundAutoscan {
  root: string;
  markers: string[];

  constructor(
    root?: string,
    markers: string[] = ["TODO", "FIXME", "placeholder", "TBD"],
  ) {
    this.root = root || process.cwd();
    this.markers = markers;
  }

  async scanPaths(maxFiles = 5000): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    const visit = async (dir: string, depth = 0) => {
      if (depth > 8) return;
      let entries: string[] = [];
      try {
        entries = await fs.readdir(dir);
      } catch (e) {
        return;
      }
      for (const e of entries) {
        const full = path.join(dir, e);
        try {
          const stat = await fs.stat(full);
          if (stat.isDirectory()) {
            if ([".git", "node_modules", "dist"].includes(e)) continue;
            await visit(full, depth + 1);
          } else if (stat.isFile()) {
            if (results.length >= maxFiles) return;
            const ext = path.extname(e).toLowerCase();
            if (![".py", ".ts", ".js", ".md", ".txt", ".json"].includes(ext))
              continue;
            const txt = await fs.readFile(full, "utf8");
            const found = this.markers.filter((m) => txt.includes(m));
            if (found.length)
              results.push({
                path: path.relative(this.root, full),
                markers: found,
              });
          }
        } catch (err) {
          continue;
        }
      }
    };
    await visit(this.root);
    return results;
  }

  async generateReport(): Promise<string> {
    const items = await this.scanPaths();
    const lines = [
      "# Background Autoscan Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
    ];
    for (const it of items) {
      lines.push(`- ${it.path}: ${it.markers.join(", ")}`);
    }
    const out = path.join(this.root, "AUTOSCAN_REPORT.md");
    await fs.writeFile(out, lines.join("\n") + "\n", "utf8");
    return out;
  }

  static info(): string {
    return "Background autoscan service - scans repository for markers and produces reports.";
  }
}

export default QmoiBackgroundAutoscan;

// AUTOFIXED by Ollama at 2026-07-28T23:00:46.644762Z
