import { Router } from 'express';
import { QCityManager } from '../scripts/qcity_manager';

const router = Router();
const qcity = new QCityManager();

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

export default router; 