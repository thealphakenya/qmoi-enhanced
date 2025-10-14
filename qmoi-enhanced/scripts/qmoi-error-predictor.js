#!/usr/bin/env node

/**
 * QMOI Error Predictor
 * Analyzes error/fix logs and predicts likely error types/files for the next run.
 * Exposes predictions via a REST API for dashboard integration.
 */

import fs from 'fs';
import express from 'express';

const ERROR_FIX_LOG = './logs/error_fix_summary.json';
const PORT = 4100;

function analyzeLogs() {
  if (!fs.existsSync(ERROR_FIX_LOG)) return { predictions: [], stats: {} };
  const log = JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8'));
  const errorTypeCounts = {};
  const fileCounts = {};
  const recent = log.slice(-20); // last 20 runs
  for (const entry of recent) {
    if (entry.errorTypeCounts) {
      for (const [type, count] of Object.entries(entry.errorTypeCounts)) {
        errorTypeCounts[type] = (errorTypeCounts[type] || 0) + count;
      }
    }
    if (entry.errorFiles) {
      for (const file of entry.errorFiles) {
        fileCounts[file] = (fileCounts[file] || 0) + 1;
      }
    }
  }
  // Predict most frequent error types and files
  const topErrorTypes = Object.entries(errorTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));
  const topFiles = Object.entries(fileCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([file, count]) => ({ file, count }));
  return {
    predictions: [
      ...topErrorTypes.map(e => ({ kind: 'errorType', ...e })),
      ...topFiles.map(f => ({ kind: 'file', ...f }))
    ],
    stats: { errorTypeCounts, fileCounts }
  };
}

if (process.argv.includes('--predict')) {
  const result = analyzeLogs();
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// REST API for dashboard
const app = express();
app.get('/api/predictions', (req, res) => {
  res.json(analyzeLogs());
});
app.listen(PORT, () => console.log(`QMOI Error Predictor API running on http://localhost:${PORT}`)); 