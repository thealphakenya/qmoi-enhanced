import { Router } from "express";
import fs from "fs";
import path from "path";
import Docker from "dockerode";
import fetch from "node-fetch";

const router = Router();
const docker = new Docker();
const AUDIT_LOG = path.resolve(process.cwd(), "logs/qcity_audit.log");

function logAudit(entry: unknown) {
  try {
    const serialized = typeof entry === "string" ? entry : JSON.stringify(entry);
    fs.appendFileSync(AUDIT_LOG, `${serialized}\n`, { encoding: "utf-8" });
  } catch (error) {
    console.warn("Unable to write audit log:", error);
  }
}

class QCityManager {
  status() {
    return { running: false, message: "Q-city manager unavailable" };
  }
  start() {
    return { message: "Q-city start command accepted" };
  }
  stop() {
    return { message: "Q-city stop command accepted" };
  }
  configure_platforms(config: Record<string, unknown>) {
    return { message: "Platform configuration accepted", config };
  }
  enable_features(features: string[]) {
    return { message: "Feature enable request accepted", features };
  }
  monitor_resources() {
    return { message: "Resource monitoring started" };
  }
  get_notifications() {
    return [];
  }
  get_tasks() {
    return [];
  }
  get_resources() {
    return { cpu: 0, memory: 0, disk: 0, network: 0 };
  }
  get_logs() {
    return [];
  }
}

const qcity = new QCityManager();

const GITPOD_API_URL = "https://api.gitpod.io/v1";
const GITPOD_API_TOKEN = process.env.GITPOD_API_TOKEN;

async function gitpodRequest(endpoint: string, method = "GET", body: unknown = null) {
  const response = await fetch(`${GITPOD_API_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITPOD_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gitpod API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

router.get("/status", async (_req, res) => {
  try {
    const status = qcity.status();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to get Q-city status" });
  }
});

router.get("/config", async (_req, res) => {
  try {
    res.json({ platforms: {}, features: {}, resources: {}, security: {}, ui: {} });
  } catch (error) {
    res.status(500).json({ error: "Failed to get Q-city config" });
  }
});

router.post("/start", async (_req, res) => {
  try {
    const result = qcity.start();
    logAudit({ action: "qcity_start", timestamp: new Date().toISOString() });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to start Q-city" });
  }
});

router.post("/stop", async (_req, res) => {
  try {
    const result = qcity.stop();
    logAudit({ action: "qcity_stop", timestamp: new Date().toISOString() });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to stop Q-city" });
  }
});

router.post("/configure-platforms", async (req, res) => {
  try {
    const result = qcity.configure_platforms(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to configure platforms" });
  }
});

router.post("/enable-features", async (req, res) => {
  try {
    const result = qcity.enable_features(req.body.features || []);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to enable features" });
  }
});

router.post("/monitor-resources", async (_req, res) => {
  try {
    const result = qcity.monitor_resources();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to start resource monitoring" });
  }
});

router.get("/notifications", async (_req, res) => {
  try {
    res.json(qcity.get_notifications());
  } catch (error) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
});

router.get("/tasks", async (_req, res) => {
  try {
    res.json(qcity.get_tasks());
  } catch (error) {
    res.status(500).json({ error: "Failed to get tasks" });
  }
});

router.get("/resources", async (_req, res) => {
  try {
    res.json(qcity.get_resources());
  } catch (error) {
    res.status(500).json({ error: "Failed to get resources" });
  }
});

router.get("/logs", async (_req, res) => {
  try {
    res.json(qcity.get_logs());
  } catch (error) {
    res.status(500).json({ error: "Failed to get logs" });
  }
});

router.get("/workspace-logs", async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) {
    res.status(400).json({ error: "id and type required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let count = 0;
  const maxLines = 10;
  const interval = setInterval(() => {
    if (count < maxLines) {
      res.write(`data: [${type}] Workspace ${id} log line ${count + 1}\n\n`);
      count++;
    } else {
      res.write("data: [DONE]\n\n");
      clearInterval(interval);
      res.end();
    }
  }, 500);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

router.get("/workspaces", async (_req, res) => {
  try {
    if (!GITPOD_API_TOKEN) {
      return res.status(503).json({ error: "Gitpod token not configured" });
    }

    const data = await gitpodRequest("/workspaces", "GET");
    logAudit({ action: "list_gitpod_workspaces", timestamp: new Date().toISOString() });
    res.json({ workspaces: data.workspaces || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to list workspaces" });
  }
});

export default router;
