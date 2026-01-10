// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const SCHEDULE_FILE = path.resolve(process.cwd(), "data", "schedules.json");
function loadSchedules() {
  if (!fs.existsSync(SCHEDULE_FILE)) return [];
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, "utf-8"));
}
function saveSchedules(schedules: any[]) {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

const handler = requireRole(["admin", "master"])(
  async (_req: NextApiRequest, _res: NextApiResponse) => {
    const { method, body, query } = _req;
    let schedules = loadSchedules();
    if (method === "GET") {
      return _res.status(200).json({ items: schedules });
    }
    if (method === "POST") {
      const { name, command, cron, deviceId, notify } = body;
      if (!name || !command || !cron)
        return _res.status(400).json({ error: "Missing fields" });
      const job = {
        id: `job_${Date.now()}`,
        name,
        command,
        cron,
        deviceId,
        notify,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      schedules.push(job);
      saveSchedules(schedules);
      return _res.status(201).json({ job });
    }
    if (method === "PUT") {
      const { id, ...update } = body;
      const idx = schedules.findIndex((j: any) => j.id === id);
      if (idx === -1) return _res.status(404).json({ error: "Not found" });
      schedules[idx] = {
        ...schedules[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      saveSchedules(schedules);
      return _res.status(200).json({ job: schedules[idx] });
    }
    if (method === "DELETE") {
      const { id } = body;
      schedules = schedules.filter((j: any) => j.id !== id);
      saveSchedules(schedules);
      return _res.status(200).json({ success: true });
    }
    if (method === "PATCH" && query.action === "run") {
      const { id } = body;
      const job = schedules.find((j: any) => j.id === id);
      if (!job) return _res.status(404).json({ error: "Not found" });
      // For now, just log the command to be run
      console.log(`[SCHEDULED RUN]`, job);
      return _res.status(200).json({ success: true });
    }
    _res.status(405).json({ error: "Method not allowed" });
  }
);

export default handler;
