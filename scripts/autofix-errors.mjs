#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);
const projectRoot = process.cwd();

async function removePath(targetPath) {
  try {
    await fs.rm(targetPath, { recursive: true, force: true });
    console.log(chalk.green(`✔ Removed: ${targetPath}`));
  } catch (err) {
    console.error(chalk.red(`✖ Failed to remove ${targetPath}: ${err.message}`));
  }
}

async function runCommand(command, options = {}) {
  try {
    console.log(chalk.blue(`→ Running: ${command}`));
    const { stdout, stderr } = await execAsync(command, options);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    console.log(chalk.green(`✔ Command succeeded: ${command}`));
    return true;
  } catch (err) {
    console.error(chalk.red(`✖ Command failed: ${command}`));
    console.error(chalk.red(err.message));
    return false;
  }
}

async function autofix() {
  console.log(chalk.bold('\n🔧 Starting autofix-errors script...\n'));

  // Remove corrupted source-map package explicitly (common culprit)
  const sourceMapPath = path.join(projectRoot, 'node_modules', 'source-map');
  await removePath(sourceMapPath);

  // Remove entire node_modules folder for a fresh install
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  await removePath(nodeModulesPath);

  // Remove package-lock.json for a clean dependency tree
  const packageLockPath = path.join(projectRoot, 'package-lock.json');
  try {
    await fs.unlink(packageLockPath);
    console.log(chalk.green(`✔ Removed: ${packageLockPath}`));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(chalk.red(`✖ Failed to remove ${packageLockPath}: ${err.message}`));
    } else {
      console.log(chalk.yellow(`ℹ️ No package-lock.json found, skipping removal.`));
    }
  }

  // Clear npm cache (optional but often helpful)
  const cacheCleared = await runCommand('npm cache clean --force');
  if (!cacheCleared) {
    console.log(chalk.yellow('⚠️ npm cache clean failed, continuing anyway...'));
  }

  // Reinstall dependencies fresh
  const installSuccess = await runCommand('npm install');
  if (!installSuccess) {
    console.error(chalk.red('\n✖ Failed to reinstall npm dependencies. Please try running manually.'));
    process.exit(1);
  }

  // Run eslint and prettier autofix as last step to fix lint and format errors
  const fixSuccess = await runCommand('eslint . --fix && prettier --write .');
  if (!fixSuccess) {
    console.error(chalk.red('\n✖ Autofix lint/format failed.'));
    process.exit(1);
  }

  console.log(chalk.bold.green('\n🎉 Autofix completed successfully!\n'));
  process.exit(0);
}

autofix();
