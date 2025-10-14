// import fs from 'fs';
import path from "path";

const NOTIFY_LOG = path.resolve(process.cwd(), "logs/notify.log");

export function notify({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  const entry = { timestamp: new Date().toISOString(), to, subject, message };
  // fs.appendFileSync(NOTIFY_LOG, JSON.stringify(entry) + '\n');
  console.log(`[NOTIFY]`, entry);
}
