import { Router } from 'express';
import type { Request, Response } from 'express';
import Docker from 'dockerode';
import { NotificationService } from '../scripts/services/notification_service';
import fs from 'fs';
import path from 'path';

// Fix node-fetch import for both CommonJS and ESM
let fetchInstance: (input: any, init?: any) => Promise<any>;
(async () => {
  try {
    fetchInstance = (await import('node-fetch')).default;
  } catch (e) {
    fetchInstance = require('node-fetch');
  }
})();

// Fix QCityManager import for dev environments
let QCityManagerImpl;
try {
  QCityManagerImpl = require('../scripts/qcity_manager').QCityManager;
} catch (e) {
  QCityManagerImpl = class { status() { return {}; } start() {} stop() {} configure_platforms() {} enable_features() {} monitor_resources() {} get_notifications() { return []; } get_tasks() { return []; } get_resources() { return {}; } get_logs() { return []; } };
}

const router = Router();
const qcity = new QCityManagerImpl();
const docker = new Docker();

const AUDIT_LOG = path.resolve(process.cwd(), 'logs/qcity_audit.log');
function logAudit(entry: any) {
  fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
}
const notificationService = new NotificationService();

const GITPOD_API_URL = 'https://api.gitpod.io/v1';
const GITPOD_API_TOKEN = process.env.GITPOD_API_TOKEN;

async function gitpodRequest(endpoint: string, method = 'GET', body: any = null) {
  const headers = {
    'Authorization': `Bearer ${GITPOD_API_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const options: any = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
  const response = await fetchInstance(`${GITPOD_API_URL}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gitpod API error: ${response.status} ${error}`);
  }
  return response.json();
}

// Get Q-city status
router.get('/status', async (req, res) => {
  try {
    const status = qcity.status();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Q-city status' });
  }
});

// Get Q-city config
router.get('/config', async (req, res) => {
  try {
    const config = qcity.config;
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Q-city config' });
  }
});

// Start Q-city
router.post('/start', async (req, res) => {
  try {
    qcity.start();
    res.json({ message: 'Q-city started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start Q-city' });
  }
});

// Stop Q-city
router.post('/stop', async (req, res) => {
  try {
    qcity.stop();
    res.json({ message: 'Q-city stopped successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop Q-city' });
  }
});

// Configure platforms
router.post('/configure-platforms', async (req, res) => {
  try {
    const { config } = req.body;
    qcity.configure_platforms(config);
    res.json({ message: 'Platforms configured successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure platforms' });
  }
});

// Enable features
router.post('/enable-features', async (req, res) => {
  try {
    const { features } = req.body;
    qcity.enable_features(features);
    res.json({ message: 'Features enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enable features' });
  }
});

// Monitor resources
router.post('/monitor-resources', async (req, res) => {
  try {
    qcity.monitor_resources();
    res.json({ message: 'Resource monitoring started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start resource monitoring' });
  }
});

// Get notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = qcity.get_notifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Get tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = qcity.get_tasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get resources
router.get('/resources', async (req, res) => {
  try {
    const resources = qcity.get_resources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get logs
router.get('/logs', async (req, res) => {
  try {
    const logs = qcity.get_logs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

// Real-time log streaming for workspace actions (SSE)
router.get('/workspace-logs', async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) {
    res.status(400).json({ error: 'id and type required' });
    return;
  }
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Simulate log streaming (replace with real log source in future)
  let count = 0;
  const maxLines = 10;
  const interval = setInterval(() => {
    if (count < maxLines) {
      res.write(`data: [${type}] Workspace ${id} log line ${count + 1}\n\n`);
      count++;
    } else {
      res.write('data: [DONE]\n\n');
      clearInterval(interval);
      res.end();
      // TODO: Audit log log-streaming session
    }
  }, 500);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// --- Gitpod/QMOI Workspace Management API Stubs ---

// List workspaces
export async function listWorkspaces(req: Request, res: Response) {
  try {
    const data = await gitpodRequest('/workspaces', 'GET');
    logAudit({ timestamp: new Date().toISOString(), action: 'list_gitpod_workspaces', user: req.user || 'system', status: 'success' });
    res.json({ workspaces: data.workspaces });
  } catch (error: any) {
    logAudit({ timestamp: new Date().toISOString(), action: 'list_gitpod_workspaces', user: req.user || 'system', status: 'error', error: error.message });
    res.status(500).json({ error: error.message });
  }
}

// Start workspace
export async function startWorkspace(req: Request, res: Response) {
  try {
    const { contextUrl } = req.body;
    if (typeof contextUrl !== 'string') {
      return res.status(400).json({ error: 'contextUrl must be a string' });
    }
    const data = await gitpodRequest('/workspaces', 'POST', { contextUrl });
    logAudit({ timestamp: new Date().toISOString(), action: 'start_gitpod_workspace', user: req.user || 'system', contextUrl, status: 'success' });
    await notificationService.sendNotification('QMOI Workspace Started', `Gitpod workspace started: ${contextUrl}`);
    res.json({ workspace: data });
  } catch (error: any) {
    logAudit({ timestamp: new Date().toISOString(), action: 'start_gitpod_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Workspace Start Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Stop workspace
export async function stopWorkspace(req, res) {
  try {
    const { id } = req.body;
    await gitpodRequest(`/workspaces/${id}`, 'DELETE');
    logAudit({ timestamp: new Date().toISOString(), action: 'stop_gitpod_workspace', user: req.user || 'system', id, status: 'success' });
    await notificationService.sendNotification('QMOI Workspace Stopped', `Gitpod workspace stopped: ${id}`);
    res.json({ success: true });
  } catch (error) {
    logAudit({ timestamp: new Date().toISOString(), action: 'stop_gitpod_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Workspace Stop Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Clone workspace (snapshot)
export async function cloneWorkspace(req, res) {
  try {
    const { id } = req.body;
    const data = await gitpodRequest(`/workspaces/${id}/snapshot`, 'POST');
    logAudit({ timestamp: new Date().toISOString(), action: 'clone_gitpod_workspace', user: req.user || 'system', id, status: 'success' });
    await notificationService.sendNotification('QMOI Workspace Cloned', `Gitpod workspace cloned: ${id}`);
    res.json({ snapshot: data });
  } catch (error) {
    logAudit({ timestamp: new Date().toISOString(), action: 'clone_gitpod_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Workspace Clone Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Sync workspace
export async function syncWorkspace(req, res) {
  try {
    const { id, type } = req.body;
    if (!id || !type) return res.status(400).json({ error: 'id and type required' });
    // For Gitpod: create a snapshot and return the snapshot info
    if (type === 'gitpod') {
      const data = await gitpodRequest(`/workspaces/${id}/snapshot`, 'POST');
      // TODO: Optionally download/upload snapshot to local if needed
      // TODO: Audit log and notify
      logAudit({ timestamp: new Date().toISOString(), action: 'sync_gitpod_workspace', user: req.user || 'system', id, type, status: 'success' });
      await notificationService.sendNotification('QMOI Workspace Synced', `Gitpod workspace synced: ${id}`);
      res.json({ success: true, snapshot: data });
      return;
    }
    // For local: (Docker) - tar the workspace and upload to Gitpod (if API supports)
    if (type === 'local') {
      // Find the container and export its filesystem
      const container = docker.getContainer(id);
      if (!container) return res.status(404).json({ error: 'Container not found' });
      // Export container filesystem as tar stream
      const tarStream = await container.export();
      // TODO: Upload tarStream to Gitpod (if API supports direct upload)
      // For now, just acknowledge the sync request
      // TODO: Audit log and notify
      logAudit({ timestamp: new Date().toISOString(), action: 'sync_local_workspace', user: req.user || 'system', id, type, status: 'success' });
      await notificationService.sendNotification('QMOI Local Workspace Synced', `Local workspace export initiated: ${id}`);
      res.json({ success: true, message: 'Local workspace export initiated (upload to Gitpod not yet implemented)' });
      return;
    }
    res.status(400).json({ error: 'Unknown workspace type' });
  } catch (error) {
    logAudit({ timestamp: new Date().toISOString(), action: 'sync_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Workspace Sync Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

// List QMOI-local Docker workspaces
export async function listLocalWorkspaces(req: Request, res: Response) {
  try {
    const containers = await docker.listContainers({ all: true, filters: { label: ['qmoi-local-workspace'] } });
    logAudit({ timestamp: new Date().toISOString(), action: 'list_local_workspaces', user: req.user || 'system', status: 'success' });
    res.json({ workspaces: containers.map(c => ({
      id: c.Id,
      name: c.Names[0],
      status: c.Status,
      state: c.State,
      image: c.Image
    })) });
  } catch (error: any) {
    logAudit({ timestamp: new Date().toISOString(), action: 'list_local_workspaces', user: req.user || 'system', status: 'error', error: error.message });
    res.status(500).json({ error: error.message });
  }
}

// Start a new QMOI-local Docker workspace
export async function startLocalWorkspace(req: Request, res: Response) {
  try {
    const { image, name } = req.body;
    if (!image || !name) return res.status(400).json({ error: 'image and name required' });
    const container = await docker.createContainer({
      Image: image,
      name,
      Labels: { 'qmoi-local-workspace': 'true' },
      Tty: true,
      Env: [/* mirror Gitpod env vars here if needed */]
    });
    await container.start();
    logAudit({ timestamp: new Date().toISOString(), action: 'start_local_workspace', user: req.user || 'system', image, name, status: 'success' });
    await notificationService.sendNotification('QMOI Local Workspace Started', `Local workspace started: ${name}`);
    res.json({ id: container.id, name });
  } catch (error: any) {
    logAudit({ timestamp: new Date().toISOString(), action: 'start_local_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Local Workspace Start Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Stop a QMOI-local Docker workspace
export async function stopLocalWorkspace(req: Request, res: Response) {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    const container = docker.getContainer(id);
    await container.stop();
    logAudit({ timestamp: new Date().toISOString(), action: 'stop_local_workspace', user: req.user || 'system', id, status: 'success' });
    await notificationService.sendNotification('QMOI Local Workspace Stopped', `Local workspace stopped: ${id}`);
    res.json({ success: true });
  } catch (error: any) {
    logAudit({ timestamp: new Date().toISOString(), action: 'stop_local_workspace', user: req.user || 'system', status: 'error', error: error.message });
    await notificationService.sendNotification('QMOI Local Workspace Stop Failed', error.message);
    res.status(500).json({ error: error.message });
  }
}

export default router; 