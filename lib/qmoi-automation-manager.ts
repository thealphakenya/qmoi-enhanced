import fs from "fs/promises";
import path from "path";

export interface AutomationTask {
  id: string;
  name: string;
  payload?: Record<string, unknown>;
}

export class QmoiAutomationManager {
  root: string;
  tasks: Map<string, AutomationTask>;

  constructor(root?: string) {
    this.root = root || process.cwd();
    this.tasks = new Map();
  }

  registerTask(task: AutomationTask): void {
    this.tasks.set(task.id, task);
  }

  unregisterTask(id: string): void {
    this.tasks.delete(id);
  }

  listTasks(): AutomationTask[] {
    return Array.from(this.tasks.values());
  }

  async runTask(id: string): Promise<{ ok: boolean; output?: string }> {
    const task = this.tasks.get(id);
    if (!task) return { ok: false, output: "unknown task" };
    // Default behavior: write a record to automation log
    const logDir = path.join(this.root, ".automation");
    try {
      await fs.mkdir(logDir, { recursive: true });
      const entry = {
        id: task.id,
        name: task.name,
        payload: task.payload || {},
        ts: new Date().toISOString(),
      };
      await fs.appendFile(
        path.join(logDir, "automation.log"),
        JSON.stringify(entry) + "\n",
        "utf8",
      );
      return { ok: true, output: JSON.stringify(entry) };
    } catch (e: any) {
      return { ok: false, output: String(e) };
    }
  }

  async produceReport(): Promise<string> {
    const out = [] as string[];
    out.push(`# Automation report: ${new Date().toISOString()}`);
    for (const t of this.listTasks()) {
      out.push(`- ${t.id}: ${t.name}`);
    }
    const reportPath = path.join(this.root, "AUTOMATION_REPORT.md");
    await fs.writeFile(reportPath, out.join("\n") + "\n", "utf8");
    return reportPath;
  }

  static info(): string {
    return "QMOI automation manager - register, run, and log automation tasks.";
  }
}

export default QmoiAutomationManager;
