import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET' && req.query.problems) {
    // Scan all .ts, .tsx, .py, .js files for problems using tsc, flake8, eslint, etc.
    const problems: any[] = [];
    try {
      // TypeScript/JS
      const tsc = await new Promise<string>(resolve => exec('npx tsc --noEmit', (e, out, err) => resolve(out + err)));
      tsc.split('\n').forEach(line => {
        if (line.includes('error')) problems.push({ type: 'tsc', message: line });
      });
      // Python
      const pyFiles = fs.readdirSync('.').filter(f => f.endsWith('.py'));
      for (const file of pyFiles) {
        const flake = await new Promise<string>(resolve => exec(`flake8 ${file}`, (e, out, err) => resolve(out + err)));
        flake.split('\n').forEach(line => {
          if (line.trim()) problems.push({ type: 'flake8', file, message: line });
        });
      }
      // JS/TS Lint
      const eslint = await new Promise<string>(resolve => exec('npx eslint .', (e, out, err) => resolve(out + err)));
      eslint.split('\n').forEach(line => {
        if (line.includes('error')) problems.push({ type: 'eslint', message: line });
      });
    } catch (e) {
      problems.push({ type: 'system', message: e.toString() });
    }
    return res.json({ problems });
  }

  if (req.method === 'POST' && req.query.fix) {
    // Attempt to auto-fix all problems, including missing files/modules/imports
    const results: any[] = [];
    try {
      // TypeScript/JS
      const eslintFix = await new Promise<string>(resolve => exec('npx eslint . --fix', (e, out, err) => resolve(out + err)));
      results.push({ type: 'eslint', result: eslintFix });
      // Python
      const pyFiles = fs.readdirSync('.').filter(f => f.endsWith('.py'));
      for (const file of pyFiles) {
        const autopep8 = await new Promise<string>(resolve => exec(`autopep8 --in-place ${file}`, (e, out, err) => resolve(out + err)));
        results.push({ type: 'autopep8', file, result: autopep8 });
      }
      // Install missing npm modules
      const npmInstall = await new Promise<string>(resolve => exec('npm install', (e, out, err) => resolve(out + err)));
      results.push({ type: 'npm', result: npmInstall });
      // Install missing Python modules
      const pipInstall = await new Promise<string>(resolve => exec('pip install -r requirements.txt', (e, out, err) => resolve(out + err)));
      results.push({ type: 'pip', result: pipInstall });
      // Create missing files if referenced in errors
      // (Simple heuristic: look for 'No such file or directory' in problems)
      const problemsRes = await new Promise<string>(resolve => exec('npx tsc --noEmit', (e, out, err) => resolve(out + err)));
      problemsRes.split('\n').forEach(line => {
        const match = line.match(/error TS2307: Cannot find module '(.+?)'/);
        if (match) {
          const missingFile = match[1];
          if (!fs.existsSync(missingFile)) {
            fs.writeFileSync(missingFile, '// Auto-created by AI');
            results.push({ type: 'file-create', file: missingFile });
          }
        }
      });
    } catch (e) {
      results.push({ type: 'system', message: e.toString() });
    }
    return res.json({ results });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
