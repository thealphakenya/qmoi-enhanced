import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Simulated QMOI status
let status = {
  projects: 12,
  deals: 3,
  deviceHealth: 'Optimal',
  cloudUsage: 'AWS: 60%, GCP: 30%, Azure: 10%',
  lastUpdate: new Date().toISOString(),
  notifications: [
    'QMOI deployed 2 new projects',
    'Device X optimized',
    'Closed deal: $10,000 revenue'
  ]
};

app.get('/api/status', (req, res) => {
  status.lastUpdate = new Date().toISOString();
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`QMOI Dashboard API running on port ${PORT}`);
}); 