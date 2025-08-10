#!/usr/bin/env node
import { execSync } from 'child_process';
try {
  execSync('npm run lint -- --fix', { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  process.exit(1);
} 