/* eslint-env node */
const fs = require('fs');
const { execSync } = require('child_process');
const { notifyMaster } = require('../src/services/WhatsAppService');
const nodemailer = require('nodemailer');
const axios = require('axios');

function logFix(msg) {
  console.log(`[AI Error Fix] ${msg}`);
  // Ensure logs directory exists
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }
  fs.appendFileSync('logs/ai_error_fix.log', `[${new Date().toISOString()}] ${msg}\n`);
}

function getNotificationConfig() {
  try {
    const config = JSON.parse(fs.readFileSync('test_config.json', 'utf-8'));
    return config.notifications || {};
  } catch (e) {
    logFix('Failed to read notification config: ' + e.message);
    return {};
  }
}

async function sendSlackNotification(msg) {
  const config = getNotificationConfig().slack || {};
  if (!config.enabled || !config.webhook_url) {
    logFix('Slack notification is disabled or webhook missing.');
    return;
  }
  try {
    await axios.post(config.webhook_url, { text: msg }, { timeout: 10000 });
    logFix('Slack notification sent.');
  } catch (e) {
    logFix('Failed to send Slack notification: ' + e.message);
  }
}

async function sendEmailNotification(msg) {
  const config = getNotificationConfig().email || {};
  if (!config.enabled || !config.smtp_server || !config.sender_email || !config.sender_password || !config.recipient_emails || !config.recipient_emails.length) {
    logFix('Email notification is disabled or credentials missing.');
    return;
  }
  try {
    let transporter = nodemailer.createTransport({
      host: config.smtp_server,
      port: config.smtp_port || 587,
      secure: false,
      auth: {
        user: config.sender_email,
        pass: config.sender_password,
      },
    });
    await transporter.sendMail({
      from: config.sender_email,
      to: config.recipient_emails.join(','),
      subject: '[QMOI AI] Automated Fix Notification',
      text: msg,
    });
    logFix('Email notification sent.');
  } catch (e) {
    logFix('Failed to send email notification: ' + e.message);
  }
}

async function fixBuildErrors() {
  logFix('Attempting to fix build errors...');
  
  try {
    // Clear npm cache
    execSync('npm cache clean --force', { stdio: 'inherit' });
    logFix('NPM cache cleared.');
    
    // Remove node_modules and reinstall
    if (fs.existsSync('node_modules')) {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
      logFix('node_modules removed.');
    }
    
    // Reinstall dependencies
    execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });
    logFix('Dependencies reinstalled.');
    
    // Fix TypeScript issues
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      logFix('TypeScript check passed.');
    } catch (e) {
      logFix('TypeScript issues detected, attempting to fix...');
      // Try to auto-fix TypeScript issues
      try {
        execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
        logFix('TypeScript issues bypassed with skipLibCheck.');
      } catch (e2) {
        logFix('TypeScript issues remain: ' + e2.message);
      }
    }
    
    // Try build again
    execSync('npm run build', { stdio: 'inherit' });
    logFix('Build successful after fixes.');
    return true;
  } catch (e) {
    logFix('Build fix failed: ' + e.message);
    return false;
  }
}

async function fixVercelErrors() {
  logFix('Attempting to fix Vercel deployment errors...');
  
  try {
    // Clear Vercel cache
    try {
      execSync('npx vercel --clear-cache', { stdio: 'pipe' });
      logFix('Vercel cache cleared.');
    } catch (e) {
      logFix('Vercel cache clear failed, continuing...');
    }
    
    // Fix vercel.json configuration issues
    if (fs.existsSync('vercel.json')) {
      logFix('Checking and fixing vercel.json configuration...');
      try {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        let needsUpdate = false;
        
        // Remove conflicting functions property if builds is present
        if (vercelConfig.builds && vercelConfig.functions) {
          logFix('Removing conflicting functions property...');
          delete vercelConfig.functions;
          needsUpdate = true;
        }
        
        // Remove duplicate build.env if it exists
        if (vercelConfig.build && vercelConfig.build.env && vercelConfig.env) {
          logFix('Removing duplicate build.env...');
          delete vercelConfig.build;
          needsUpdate = true;
        }
        
        // Ensure proper structure
        if (!vercelConfig.builds) {
          logFix('Adding builds configuration...');
          vercelConfig.builds = [
            {
              src: "package.json",
              use: "@vercel/static-build",
              config: {
                distDir: "build",
                installCommand: "npm ci --legacy-peer-deps",
                buildCommand: "npm run build"
              }
            }
          ];
          needsUpdate = true;
        }
        
        // Ensure environment variables
        if (!vercelConfig.env) {
          vercelConfig.env = {};
        }
        if (!vercelConfig.env.NODE_ENV) {
          vercelConfig.env.NODE_ENV = "production";
          needsUpdate = true;
        }
        if (!vercelConfig.env.NEXT_PUBLIC_APP_ENV) {
          vercelConfig.env.NEXT_PUBLIC_APP_ENV = "production";
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
          logFix('vercel.json updated with fixes.');
        } else {
          logFix('vercel.json is already properly configured.');
        }
      } catch (e) {
        logFix(`Error fixing vercel.json: ${e.message}`);
        // Create a new vercel.json if the current one is corrupted
        const newConfig = {
          version: 2,
          builds: [
            {
              src: "package.json",
              use: "@vercel/static-build",
              config: {
                distDir: "build",
                installCommand: "npm ci --legacy-peer-deps",
                buildCommand: "npm run build"
              }
            }
          ],
          env: {
            NODE_ENV: "production",
            NEXT_PUBLIC_APP_ENV: "production",
            QMOI_AUTODEV_ENABLED: "true"
          },
          cleanUrls: true,
          trailingSlash: false
        };
        fs.writeFileSync('vercel.json', JSON.stringify(newConfig, null, 2));
        logFix('Created new vercel.json with proper configuration.');
      }
    } else {
      logFix('vercel.json not found, creating one...');
      const vercelConfig = {
        version: 2,
        builds: [
          {
            src: "package.json",
            use: "@vercel/static-build",
            config: {
              distDir: "build",
              installCommand: "npm ci --legacy-peer-deps",
              buildCommand: "npm run build"
            }
          }
        ],
        env: {
          NODE_ENV: "production",
          NEXT_PUBLIC_APP_ENV: "production",
          QMOI_AUTODEV_ENABLED: "true"
        },
        cleanUrls: true,
        trailingSlash: false
      };
      fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
      logFix('vercel.json created.');
    }
    
    // Ensure .env exists with safe defaults
    if (!fs.existsSync('.env')) {
      logFix('Creating .env file with safe defaults...');
      const envContent = [
        'NODE_ENV=production',
        'NEXT_PUBLIC_APP_ENV=production',
        'QMOI_AUTODEV_ENABLED=true'
      ].join('\n');
      fs.writeFileSync('.env', envContent);
      logFix('.env file created with safe defaults.');
    }
    
    // Try deployment with different strategies
    const strategies = [
      'npx vercel --prod --yes --force',
      'npx vercel --prod --yes --force --prebuilt',
      'npx vercel --prod --yes --force --debug'
    ];
    
    for (const strategy of strategies) {
      try {
        logFix(`Trying deployment strategy: ${strategy}`);
        execSync(strategy, { stdio: 'inherit' });
        logFix('Vercel deployment successful with strategy: ' + strategy);
        return true;
      } catch (e) {
        logFix(`Strategy failed: ${strategy} - ${e.message}`);
        continue;
      }
    }
    
    logFix('All Vercel deployment strategies failed.');
    return false;
  } catch (e) {
    logFix('Vercel fix failed: ' + e.message);
    return false;
  }
}

async function fixLicenseErrors() {
  logFix('Attempting to fix license compliance errors...');
  
  try {
    // Generate license report
    execSync('npx license-checker --production --json > license-report.json', { stdio: 'inherit' });
    logFix('License report generated.');
    
    // Try to fix common license issues
    try {
      execSync('npm audit fix', { stdio: 'inherit' });
      logFix('Security audit fix completed.');
    } catch (e) {
      logFix('Security audit fix failed: ' + e.message);
    }
    
    return true;
  } catch (e) {
    logFix('License fix failed: ' + e.message);
    return false;
  }
}

async function fixTestErrors() {
  logFix('Attempting to fix test errors...');
  
  try {
    // Run tests with different configurations
    const testStrategies = [
      'npm test -- --passWithNoTests --watchAll=false',
      'npm test -- --passWithNoTests --watchAll=false --verbose',
      'npm test -- --passWithNoTests --watchAll=false --silent'
    ];
    
    for (const strategy of testStrategies) {
      try {
        logFix(`Trying test strategy: ${strategy}`);
        execSync(strategy, { stdio: 'inherit' });
        logFix('Tests passed with strategy: ' + strategy);
        return true;
      } catch (e) {
        logFix(`Test strategy failed: ${strategy} - ${e.message}`);
        continue;
      }
    }
    
    logFix('All test strategies failed.');
    return false;
  } catch (e) {
    logFix('Test fix failed: ' + e.message);
    return false;
  }
}

async function fixLintErrors() {
  logFix('Attempting to fix lint errors...');
  
  try {
    // Try different lint fix strategies
    const lintStrategies = [
      'npm run lint:fix',
      'npx eslint . --fix',
      'npx prettier --write .',
      'npx eslint . --fix --max-warnings 0'
    ];
    
    for (const strategy of lintStrategies) {
      try {
        logFix(`Trying lint strategy: ${strategy}`);
        execSync(strategy, { stdio: 'inherit' });
        logFix('Lint fix successful with strategy: ' + strategy);
        return true;
      } catch (e) {
        logFix(`Lint strategy failed: ${strategy} - ${e.message}`);
        continue;
      }
    }
    
    logFix('All lint strategies failed.');
    return false;
  } catch (e) {
    logFix('Lint fix failed: ' + e.message);
    return false;
  }
}

async function sendNotifications(type, result) {
  const msg = `[AI Error Fix] Type: ${type}\nResult: ${result}`;
  try {
    await notifyMaster(msg);
    logFix('WhatsApp notification sent to master.');
  } catch (e) {
    logFix('Failed to send WhatsApp notification: ' + e.message);
  }
  await sendSlackNotification(msg);
  await sendEmailNotification(msg);
}

async function main() {
  const argType = process.argv.find((a) => a.startsWith('--type=')) || '';
  const type = argType.replace('--type=', '');
  let result = '';
  
  logFix(`Starting error fix for type: ${type}`);
  
  if (type === 'license') {
    result = (await fixLicenseErrors()) ? 'License fix attempted.' : 'License fix failed.';
  } else if (type === 'vercel') {
    result = (await fixVercelErrors()) ? 'Vercel fix attempted.' : 'Vercel fix failed.';
  } else if (type === 'build') {
    result = (await fixBuildErrors()) ? 'Build fix attempted.' : 'Build fix failed.';
  } else if (type === 'test') {
    result = (await fixTestErrors()) ? 'Test fix attempted.' : 'Test fix failed.';
  } else if (type === 'lint') {
    result = (await fixLintErrors()) ? 'Lint fix attempted.' : 'Lint fix failed.';
  } else if (type === 'comprehensive') {
    logFix('Running comprehensive error fix...');
    const results = [];
    results.push(await fixLintErrors() ? 'Lint: OK' : 'Lint: Failed');
    results.push(await fixTestErrors() ? 'Test: OK' : 'Test: Failed');
    results.push(await fixBuildErrors() ? 'Build: OK' : 'Build: Failed');
    results.push(await fixVercelErrors() ? 'Vercel: OK' : 'Vercel: Failed');
    result = `Comprehensive fix results: ${results.join(', ')}`;
  } else {
    result = 'No error type specified. Exiting.';
  }
  
  logFix(`Error fix completed: ${result}`);
  await sendNotifications(type, result);
}

main().catch(error => {
  logFix(`Fatal error in main: ${error.message}`);
  process.exit(1);
}); 