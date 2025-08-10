#!/usr/bin/env node
import { spawnSync } from 'child_process';
const result = spawnSync('python', ['scripts/network/network_connectivity_manager.py', 'auto-repair'], { stdio: 'inherit' });
process.exit(result.status === 0 ? 0 : 1); 