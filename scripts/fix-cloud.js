#!/usr/bin/env node
import { spawnSync } from 'child_process';
const result = spawnSync('node', ['scripts/qmoi_cloud_optimizer.js', '--auto-repair'], { stdio: 'inherit' });
process.exit(result.status === 0 ? 0 : 1); 