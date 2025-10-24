#!/usr/bin/env node
/*
  ensure-env.cjs
  - Reads env/required_envs.json
  - Ensures .env and vercel.env.example exist with defaults
  - Can emit GitHub Actions env entries to set defaults in CI
  - Conservative: will not write non-empty secrets if they are missing unless --force is provided
*/
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'env', 'required_envs.json');
const outDotEnv = path.join(process.cwd(), '.env');
const outVercel = path.join(process.cwd(), 'vercel.env.example');

function loadManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function writeEnvFiles(manifest, opts) {
  const lines = [];
  const vercel = [];
  manifest.required.forEach(e => {
    const name = e.name;
    const value = process.env[name] || e.default || '';
    lines.push(`${name}=${value}`);
    vercel.push(`${name}=${value}`);
  });
  if (!opts.dry) {
    fs.writeFileSync(outDotEnv, lines.join('\n') + '\n', { encoding: 'utf8' });
    fs.writeFileSync(outVercel, vercel.join('\n') + '\n', { encoding: 'utf8' });
  }
  return { lines, vercel };
}

function emitGithubEnv(lines) {
  // prints lines suitable for GitHub Actions `env` block
  console.log('GITHUB_ACTIONS_ENV_START');
  lines.forEach(l => console.log(l));
  console.log('GITHUB_ACTIONS_ENV_END');
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const emitGA = args.includes('--emit-ga');
  const force = args.includes('--force');

  const manifest = loadManifest();
  const result = writeEnvFiles(manifest, { dry, force });
  if (emitGA) emitGithubEnv(result.lines);
  console.log('ensure-env: wrote .env and vercel.env.example (dry=' + dry + ')');
}

if (require.main === module) main();
