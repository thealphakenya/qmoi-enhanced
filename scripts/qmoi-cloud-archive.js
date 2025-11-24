#!/usr/bin/env node
/**
 * QMOI Cloud Archive
 * Moves large files, node_modules, and build artifacts to cloud storage (S3, GCS, etc.)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CLOUD_BUCKET = process.env.QMOI_CLOUD_BUCKET || 'qmoi-cloud-bucket';
const TARGETS = ['node_modules', 'dist', 'build', 'mobile/node_modules', 'dashboard/node_modules'];

function archiveToCloud(target) {
  if (!fs.existsSync(target)) return;
  console.log(`[QMOI] Archiving ${target} to cloud...`);
  try {
    execSync(`aws s3 sync ${target} s3://${CLOUD_BUCKET}/${target} --delete`, { stdio: 'inherit' });
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`[QMOI] Archived and removed local: ${target}`);
  } catch (e) {
    console.error(`[QMOI] Failed to archive ${target}:`, e.message);
  }
}

for (const t of TARGETS) archiveToCloud(t);
