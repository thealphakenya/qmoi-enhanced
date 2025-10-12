#!/usr/bin/env node

/**
 * QMOI Revenue Enforcer & Analytics
 * Enforces daily revenue targets, ensures growth, and integrates with AI idea generation and analytics.
 * Now supports --auto mode for background operation and auto-triggering new projects/marketing if growth stalls.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const REVENUE_LOG = path.join(process.cwd(), 'logs', 'qmoi-daily-revenue.json');
const ALERT_LOG = path.join(process.cwd(), 'logs', 'qmoi-revenue-alerts.log');
const MIN_DAILY_TARGET = 50000;
const MIN_QMOI_SPACE = 50000;
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadRevenueLog() {
  if (!fs.existsSync(REVENUE_LOG)) return {};
  return JSON.parse(fs.readFileSync(REVENUE_LOG, 'utf8'));
}

function saveRevenueLog(log) {
  fs.writeFileSync(REVENUE_LOG, JSON.stringify(log, null, 2));
}

function logAlert(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(ALERT_LOG, `[${timestamp}] ${message}\n`);
  console.log(`[ALERT] ${message}`);
}

function getPreviousDayRevenue(log, today) {
  const days = Object.keys(log).sort();
  const todayIdx = days.indexOf(today);
  if (todayIdx > 0) return log[days[todayIdx - 1]]?.total || MIN_DAILY_TARGET;
  return MIN_DAILY_TARGET;
}

function enforceTargets(todayRevenue, prevRevenue, autoMode = false) {
  let enforcedTarget = Math.max(MIN_DAILY_TARGET, prevRevenue + 1);
  if (todayRevenue < enforcedTarget) {
    logAlert(`Revenue below target! Today: Ksh ${todayRevenue}, Target: Ksh ${enforcedTarget}`);
    if (autoMode) {
      triggerAIActions('revenue');
    }
  } else {
    console.log(`Revenue target met: Ksh ${todayRevenue} (Target: Ksh ${enforcedTarget})`);
  }
  return enforcedTarget;
}

function checkQmoiSpaceBalance(balance, autoMode = false) {
  if (balance < MIN_QMOI_SPACE) {
    logAlert(`QMOI Space balance below minimum! Balance: Ksh ${balance}, Minimum: Ksh ${MIN_QMOI_SPACE}`);
    if (autoMode) {
      triggerAIActions('qmoiSpace');
    }
  } else {
    console.log(`QMOI Space balance OK: Ksh ${balance}`);
  }
}

function updateRevenue(today, amount, qmoiSpaceBalance, autoMode = false) {
  const log = loadRevenueLog();
  log[today] = log[today] || { total: 0, details: [] };
  log[today].total += amount;
  log[today].details.push({ timestamp: new Date().toISOString(), amount });
  saveRevenueLog(log);
  checkQmoiSpaceBalance(qmoiSpaceBalance, autoMode);
  const prevRevenue = getPreviousDayRevenue(log, today);
  enforceTargets(log[today].total, prevRevenue, autoMode);
}

function analyticsReport() {
  const log = loadRevenueLog();
  const days = Object.keys(log).sort();
  let growthStreak = 0;
  let last = 0;
  let max = 0;
  let min = Infinity;
  let sum = 0;
  days.forEach(day => {
    const total = log[day].total;
    if (total > last) growthStreak++;
    last = total;
    if (total > max) max = total;
    if (total < min) min = total;
    sum += total;
  });
  const avg = days.length ? Math.round(sum / days.length) : 0;
  console.log(`\nQMOI Revenue Analytics:`);
  console.log(`- Days tracked: ${days.length}`);
  console.log(`- Max daily revenue: Ksh ${max}`);
  console.log(`- Min daily revenue: Ksh ${min}`);
  console.log(`- Average daily revenue: Ksh ${avg}`);
  console.log(`- Growth streak: ${growthStreak} days`);
}

function triggerAIActions(reason) {
  const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] [AUTO] Triggering AI actions due to: ${reason}`;
  fs.appendFileSync(ALERT_LOG, msg + '\n');
  console.log(msg);
  // Example: trigger project generation and marketing
  exec('node scripts/qmoi-auto-enhancement-system.js --enhance-features', (err, stdout, stderr) => {
    if (err) {
      logAlert(`[AUTO] Failed to trigger project generation: ${err.message}`);
    } else {
      logAlert(`[AUTO] Project generation triggered. Output: ${stdout}`);
    }
  });
  exec('node scripts/qmoi-auto-enhancement-system.js --enhance-ai', (err, stdout, stderr) => {
    if (err) {
      logAlert(`[AUTO] Failed to trigger AI enhancement: ${err.message}`);
    } else {
      logAlert(`[AUTO] AI enhancement triggered. Output: ${stdout}`);
    }
  });
  exec('node scripts/qmoi-auto-enhancement-system.js --enhance-performance', (err, stdout, stderr) => {
    if (err) {
      logAlert(`[AUTO] Failed to trigger performance enhancement: ${err.message}`);
    } else {
      logAlert(`[AUTO] Performance enhancement triggered. Output: ${stdout}`);
    }
  });
  // Optionally, trigger marketing/distribution
  exec('node scripts/qmoi-auto-enhancement-system.js --enhance-security', (err, stdout, stderr) => {
    if (err) {
      logAlert(`[AUTO] Failed to trigger security enhancement: ${err.message}`);
    } else {
      logAlert(`[AUTO] Security enhancement triggered. Output: ${stdout}`);
    }
  });
}

function getQmoiSpaceBalance() {
  // Placeholder: integrate with actual QMOI Space balance API or logic
  // For now, simulate with a random value for demonstration
  return 50000 + Math.floor(Math.random() * 100000);
}

function getTodayRevenue() {
  const log = loadRevenueLog();
  const today = getToday();
  return log[today]?.total || 0;
}

function autoModeLoop() {
  setInterval(() => {
    const today = getToday();
    const todayRevenue = getTodayRevenue();
    const qmoiSpace = getQmoiSpaceBalance();
    console.log(`\n[AUTO] Checking revenue and QMOI Space at ${new Date().toISOString()}`);
    updateRevenue(today, 0, qmoiSpace, true); // 0 means just check, not add
  }, CHECK_INTERVAL_MS);
  // Initial check
  const today = getToday();
  const todayRevenue = getTodayRevenue();
  const qmoiSpace = getQmoiSpaceBalance();
  updateRevenue(today, 0, qmoiSpace, true);
}

// CLI usage
const args = process.argv.slice(2);
if (args[0] === '--update') {
  // Example: node qmoi-revenue-enforcer.js --update 120000 60000
  const amount = parseInt(args[1], 10);
  const qmoiSpace = parseInt(args[2], 10);
  if (isNaN(amount) || isNaN(qmoiSpace)) {
    console.error('Usage: --update <amount> <qmoiSpaceBalance>');
    process.exit(1);
  }
  updateRevenue(getToday(), amount, qmoiSpace);
} else if (args[0] === '--analytics') {
  analyticsReport();
} else if (args[0] === '--auto') {
  console.log('[AUTO] QMOI Revenue Enforcer running in background mode.');
  autoModeLoop();
} else {
  console.log(`
QMOI Revenue Enforcer & Analytics

Usage:
  node qmoi-revenue-enforcer.js --update <amount> <qmoiSpaceBalance>   # Update today's revenue and enforce targets
  node qmoi-revenue-enforcer.js --analytics                           # Show analytics report
  node qmoi-revenue-enforcer.js --auto                                # Run in background, auto-enforce and auto-trigger AI actions

- Minimum daily target: Ksh 50,000
- Minimum QMOI Space: Ksh 50,000
- No maximum: Always try to generate more than previous day
`);
} 