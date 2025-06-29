#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// QMOI Self-Test Runner for Manual Error Simulation and Auto-Fix Testing
class QmoiSelfTestRunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResults = [];
    this.backupFiles = new Map();
    this.originalState = {};
    
    // Test scenarios
    this.testScenarios = [
      {
        name: 'Build Error - Missing Dependencies',
        category: 'build',
        severity: 'high',
        setup: this.setupMissingDependencies.bind(this),
        cleanup: this.cleanupMissingDependencies.bind(this),
        expectedError: 'Cannot find module'
      },
      {
        name: 'Build Error - Invalid TypeScript',
        category: 'build',
        severity: 'high',
        setup: this.setupInvalidTypeScript.bind(this),
        cleanup: this.cleanupInvalidTypeScript.bind(this),
        expectedError: 'Type error'
      },
      {
        name: 'Lint Error - Unused Variables',
        category: 'lint',
        severity: 'medium',
        setup: this.setupUnusedVariables.bind(this),
        cleanup: this.cleanupUnusedVariables.bind(this),
        expectedError: 'unused variable'
      },
      {
        name: 'Config Error - Invalid JSON',
        category: 'config',
        severity: 'medium',
        setup: this.setupInvalidJson.bind(this),
        cleanup: this.cleanupInvalidJson.bind(this),
        expectedError: 'Unexpected token'
      },
      {
        name: 'Environment Error - Missing Variables',
        category: 'env',
        severity: 'high',
        setup: this.setupMissingEnvVars.bind(this),
        cleanup: this.cleanupMissingEnvVars.bind(this),
        expectedError: 'Environment variable'
      },
      {
        name: 'Deployment Error - Invalid Vercel Config',
        category: 'deploy',
        severity: 'high',
        setup: this.setupInvalidVercelConfig.bind(this),
        cleanup: this.cleanupInvalidVercelConfig.bind(this),
        expectedError: 'Invalid configuration'
      }
    ];
  }

  async backupFile(filePath) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      this.backupFiles.set(filePath, content);
    }
  }

  async restoreFile(filePath) {
    const backup = this.backupFiles.get(filePath);
    if (backup) {
      fs.writeFileSync(filePath, backup);
      this.backupFiles.delete(filePath);
    }
  }

  async setupMissingDependencies() {
    console.log('  📦 Setting up missing dependencies test...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    await this.backupFile(packageJsonPath);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    delete packageJson.dependencies.react;
    delete packageJson.dependencies['react-dom'];
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  async cleanupMissingDependencies() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    await this.restoreFile(packageJsonPath);
  }

  async setupInvalidTypeScript() {
    console.log('  🔧 Setting up invalid TypeScript test...');
    
    const testFile = path.join(this.projectRoot, 'test-invalid.ts');
    const invalidCode = `
interface Test {
  name: string;
}

const test: Test = {
  name: 123, // Type error: number assigned to string
  invalid: true // Property doesn't exist
};
`;
    
    fs.writeFileSync(testFile, invalidCode);
    this.backupFiles.set(testFile, null); // Mark for deletion
  }

  async cleanupInvalidTypeScript() {
    const testFile = path.join(this.projectRoot, 'test-invalid.ts');
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }

  async setupUnusedVariables() {
    console.log('  🧹 Setting up unused variables test...');
    
    const testFile = path.join(this.projectRoot, 'test-unused.ts');
    const codeWithUnused = `
const usedVariable = 'used';
const unusedVariable = 'unused'; // This will trigger lint error

console.log(usedVariable);
`;
    
    fs.writeFileSync(testFile, codeWithUnused);
    this.backupFiles.set(testFile, null);
  }

  async cleanupUnusedVariables() {
    const testFile = path.join(this.projectRoot, 'test-unused.ts');
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }

  async setupInvalidJson() {
    console.log('  📄 Setting up invalid JSON test...');
    
    const testConfig = path.join(this.projectRoot, 'test-config.json');
    const invalidJson = `{
  "valid": true,
  "invalid": "missing quote,
  "trailing": "comma",
}`;
    
    fs.writeFileSync(testConfig, invalidJson);
    this.backupFiles.set(testConfig, null);
  }

  async cleanupInvalidJson() {
    const testConfig = path.join(this.projectRoot, 'test-config.json');
    if (fs.existsSync(testConfig)) {
      fs.unlinkSync(testConfig);
    }
  }

  async setupMissingEnvVars() {
    console.log('  🌍 Setting up missing environment variables test...');
    
    const envPath = path.join(this.projectRoot, '.env');
    await this.backupFile(envPath);
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => 
      !line.includes('NODE_ENV') && !line.includes('NEXT_PUBLIC')
    );
    
    fs.writeFileSync(envPath, lines.join('\n'));
  }

  async cleanupMissingEnvVars() {
    const envPath = path.join(this.projectRoot, '.env');
    await this.restoreFile(envPath);
  }

  async setupInvalidVercelConfig() {
    console.log('  🚀 Setting up invalid Vercel config test...');
    
    const vercelPath = path.join(this.projectRoot, 'vercel.json');
    await this.backupFile(vercelPath);
    
    const invalidConfig = `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build",
        "installCommand": "npm ci --legacy-peer-deps",
        "buildCommand": "npm run build"
      }
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_APP_ENV": "production",
    "QMOI_AUTODEV_ENABLED": "true"
  },
  "invalid": "property"
}`;
    
    fs.writeFileSync(vercelPath, invalidConfig);
  }

  async cleanupInvalidVercelConfig() {
    const vercelPath = path.join(this.projectRoot, 'vercel.json');
    await this.restoreFile(vercelPath);
  }

  async runCommand(command, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, [], {
        shell: true,
        stdio: 'pipe',
        timeout
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({
          code,
          stdout,
          stderr,
          success: code === 0
        });
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async testScenario(scenario) {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log(`   Category: ${scenario.category}`);
    console.log(`   Severity: ${scenario.severity}`);
    
    const result = {
      name: scenario.name,
      category: scenario.category,
      severity: scenario.severity,
      setupTime: 0,
      testTime: 0,
      cleanupTime: 0,
      setupSuccess: false,
      testSuccess: false,
      cleanupSuccess: false,
      error: null,
      autoFixAttempted: false,
      autoFixSuccess: false
    };
    
    try {
      // Setup
      const setupStart = Date.now();
      await scenario.setup();
      result.setupTime = Date.now() - setupStart;
      result.setupSuccess = true;
      
      // Test
      const testStart = Date.now();
      const testCommands = this.getTestCommands(scenario.category);
      
      for (const command of testCommands) {
        try {
          const commandResult = await this.runCommand(command);
          
          if (!commandResult.success) {
            // Check if this is the expected error
            const hasExpectedError = commandResult.stderr.includes(scenario.expectedError) ||
                                   commandResult.stdout.includes(scenario.expectedError);
            
            if (hasExpectedError) {
              result.testSuccess = true; // Expected error occurred
              console.log(`   ✅ Expected error detected: ${scenario.expectedError}`);
            } else {
              console.log(`   ⚠️  Unexpected error in ${command}`);
            }
            break;
          }
        } catch (error) {
          console.log(`   ⚠️  Command failed: ${command}`);
        }
      }
      
      result.testTime = Date.now() - testStart;
      
      // Attempt auto-fix
      if (result.testSuccess) {
        console.log('   🔧 Attempting auto-fix...');
        result.autoFixAttempted = true;
        
        try {
          const fixResult = await this.runCommand('node scripts/enhanced-error-fix.js --type=comprehensive');
          result.autoFixSuccess = fixResult.success;
          
          if (fixResult.success) {
            console.log('   ✅ Auto-fix successful');
          } else {
            console.log('   ❌ Auto-fix failed');
          }
        } catch (error) {
          console.log('   ❌ Auto-fix error:', error.message);
        }
      }
      
    } catch (error) {
      result.error = error.message;
      console.log(`   ❌ Setup failed: ${error.message}`);
    } finally {
      // Cleanup
      try {
        const cleanupStart = Date.now();
        await scenario.cleanup();
        result.cleanupTime = Date.now() - cleanupStart;
        result.cleanupSuccess = true;
        console.log('   🧹 Cleanup completed');
      } catch (error) {
        console.log(`   ⚠️  Cleanup failed: ${error.message}`);
      }
    }
    
    return result;
  }

  getTestCommands(category) {
    const commands = {
      build: ['npm run build', 'npm run type-check'],
      lint: ['npm run lint'],
      config: ['node -e "JSON.parse(require(\'fs\').readFileSync(\'test-config.json\'))"'],
      env: ['npm run build'],
      deploy: ['npx vercel --version']
    };
    
    return commands[category] || ['npm run build'];
  }

  async runAllTests() {
    console.log('🚀 Starting QMOI Self-Test Runner...\n');
    
    const startTime = Date.now();
    
    for (const scenario of this.testScenarios) {
      const result = await this.testScenario(scenario);
      this.testResults.push(result);
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate report
    this.generateReport(totalTime);
    
    // Cleanup any remaining backup files
    await this.cleanupAllBackups();
  }

  async cleanupAllBackups() {
    console.log('\n🧹 Cleaning up backup files...');
    
    for (const [filePath, content] of this.backupFiles) {
      if (content === null) {
        // File was created for testing, delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else {
        // Restore original file
        fs.writeFileSync(filePath, content);
      }
    }
    
    this.backupFiles.clear();
  }

  generateReport(totalTime) {
    const report = {
      timestamp: new Date().toISOString(),
      totalTime: totalTime,
      summary: {
        totalTests: this.testResults.length,
        setupSuccess: this.testResults.filter(r => r.setupSuccess).length,
        testSuccess: this.testResults.filter(r => r.testSuccess).length,
        cleanupSuccess: this.testResults.filter(r => r.cleanupSuccess).length,
        autoFixAttempted: this.testResults.filter(r => r.autoFixAttempted).length,
        autoFixSuccess: this.testResults.filter(r => r.autoFixSuccess).length
      },
      results: this.testResults,
      categories: this.groupByCategory()
    };
    
    const reportPath = path.join(this.projectRoot, 'logs', 'self-test-report.json');
    
    // Ensure logs directory exists
    const logsDir = path.dirname(reportPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Self-Test Report:');
    console.log(`   Total tests: ${report.summary.totalTests}`);
    console.log(`   Setup success: ${report.summary.setupSuccess}/${report.summary.totalTests}`);
    console.log(`   Test success: ${report.summary.testSuccess}/${report.summary.totalTests}`);
    console.log(`   Cleanup success: ${report.summary.cleanupSuccess}/${report.summary.totalTests}`);
    console.log(`   Auto-fix attempted: ${report.summary.autoFixAttempted}`);
    console.log(`   Auto-fix success: ${report.summary.autoFixSuccess}`);
    console.log(`   Total time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   Report saved to: ${reportPath}`);
    
    // Print category summary
    console.log('\n📋 Category Summary:');
    Object.entries(report.categories).forEach(([category, results]) => {
      const successCount = results.filter(r => r.testSuccess).length;
      console.log(`   ${category}: ${successCount}/${results.length} tests passed`);
    });
    
    return report;
  }

  groupByCategory() {
    const grouped = {};
    
    this.testResults.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });
    
    return grouped;
  }

  async runSpecificTest(testName) {
    const scenario = this.testScenarios.find(s => s.name === testName);
    
    if (!scenario) {
      console.error(`❌ Test scenario "${testName}" not found`);
      console.log('Available tests:');
      this.testScenarios.forEach(s => console.log(`   - ${s.name}`));
      return;
    }
    
    console.log(`🎯 Running specific test: ${testName}`);
    const result = await this.testScenario(scenario);
    this.testResults.push(result);
    
    console.log('\n📊 Test Result:');
    console.log(`   Setup: ${result.setupSuccess ? '✅' : '❌'}`);
    console.log(`   Test: ${result.testSuccess ? '✅' : '❌'}`);
    console.log(`   Cleanup: ${result.cleanupSuccess ? '✅' : '❌'}`);
    console.log(`   Auto-fix: ${result.autoFixSuccess ? '✅' : '❌'}`);
    
    await this.cleanupAllBackups();
  }
}

// CLI Interface
if (require.main === module) {
  const runner = new QmoiSelfTestRunner();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  const testName = args[1];
  
  switch (command) {
    case 'all':
      runner.runAllTests().catch(console.error);
      break;
    case 'test':
      if (testName) {
        runner.runSpecificTest(testName).catch(console.error);
      } else {
        console.log('Usage: node qmoi_self_test_runner.js test <test-name>');
        console.log('Available tests:');
        runner.testScenarios.forEach(s => console.log(`   - ${s.name}`));
      }
      break;
    case 'list':
      console.log('Available test scenarios:');
      runner.testScenarios.forEach(s => {
        console.log(`   - ${s.name} (${s.category}, ${s.severity})`);
      });
      break;
    default:
      console.log('Usage: node qmoi_self_test_runner.js [all|test|list] [test-name]');
  }
}

module.exports = QmoiSelfTestRunner; 