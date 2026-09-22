#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LintReporter {
  constructor() {
    this.projectRoot = join(__dirname, '..');
    this.logsDir = join(this.projectRoot, 'logs');
    this.reportsDir = join(this.projectRoot, 'reports');
    this.ensureDirs();
  }

  ensureDirs() {
    [this.logsDir, this.reportsDir].forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [REPORTER-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    const logFile = join(this.logsDir, 'lint-reporter.log');
    writeFileSync(logFile, logMessage + '\n', { flag: 'a' });
  }

  async runLint() {
    try {
      const output = execSync('yarn lint', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return { success: true, output: '' };
    } catch (error) {
      return { success: false, output: error.stdout || error.stderr || '' };
    }
  }

  parseErrors(output) {
    const lines = output.split('\n');
    const errors = [];
    let currentFile = '';

    for (const line of lines) {
      // Extract file path
      const fileMatch = line.match(/^(.+?)\s+✖/);
      if (fileMatch) {
        currentFile = fileMatch[1].trim();
        continue;
      }

      // Parse error details
      const errorMatch = line.match(/^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(.+)$/);
      if (errorMatch) {
        const [, lineNum, colNum, severity, rule, message] = errorMatch;
        errors.push({
          file: currentFile,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          severity,
          rule,
          message: message.trim(),
          timestamp: new Date().toISOString()
        });
      }
    }

    return errors;
  }

  categorizeErrors(errors) {
    const categories = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      style: [],
      performance: [],
      security: [],
      accessibility: []
    };

    for (const error of errors) {
      const rule = error.rule.toLowerCase();
      
      // Critical errors
      if (rule.includes('no-undef') || rule.includes('import/no-unresolved') || rule.includes('no-unused-vars')) {
        categories.critical.push(error);
      }
      // Security issues
      else if (rule.includes('security') || rule.includes('no-eval') || rule.includes('no-implied-eval')) {
        categories.security.push(error);
      }
      // Performance issues
      else if (rule.includes('performance') || rule.includes('no-console') || rule.includes('no-debugger')) {
        categories.performance.push(error);
      }
      // Accessibility issues
      else if (rule.includes('jsx-a11y') || rule.includes('accessibility')) {
        categories.accessibility.push(error);
      }
      // High priority
      else if (rule.includes('no-console') || rule.includes('no-debugger') || rule.includes('no-alert')) {
        categories.high.push(error);
      }
      // Style issues
      else if (rule.includes('quotes') || rule.includes('semi') || rule.includes('indent') || rule.includes('trailing-spaces')) {
        categories.style.push(error);
      }
      // Medium priority
      else if (rule.includes('prefer-const') || rule.includes('no-var') || rule.includes('eqeqeq')) {
        categories.medium.push(error);
      }
      // Low priority
      else {
        categories.low.push(error);
      }
    }

    return categories;
  }

  generateHTMLReport(errors, categories) {
    const timestamp = new Date().toISOString();
    const totalErrors = errors.length;
    const criticalCount = categories.critical.length;
    const highCount = categories.high.length;
    const mediumCount = categories.medium.length;
    const lowCount = categories.low.length;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lint Report - ${timestamp}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .metric {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .metric.critical { border-left: 4px solid #dc3545; }
        .metric.high { border-left: 4px solid #fd7e14; }
        .metric.medium { border-left: 4px solid #ffc107; }
        .metric.low { border-left: 4px solid #28a745; }
        .metric-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .metric-label {
            color: #666;
            font-size: 0.9em;
        }
        .section {
            padding: 30px;
            border-bottom: 1px solid #eee;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section h2 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .error-item {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }
        .error-file {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .error-details {
            color: #666;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .error-message {
            color: #dc3545;
            margin-top: 5px;
        }
        .timestamp {
            color: #999;
            font-size: 0.8em;
            text-align: center;
            padding: 20px;
        }
        .no-errors {
            text-align: center;
            color: #28a745;
            font-size: 1.2em;
            padding: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Lint Report</h1>
            <p>Generated on ${new Date(timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${criticalCount > 0 ? 'critical' : ''}">
                <div class="metric-number">${criticalCount}</div>
                <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric ${highCount > 0 ? 'high' : ''}">
                <div class="metric-number">${highCount}</div>
                <div class="metric-label">High Priority</div>
            </div>
            <div class="metric ${mediumCount > 0 ? 'medium' : ''}">
                <div class="metric-number">${mediumCount}</div>
                <div class="metric-label">Medium Priority</div>
            </div>
            <div class="metric ${lowCount > 0 ? 'low' : ''}">
                <div class="metric-number">${lowCount}</div>
                <div class="metric-label">Low Priority</div>
            </div>
        </div>

        ${totalErrors === 0 ? '<div class="no-errors">🎉 No linting issues found! Code is clean.</div>' : ''}

        ${categories.critical.length > 0 ? `
        <div class="section">
            <h2>🚨 Critical Issues (${categories.critical.length})</h2>
            ${categories.critical.map(error => `
                <div class="error-item">
                    <div class="error-file">${error.file}:${error.line}:${error.column}</div>
                    <div class="error-details">${error.rule}</div>
                    <div class="error-message">${error.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${categories.high.length > 0 ? `
        <div class="section">
            <h2>⚠️ High Priority Issues (${categories.high.length})</h2>
            ${categories.high.map(error => `
                <div class="error-item">
                    <div class="error-file">${error.file}:${error.line}:${error.column}</div>
                    <div class="error-details">${error.rule}</div>
                    <div class="error-message">${error.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${categories.medium.length > 0 ? `
        <div class="section">
            <h2>📝 Medium Priority Issues (${categories.medium.length})</h2>
            ${categories.medium.map(error => `
                <div class="error-item">
                    <div class="error-file">${error.file}:${error.line}:${error.column}</div>
                    <div class="error-details">${error.rule}</div>
                    <div class="error-message">${error.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${categories.low.length > 0 ? `
        <div class="section">
            <h2>💡 Low Priority Issues (${categories.low.length})</h2>
            ${categories.low.map(error => `
                <div class="error-item">
                    <div class="error-file">${error.file}:${error.line}:${error.column}</div>
                    <div class="error-details">${error.rule}</div>
                    <div class="error-message">${error.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="timestamp">
            Report generated by QMOI AI Lint Reporter
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  generateJSONReport(errors, categories) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: errors.length,
        critical: categories.critical.length,
        high: categories.high.length,
        medium: categories.medium.length,
        low: categories.low.length,
        style: categories.style.length,
        performance: categories.performance.length,
        security: categories.security.length,
        accessibility: categories.accessibility.length
      },
      errors: errors,
      categories: categories,
      recommendations: this.generateRecommendations(categories)
    };

    return report;
  }

  generateRecommendations(categories) {
    const recommendations = [];

    if (categories.critical.length > 0) {
      recommendations.push({
        priority: 'immediate',
        message: 'Critical issues detected that may cause runtime errors',
        actions: [
          'Fix undefined variables and imports',
          'Remove unused variables and imports',
          'Resolve module resolution issues'
        ]
      });
    }

    if (categories.security.length > 0) {
      recommendations.push({
        priority: 'high',
        message: 'Security vulnerabilities detected',
        actions: [
          'Remove eval() usage',
          'Sanitize user inputs',
          'Use secure alternatives for dangerous functions'
        ]
      });
    }

    if (categories.performance.length > 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Performance issues detected',
        actions: [
          'Remove console.log statements',
          'Remove debugger statements',
          'Optimize expensive operations'
        ]
      });
    }

    if (categories.style.length > 0) {
      recommendations.push({
        priority: 'low',
        message: 'Code style issues detected',
        actions: [
          'Run yarn lint:fix to auto-fix style issues',
          'Use consistent quote style',
          'Fix indentation and spacing'
        ]
      });
    }

    return recommendations;
  }

  async run() {
    this.log('🚀 Starting Lint Reporter...', 'info');

    // Run lint check
    const lintResult = await this.runLint();
    
    if (lintResult.success) {
      this.log('✅ No linting errors found!', 'success');
      
      // Generate clean report
      const cleanReport = this.generateJSONReport([], {});
      const htmlReport = this.generateHTMLReport([], {});
      
      writeFileSync(join(this.reportsDir, 'lint-report.json'), JSON.stringify(cleanReport, null, 2));
      writeFileSync(join(this.reportsDir, 'lint-report.html'), htmlReport);
      
      console.log('📊 Reports generated:');
      console.log(`   JSON: ${join(this.reportsDir, 'lint-report.json')}`);
      console.log(`   HTML: ${join(this.reportsDir, 'lint-report.html')}`);
      
      return;
    }

    // Parse and categorize errors
    const errors = this.parseErrors(lintResult.output);
    const categories = this.categorizeErrors(errors);
    
    this.log(`Found ${errors.length} linting issues`, 'info');

    // Generate reports
    const jsonReport = this.generateJSONReport(errors, categories);
    const htmlReport = this.generateHTMLReport(errors, categories);

    // Save reports
    writeFileSync(join(this.reportsDir, 'lint-report.json'), JSON.stringify(jsonReport, null, 2));
    writeFileSync(join(this.reportsDir, 'lint-report.html'), htmlReport);

    // Display summary
    console.log('\n📊 Lint Report Summary:');
    console.log(`   Total Issues: ${errors.length}`);
    console.log(`   Critical: ${categories.critical.length}`);
    console.log(`   High Priority: ${categories.high.length}`);
    console.log(`   Medium Priority: ${categories.medium.length}`);
    console.log(`   Low Priority: ${categories.low.length}`);

    if (categories.critical.length > 0) {
      console.log('\n🚨 Critical Issues:');
      categories.critical.slice(0, 3).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.file}:${error.line}:${error.column} - ${error.rule}`);
      });
      if (categories.critical.length > 3) {
        console.log(`   ... and ${categories.critical.length - 3} more`);
      }
    }

    console.log('\n📄 Reports saved to:');
    console.log(`   JSON: ${join(this.reportsDir, 'lint-report.json')}`);
    console.log(`   HTML: ${join(this.reportsDir, 'lint-report.html')}`);

    // Exit with appropriate code
    if (categories.critical.length > 0) {
      this.log('❌ Critical errors found. Please fix them before proceeding.', 'error');
      process.exit(1);
    } else if (categories.high.length > 0) {
      this.log('⚠️  High priority issues found. Consider fixing them soon.', 'warning');
      process.exit(2);
    } else {
      this.log('✅ Only minor issues found. Code is generally clean.', 'success');
      process.exit(0);
    }
  }
}

// Run the reporter
const reporter = new LintReporter();
reporter.run().catch(error => {
  console.error('Fatal error in lint reporter:', error);
  process.exit(1);
}); 