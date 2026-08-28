// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/schedule.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

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
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let schedules = loadSchedules() as Array<Record<string, unknown>>;
  if (method === "GET") {
    return _res.status(200).json({ items: schedules });
  }
  if (method === "POST") {
    const { name, command, cron, deviceId, notify } = body;
    if (!name || !command || !cron)
      return _res.status(400).json({ _error: "Missing fields" });
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
    const idx = schedules.findIndex(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
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
    schedules = schedules.filter(
      (j) => String((j as Record<string, unknown>).id) !== id,
    );
    saveSchedules(schedules);
    return _res.status(200).json({ success: true });
  }
  if (method === "PATCH" && query.action === "run") {
    const { id } = body;
    const job = schedules.find(
      (j) => String((j as Record<string, unknown>).id) === id,
    );
    if (!job) return _res.status(404).json({ _error: "Not found" });
    // For now, just log the command to be run
    console.log(`[SCHEDULED RUN]`, job);
    return _res.status(200).json({ success: true });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;
