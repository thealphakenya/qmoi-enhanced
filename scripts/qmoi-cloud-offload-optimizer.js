#!/usr/bin/env node

/**
 * QMOI Cloud Offload Optimizer
 * Monitors system resources and automatically offloads heavy tasks to the cloud
 * for ultra-lightweight operation on all devices.
 */

const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const LOG_PATH = path.join(__dirname, '../logs/qmoi-cloud-offload.log');
const CONFIG_PATH = path.join(__dirname, '../config/qmoi_cloud_config.json');

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, entry);
  if (process.env.QMOI_MASTER) console.log(entry);
}

function run(cmd, cwd = '.', opts = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${cmd} (cwd: ${cwd})`);
    const child = exec(cmd, { cwd, ...opts }, (err, stdout, stderr) => {
      if (stdout) log(stdout);
      if (stderr) log(stderr);
      if (err) {
        log(`Error: ${err.message}`);
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

function getSystemResources() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;
  
  const cpus = os.cpus();
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b);
    const idle = cpu.times.idle;
    return acc + ((total - idle) / total);
  }, 0) / cpus.length * 100;
  
  const loadAvg = os.loadavg();
  
  return {
    memory: {
      total: totalMem,
      free: freeMem,
      used: usedMem,
      usagePercent: memUsagePercent
    },
    cpu: {
      usage: cpuUsage,
      cores: cpus.length
    },
    load: {
      avg1: loadAvg[0],
      avg5: loadAvg[1],
      avg15: loadAvg[2]
    }
  };
}

function shouldOffload(resources) {
  const thresholds = {
    memory: 80, // Offload if memory usage > 80%
    cpu: 70,    // Offload if CPU usage > 70%
    load: 2.0   // Offload if load average > 2.0
  };
  
  return (
    resources.memory.usagePercent > thresholds.memory ||
    resources.cpu.usage > thresholds.cpu ||
    resources.load.avg5 > thresholds.load
  );
}

async function offloadBuild() {
  try {
    log('Offloading build to cloud...');
    await run('npm run qmoi:cloud:build');
    log('Build offloaded successfully');
    return true;
  } catch (e) {
    log('Build offload failed: ' + e.message);
    return false;
  }
}

async function offloadTest() {
  try {
    log('Offloading tests to cloud...');
    await run('npm run qmoi:cloud:test');
    log('Tests offloaded successfully');
    return true;
  } catch (e) {
    log('Test offload failed: ' + e.message);
    return false;
  }
}

async function offloadErrorFix() {
  try {
    log('Offloading error fixing to cloud...');
    await run('npm run qmoi:cloud:fix');
    log('Error fixing offloaded successfully');
    return true;
  } catch (e) {
    log('Error fix offload failed: ' + e.message);
    return false;
  }
}

async function offloadMobileBuild() {
  try {
    log('Offloading mobile build to cloud...');
    await run('npm run qmoi:cloud:mobile:build', 'mobile');
    log('Mobile build offloaded successfully');
    return true;
  } catch (e) {
    log('Mobile build offload failed: ' + e.message);
    return false;
  }
}

async function syncFromCloud() {
  try {
    log('Syncing results from cloud...');
    await run('npm run qmoi:cloud:sync');
    log('Cloud sync completed');
    return true;
  } catch (e) {
    log('Cloud sync failed: ' + e.message);
    return false;
  }
}

async function optimizeForLightweight() {
  try {
    // Clear local caches to free up space
    await run('npm run qmoi:cache:clear');
    
    // Move large files to cloud storage
    await run('npm run qmoi:cloud:archive');
    
    // Optimize local storage
    await run('npm run qmoi:storage:optimize');
    
    log('Lightweight optimization completed');
    return true;
  } catch (e) {
    log('Lightweight optimization failed: ' + e.message);
    return false;
  }
}

async function main() {
  log('QMOI Cloud Offload Optimizer started');
  
  // Main monitoring loop
  while (true) {
    try {
      const resources = getSystemResources();
      log(`System resources - Memory: ${resources.memory.usagePercent.toFixed(1)}%, CPU: ${resources.cpu.usage.toFixed(1)}%, Load: ${resources.load.avg5.toFixed(2)}`);
      
      if (shouldOffload(resources)) {
        log('Resource thresholds exceeded, starting cloud offload...');
        
        // Offload heavy tasks to cloud
        await offloadBuild();
        await offloadTest();
        await offloadErrorFix();
        await offloadMobileBuild();
        
        // Optimize for lightweight operation
        await optimizeForLightweight();
        
        // Sync results back from cloud
        await syncFromCloud();
        
        log('Cloud offload cycle completed');
      } else {
        log('Resources within normal limits, no offload needed');
      }
      
      // Wait before next check (30 seconds)
      await new Promise(resolve => setTimeout(resolve, 30 * 1000));
      
    } catch (e) {
      log('Monitoring cycle failed: ' + e.message);
      // Wait before retry (1 minute)
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
  }
}

main().catch(e => log('Fatal error: ' + e.message)); 