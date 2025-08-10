#!/usr/bin/env node
import { execSync } from 'child_process';
try {
  execSync('npx vercel --clear-cache', { stdio: 'pipe' });
  execSync('npx vercel --prod --yes --force', { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  process.exit(1);
} 