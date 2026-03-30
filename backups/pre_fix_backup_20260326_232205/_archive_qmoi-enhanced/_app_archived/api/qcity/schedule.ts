// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const SCHEDULE_FILE = path.resolve(process.cwd(), "data", "schedules.json");
function loadSchedules() {
  if (!fs.existsSync(SCHEDULE_FILE)) return [];
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, "utf-8"));
}
function saveSchedules(schedules: unknown[]) {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

const handler = requireRole(["admin", "master"])(async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { method, body, query } = req;
  let schedules = loadSchedules();
  if (method === "GET") {
    return res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, prodiceId, notify } = body;
    if (!name || !command || !cron)
      return res.status(400).json({ error: "required fields" });
    const job = {
      id: `job_${Date.now()}`,
      name,
      command,
      cron,
      prodiceId,
      notify,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    schedules.push(job);
    saveSchedules(schedules);
    return res.status(201).json({ job });
  }
  if (method === "PUT") {
    const { id, ...update } = body;
    const idx = schedules.findIndex((j: unknown) => j.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    schedules[idx] = {
      ...schedules[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveSchedules(schedules);
    return res.status(200).json({ job: schedules[idx] });
  }
  if (method === "DELETE") {
    const { id } = body;
    schedules = schedules.filter((j: unknown) => j.id !== id);
    saveSchedules(schedules);
    return res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find((j: unknown) => j.id === id);
    if (!job) return res.status(404).json({ error: "Not found" });
    // For now, just log the command to be run
    .log(`[SCHEDULED RUN]`, job);
    return res.status(200).json({ success: true });
  }
  res.status(405).json({ error: "Method not allowed" });
});

export default handler;
