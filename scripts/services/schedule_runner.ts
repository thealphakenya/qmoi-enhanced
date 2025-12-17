// import fs from 'fs';
import path from "path";
import { exec } from "child_process";
import cron from "node-cron";
import { notify } from "./notification_stub";

const SCHEDULE_FILE = path.resolve(process.cwd(), "data", "schedules.json");
const AUDIT_LOG = path.resolve(process.cwd(), "logs/qcity_audit.log");

function loadSchedules() {
  if (!fs.existsSync(SCHEDULE_FILE)) return [];
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, "utf-8"));
}
function logAudit(entry: any) {
  fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + "\n");
}

function runJob(job: any) {
  const start = Date.now();
  exec(job.command, (err, stdout, stderr) => {
    const end = Date.now();
    const status = err ? "error" : "success";
    logAudit({
      timestamp: new Date().toISOString(),
      action: "schedule_run",
      jobId: job.id,
      user: job.user || "system",
      deviceId: job.deviceId,
      command: job.command,
      status,
      durationMs: end - start,
      output: stdout,
      error: stderr || (err && err.message),
    });
    if (job.notify) {
      notify({
        to: job.notify,
        subject: `[QMOI] Job ${job.name} ${status}`,
        message: `Job: ${job.name}\nStatus: ${status}\nOutput: ${stdout}\nError: ${stderr || (err && err.message)}`,
      });
    }
  });
}

function startScheduler() {
  const schedules = loadSchedules();
  for (const job of schedules) {
    if (!job.cron) continue;
    cron.schedule(job.cron, () => runJob(job));
  }
  console.log(`[SCHEDULER] Started with ${schedules.length} jobs.`);
}

startScheduler();
