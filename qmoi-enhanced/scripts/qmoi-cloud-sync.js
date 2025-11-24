#!/usr/bin/env node
/**
 * QMOI Cloud Sync
 * Syncs files from cloud storage back to local as needed
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CLOUD_BUCKET = process.env.QMOI_CLOUD_BUCKET || 'qmoi-cloud-bucket';
const TARGETS = ['node_modules', 'dist', 'build', 'mobile/node_modules', 'dashboard/node_modules'];

function syncFromCloud(target) {
  console.log(`[QMOI] Syncing ${target} from cloud...`);
  try {
    execSync(`aws s3 sync s3://${CLOUD_BUCKET}/${target} ${target}`, { stdio: 'inherit' });
    console.log(`[QMOI] Synced: ${target}`);
  } catch (e) {
    console.error(`[QMOI] Failed to sync ${target}:`, e.message);
  }
}

for (const t of TARGETS) syncFromCloud(t);
