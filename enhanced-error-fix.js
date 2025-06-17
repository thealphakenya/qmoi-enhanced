#!/usr/bin/env node
// enhanced-error-fix.ts
import { execSync } from 'child_process';

function run(cmd: string, desc: string): void {
  try {
    console.log(`\n▶️  ${desc}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Success: ${desc}`);
  } catch (e: unknown) {
    console.error(`❌ Error during: ${desc}`);
    if (e instanceof Error) {
      if ('stdout' in e) console.error(e.stdout?.toString());
      if ('stderr' in e) console.error(e.stderr?.toString());
    }
    process.exit(1);
  }
}

console.log('🔍 Checking and fixing errors for Alpha-Q AI...');

run('pnpm install || npm install || yarn install', 'Install dependencies');
run('pnpm run lint || npm run lint || yarn lint', 'Lint code');
run('pnpm run build || npm run build || yarn build', 'Build project');
run('pnpm run typecheck || npm run typecheck || yarn typecheck', 'Type check');

console.log('\n🎉 All checks passed! If you see no errors above, your system is ready.');
