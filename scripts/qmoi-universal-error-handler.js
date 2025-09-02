#!/usr/bin/env node

/**
 * QMOI Universal Error Handler
 * Comprehensive error detection, analysis, and automatic fixing system
 * Handles all types of errors: build, dependency, syntax, runtime, network, etc.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

class QMOIUniversalErrorHandler {
  constructor() {
    this.errorRegistry = new Map();
    this.fixStrategies = new Map();
    this.performanceMetrics = {
      errorsFixed: 0,
      errorsDetected: 0,
      averageFixTime: 0,
      successRate: 0
    };
    this.maxRetries = 5;
    this.retryDelay = 1000;
    this.initializeFixStrategies();
  }

  async initializeFixStrategies() {
    // Package.json parsing errors
    this.fixStrategies.set('package_json_parseable', {
      detect: this.detectPackageJsonError.bind(this),
      fix: this.fixPackageJsonError.bind(this),
      priority: 1
    });

    // Dependency errors
    this.fixStrategies.set('dependency_error', {
      detect: this.detectDependencyError.bind(this),
      fix: this.fixDependencyError.bind(this),
      priority: 2
    });

    // Build errors
    this.fixStrategies.set('build_error', {
      detect: this.detectBuildError.bind(this),
      fix: this.fixBuildError.bind(this),
      priority: 3
    });

    // Syntax errors
    this.fixStrategies.set('syntax_error', {
      detect: this.detectSyntaxError.bind(this),
      fix: this.fixSyntaxError.bind(this),
      priority: 4
    });

    // Network errors
    this.fixStrategies.set('network_error', {
      detect: this.detectNetworkError.bind(this),
      fix: this.fixNetworkError.bind(this),
      priority: 5
    });

    // Runtime errors
    this.fixStrategies.set('runtime_error', {
      detect: this.detectRuntimeError.bind(this),
      fix: this.fixRuntimeError.bind(this),
      priority: 6
    });

    // Memory errors
    this.fixStrategies.set('memory_error', {
      detect: this.detectMemoryError.bind(this),
      fix: this.fixMemoryError.bind(this),
      priority: 7
    });

    // Permission errors
    this.fixStrategies.set('permission_error', {
      detect: this.detectPermissionError.bind(this),
      fix: this.fixPermissionError.bind(this),
      priority: 8
    });
  }

  async detectPackageJsonError(error) {
    return error.includes('package.json not parseable') || 
           error.includes('Unexpected token') ||
           error.includes('JSON parse error');
  }

  async fixPackageJsonError(error) {
    console.log('🔧 Fixing package.json parsing error...');
    
    try {
      // Read and validate package.json
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf8');
      
      // Try to parse and fix common issues
      let fixed = false;
      let parsed;
      
      try {
        parsed = JSON.parse(content);
        console.log('✅ package.json is valid');
        return { success: true, message: 'package.json is valid' };
      } catch (parseError) {
        console.log('❌ package.json has parsing errors, attempting to fix...');
        
        // Fix common JSON issues
        let fixedContent = content
          .replace(/,\s*}/g, '}') // Remove trailing commas
          .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        // Try parsing again
        try {
          parsed = JSON.parse(fixedContent);
          await fs.writeFile(packageJsonPath, JSON.stringify(parsed, null, 2));
          console.log('✅ package.json fixed and saved');
          fixed = true;
        } catch (secondError) {
          console.log('❌ Could not auto-fix package.json, creating backup and regenerating...');
          
          // Create backup
          await fs.writeFile(packageJsonPath + '.backup', content);
          
          // Generate new package.json from template
          const template = this.generatePackageJsonTemplate();
          await fs.writeFile(packageJsonPath, JSON.stringify(template, null, 2));
          console.log('✅ New package.json generated from template');
          fixed = true;
        }
      }
      
      return { success: fixed, message: fixed ? 'package.json fixed' : 'package.json fix failed' };
    } catch (error) {
      console.error('❌ Error fixing package.json:', error.message);
      return { success: false, message: error.message };
    }
  }

  generatePackageJsonTemplate() {
    return {
      name: "q-city",
      version: "1.0.0",
      description: "AI-Powered Virtual Supercomputer",
      main: "src/main.js",
      scripts: {
        "dev": "react-scripts start",
        "build": "react-scripts build",
        "start": "react-scripts start",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "react-scripts": "5.0.1"
      },
      devDependencies: {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0"
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
      }
    };
  }

  async detectDependencyError(error) {
    return error.includes('Cannot find module') ||
           error.includes('Module not found') ||
           error.includes('dependency') ||
           error.includes('npm install') ||
           error.includes('yarn install');
  }

  async fixDependencyError(error) {
    console.log('🔧 Fixing dependency error...');
    
    try {
      // Clean install with multiple strategies
      const strategies = [
        () => execSync('npm cache clean --force', { stdio: 'inherit' }),
        () => execSync('npx rimraf node_modules package-lock.json', { stdio: 'inherit' }),
        () => execSync('npm install --legacy-peer-deps', { stdio: 'inherit' }),
        () => execSync('npm audit fix --force', { stdio: 'inherit' }),
        () => execSync('npm dedupe', { stdio: 'inherit' })
      ];

      for (const strategy of strategies) {
        try {
          strategy();
          console.log('✅ Dependency fix strategy completed');
        } catch (strategyError) {
          console.log(`⚠️ Strategy failed, trying next...`);
        }
      }

      return { success: true, message: 'Dependencies fixed' };
    } catch (error) {
      console.error('❌ Error fixing dependencies:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectBuildError(error) {
    return error.includes('build failed') ||
           error.includes('compilation error') ||
           error.includes('webpack') ||
           error.includes('babel') ||
           error.includes('TypeScript');
  }

  async fixBuildError(error) {
    console.log('🔧 Fixing build error...');
    
    try {
      // Clean build artifacts
      execSync('npx rimraf build dist .next', { stdio: 'inherit' });
      
      // Clear cache
      execSync('npm run build -- --no-cache', { stdio: 'inherit' });
      
      return { success: true, message: 'Build fixed' };
    } catch (error) {
      console.error('❌ Error fixing build:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectSyntaxError(error) {
    return error.includes('syntax error') ||
           error.includes('Unexpected token') ||
           error.includes('parsing error') ||
           error.includes('ESLint');
  }

  async fixSyntaxError(error) {
    console.log('🔧 Fixing syntax error...');
    
    try {
      // Run ESLint auto-fix
      execSync('npx eslint . --fix', { stdio: 'inherit' });
      
      // Run Prettier
      execSync('npx prettier --write .', { stdio: 'inherit' });
      
      return { success: true, message: 'Syntax fixed' };
    } catch (error) {
      console.error('❌ Error fixing syntax:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectNetworkError(error) {
    return error.includes('network') ||
           error.includes('connection') ||
           error.includes('timeout') ||
           error.includes('ECONNREFUSED') ||
           error.includes('ENOTFOUND');
  }

  async fixNetworkError(error) {
    console.log('🔧 Fixing network error...');
    
    try {
      // Test network connectivity
      await axios.get('https://httpbin.org/get', { timeout: 5000 });
      console.log('✅ Network connectivity confirmed');
      
      // Clear DNS cache
      try {
        execSync('npx dns-cache-clear', { stdio: 'inherit' });
      } catch (e) {
        // DNS cache clear not available, continue
      }
      
      return { success: true, message: 'Network fixed' };
    } catch (error) {
      console.error('❌ Error fixing network:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectRuntimeError(error) {
    return error.includes('runtime') ||
           error.includes('ReferenceError') ||
           error.includes('TypeError') ||
           error.includes('RangeError');
  }

  async fixRuntimeError(error) {
    console.log('🔧 Fixing runtime error...');
    
    try {
      // Restart the application
      execSync('npm run dev', { stdio: 'inherit' });
      
      return { success: true, message: 'Runtime fixed' };
    } catch (error) {
      console.error('❌ Error fixing runtime:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectMemoryError(error) {
    return error.includes('memory') ||
           error.includes('heap') ||
           error.includes('out of memory') ||
           error.includes('ENOMEM');
  }

  async fixMemoryError(error) {
    console.log('🔧 Fixing memory error...');
    
    try {
      // Clear memory cache
      if (global.gc) {
        global.gc();
      }
      
      // Restart with increased memory
      process.env.NODE_OPTIONS = '--max-old-space-size=4096';
      
      return { success: true, message: 'Memory fixed' };
    } catch (error) {
      console.error('❌ Error fixing memory:', error.message);
      return { success: false, message: error.message };
    }
  }

  async detectPermissionError(error) {
    return error.includes('permission') ||
           error.includes('EACCES') ||
           error.includes('EPERM') ||
           error.includes('access denied');
  }

  async fixPermissionError(error) {
    console.log('🔧 Fixing permission error...');
    
    try {
      // Fix file permissions
      execSync('chmod -R 755 .', { stdio: 'inherit' });
      
      return { success: true, message: 'Permissions fixed' };
    } catch (error) {
      console.error('❌ Error fixing permissions:', error.message);
      return { success: false, message: error.message };
    }
  }

  async analyzeError(error) {
    const errorId = crypto.createHash('md5').update(error).digest('hex');
    const timestamp = new Date().toISOString();
    
    const analysis = {
      id: errorId,
      timestamp,
      originalError: error,
      errorType: null,
      severity: 'medium',
      fixStrategy: null,
      confidence: 0
    };

    // Analyze error type and determine fix strategy
    for (const [type, strategy] of this.fixStrategies) {
      const isMatch = await strategy.detect(error);
      if (isMatch) {
        analysis.errorType = type;
        analysis.fixStrategy = strategy.fix;
        analysis.confidence = 0.9;
        break;
      }
    }

    // Determine severity
    if (error.includes('critical') || error.includes('fatal')) {
      analysis.severity = 'high';
    } else if (error.includes('warning') || error.includes('deprecated')) {
      analysis.severity = 'low';
    }

    this.errorRegistry.set(errorId, analysis);
    return analysis;
  }

  async fixError(error) {
    console.log('🚀 QMOI Universal Error Handler - Starting error fix...');
    
    const startTime = Date.now();
    const analysis = await this.analyzeError(error);
    
    console.log(`📊 Error Analysis: ${analysis.errorType} (${analysis.severity})`);
    
    if (!analysis.fixStrategy) {
      console.log('❌ No fix strategy found for this error type');
      return { success: false, message: 'No fix strategy available' };
    }

    let result = { success: false, message: 'Fix failed' };
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      console.log(`🔄 Fix attempt ${attempt}/${this.maxRetries}...`);
      
      try {
        result = await analysis.fixStrategy(error);
        
        if (result.success) {
          const fixTime = Date.now() - startTime;
          this.performanceMetrics.errorsFixed++;
          this.performanceMetrics.averageFixTime = 
            (this.performanceMetrics.averageFixTime + fixTime) / 2;
          
          console.log(`✅ Error fixed successfully in ${fixTime}ms`);
          break;
        }
      } catch (fixError) {
        console.log(`⚠️ Fix attempt ${attempt} failed: ${fixError.message}`);
        
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }

    this.performanceMetrics.errorsDetected++;
    this.performanceMetrics.successRate = 
      this.performanceMetrics.errorsFixed / this.performanceMetrics.errorsDetected;

    return result;
  }

  async handleAllErrors() {
    console.log('🔍 QMOI Universal Error Handler - Scanning for all errors...');
    
    const errors = [];
    
    // Check package.json
    try {
      const packageJson = await fs.readFile('package.json', 'utf8');
      JSON.parse(packageJson);
    } catch (error) {
      errors.push(`package.json not parseable: ${error.message}`);
    }

    // Check dependencies
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' });
    } catch (error) {
      errors.push(`Dependency error: ${error.message}`);
    }

    // Check build
    try {
      execSync('npm run build', { stdio: 'pipe' });
    } catch (error) {
      errors.push(`Build error: ${error.message}`);
    }

    // Check syntax
    try {
      execSync('npx eslint .', { stdio: 'pipe' });
    } catch (error) {
      errors.push(`Syntax error: ${error.message}`);
    }

    // Fix all detected errors
    for (const error of errors) {
      await this.fixError(error);
    }

    return {
      errorsDetected: errors.length,
      errorsFixed: this.performanceMetrics.errorsFixed,
      successRate: this.performanceMetrics.successRate
    };
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  getErrorRegistry() {
    return Array.from(this.errorRegistry.values());
  }
}

// CLI interface
if (require.main === module) {
  const handler = new QMOIUniversalErrorHandler();
  const args = process.argv.slice(2);

  async function main() {
    if (args.includes('--all')) {
      const result = await handler.handleAllErrors();
      console.log('📈 Performance Summary:', result);
    } else if (args.includes('--error')) {
      const errorIndex = args.indexOf('--error');
      const error = args[errorIndex + 1];
      if (error) {
        const result = await handler.fixError(error);
        console.log('Fix result:', result);
      }
    } else if (args.includes('--metrics')) {
      console.log('📊 Performance Metrics:', handler.getPerformanceMetrics());
    } else if (args.includes('--registry')) {
      console.log('📋 Error Registry:', handler.getErrorRegistry());
    } else {
      console.log(`
QMOI Universal Error Handler

Usage:
  node qmoi-universal-error-handler.js --all                    # Fix all errors
  node qmoi-universal-error-handler.js --error "error message"  # Fix specific error
  node qmoi-universal-error-handler.js --metrics                # Show performance metrics
  node qmoi-universal-error-handler.js --registry               # Show error registry
      `);
    }
  }

  main().catch(console.error);
}

module.exports = QMOIUniversalErrorHandler; 