# 🤖 QMOI AI Automated Linting System

## Overview

The QMOI AI Automated Linting System is a comprehensive solution that automatically detects, fixes, and reports linting errors in your codebase. It eliminates the need for manual linting and provides intelligent error categorization and notifications.

## 🚀 Quick Start

### Basic Usage

```bash
# Run the complete automated linting process
yarn lint:full

# Or run individual components
yarn lint:auto    # Auto-fix and categorize errors
yarn lint:notify  # Get notifications about remaining errors
```

### Available Commands

| Command | Description |
|---------|-------------|
| `yarn lint:auto` | Runs complete auto-linting with smart fixes |
| `yarn lint:watch` | Watches files for changes and auto-lints |
| `yarn lint:smart` | Applies intelligent fixes for complex errors |
| `yarn lint:report` | Generates detailed HTML and JSON reports |
| `yarn lint:notify` | Sends notifications about errors |
| `yarn lint:full` | Runs auto-lint + notifications |

## 🔧 How It Works

### 1. Auto-Lint Process (`yarn lint:auto`)

The auto-lint process follows these steps:

1. **Initial Scan**: Runs ESLint to detect all errors
2. **Auto-Fix**: Applies ESLint's built-in fixes
3. **Smart Fixes**: Applies intelligent fixes for complex issues
4. **Error Categorization**: Groups errors by priority and fixability
5. **Report Generation**: Creates detailed reports and logs

### 2. Smart Linting (`yarn lint:smart`)

The smart linter can automatically fix:

- **Unused Imports**: Removes unused import statements
- **Missing Semicolons**: Adds missing semicolons where appropriate
- **Quote Standardization**: Converts quotes to consistent style
- **Trailing Spaces**: Removes trailing whitespace
- **End-of-Line**: Ensures files end with newline
- **Indentation**: Fixes indentation issues

### 3. File Watching (`yarn lint:watch`)

The file watcher:
- Monitors all `.ts`, `.tsx`, `.js`, `.jsx` files
- Automatically runs linting when files change
- Debounces multiple changes to avoid excessive runs
- Ignores `node_modules`, `.git`, and other build directories

### 4. Error Reporting (`yarn lint:report`)

Generates comprehensive reports:
- **HTML Report**: Beautiful, interactive report with error details
- **JSON Report**: Machine-readable error data
- **Error Categorization**: Groups errors by severity and type
- **Recommendations**: Provides actionable next steps

### 5. Notifications (`yarn lint:notify`)

Sends notifications for:
- **Desktop Notifications**: System notifications on Windows/macOS/Linux
- **WhatsApp Notifications**: Critical errors sent via WhatsApp bot
- **Console Output**: Detailed error summaries in terminal

## 📊 Error Categories

### Critical Errors
- `no-undef`: Undefined variables
- `import/no-unresolved`: Missing imports
- `no-unused-vars`: Unused variables

### High Priority
- `no-console`: Console statements
- `no-debugger`: Debugger statements
- `no-alert`: Alert statements

### Medium Priority
- `prefer-const`: Should use const instead of let
- `no-var`: Should use let/const instead of var
- `eqeqeq`: Should use strict equality

### Low Priority
- `quotes`: Quote style consistency
- `semi`: Semicolon usage
- `indent`: Indentation issues
- `trailing-spaces`: Trailing whitespace

## 📁 Generated Files

The system creates several files in the `logs/` and `reports/` directories:

```
logs/
├── auto-lint.log          # Auto-lint execution logs
├── lint-errors.json       # Current error state
├── lint-watcher.log       # File watcher logs
├── smart-lint.log         # Smart lint execution logs
└── lint-reporter.log      # Report generation logs

reports/
├── lint-report.json       # Detailed JSON report
└── lint-report.html       # Interactive HTML report
```

## 🔔 Notification System

### Desktop Notifications
- **Windows**: Uses PowerShell BurntToast
- **macOS**: Uses osascript
- **Linux**: Uses notify-send

### WhatsApp Integration
- Sends critical error notifications via WhatsApp bot
- Requires WhatsApp bot to be configured and running
- Only sends notifications for critical errors

## 🛠️ Configuration

### ESLint Configuration
The system uses your existing `eslint.config.js` configuration. Make sure it includes:

```javascript
// Example ESLint rules for better auto-fixing
rules: {
  '@typescript-eslint/no-unused-vars': 'warn',
  'no-console': 'warn',
  'prefer-const': 'warn',
  'no-var': 'warn',
  'eqeqeq': 'warn',
  'quotes': ['warn', 'single'],
  'semi': ['warn', 'always'],
  'no-trailing-spaces': 'warn',
  'eol-last': 'warn'
}
```

### Customization
You can customize the behavior by modifying the scripts:

- **Auto-lint**: `scripts/auto-lint.js`
- **Smart lint**: `scripts/smart-lint.js`
- **File watcher**: `scripts/lint-watcher.js`
- **Reporter**: `scripts/lint-reporter.js`
- **Notifier**: `scripts/lint-notifier.js`

## 🚨 Exit Codes

The system uses different exit codes to indicate status:

- **0**: Success - All errors fixed or only minor issues
- **1**: Critical errors found - Requires immediate attention
- **2**: Unfixable errors - Manual intervention needed

## 📈 Performance

### Optimization Features
- **Debounced File Watching**: Prevents excessive linting runs
- **Incremental Processing**: Only processes changed files
- **Parallel Processing**: Runs multiple fix strategies concurrently
- **Caching**: Caches error results to avoid redundant work

### Monitoring
- **Execution Time**: Logs time taken for each operation
- **Memory Usage**: Monitors memory consumption
- **File Count**: Tracks number of files processed
- **Error Trends**: Shows error patterns over time

## 🔧 Troubleshooting

### Common Issues

1. **Scripts not found**
   ```bash
   # Make sure scripts are executable
   chmod +x scripts/*.js
   ```

2. **Permission errors**
   ```bash
   # Run with appropriate permissions
   sudo yarn lint:auto
   ```

3. **WhatsApp notifications not working**
   - Ensure WhatsApp bot is running
   - Check bot configuration
   - Verify phone number is registered

4. **Desktop notifications not showing**
   - Check system notification settings
   - Install required dependencies (notify-send on Linux)
   - Verify PowerShell execution policy on Windows

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=true yarn lint:auto
```

## 🤝 Integration

### CI/CD Integration
Add to your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Run Auto Lint
  run: yarn lint:auto

- name: Check for Critical Errors
  run: |
    if [ $? -eq 1 ]; then
      echo "Critical linting errors found!"
      exit 1
    fi
```

### Pre-commit Hooks
Add to your pre-commit configuration:

```json
{
  "hooks": {
    "pre-commit": "yarn lint:auto"
  }
}
```

### IDE Integration
Configure your IDE to run auto-lint on save:

```json
// VS Code settings.json
{
  "emmet.triggerExpansionOnTab": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📚 Advanced Usage

### Custom Fix Strategies
Add your own fix strategies to `scripts/smart-lint.js`:

```javascript
fixCustomRule(filePath, errors) {
  // Your custom fix logic here
  const customErrors = errors.filter(e => e.rule.includes('custom-rule'));
  
  if (customErrors.length > 0) {
    // Apply fixes
    return this.applyCustomFixes(filePath, customErrors);
  }
  
  return false;
}
```

### Custom Notifications
Extend the notification system in `scripts/lint-notifier.js`:

```javascript
async sendCustomNotification(message) {
  // Send to your preferred notification service
  // Slack, Discord, Email, etc.
}
```

### Custom Reports
Modify the report generation in `scripts/lint-reporter.js`:

```javascript
generateCustomReport(errors, categories) {
  // Generate custom report format
  // PDF, CSV, XML, etc.
}
```

## 🎯 Best Practices

1. **Run Regularly**: Use `yarn lint:watch` during development
2. **Review Reports**: Check HTML reports for detailed analysis
3. **Fix Critical First**: Address critical errors immediately
4. **Monitor Trends**: Track error patterns over time
5. **Customize Rules**: Adjust ESLint rules for your project needs

## 🔮 Future Enhancements

Planned features:
- **AI-Powered Fixes**: Machine learning-based error resolution
- **Team Collaboration**: Share error reports with team members
- **Performance Analytics**: Track linting performance over time
- **Custom Rule Engine**: Create project-specific fix strategies
- **Integration APIs**: Connect with external tools and services

## New Master-Only Automation Features

- Master-only verification and management for WhatsApp, Airtel Money, and Mpesa accounts.
- Automated WhatsApp Business connection and notification system.
- All sensitive actions and transactions require master approval.
- Secure, auditable logs for all verification and transaction events.
- UI panels for financial and WhatsApp management are visible only to the master user.

(See QMOI-AI-ENHANCEMENT.md for full details.)

## AI-Driven Lint & Error Fixing Automation

- Lint errors are automatically detected and fixed by the AI error fixer during CI/CD.
- If linting fails, the error fixer attempts to resolve issues and re-run linting.
- All lint and error fixing events are logged and auditable.

## Linting, Compliance, and Audit Logging
- Linting, compliance, and error checks run before every deploy.
- All actions are logged and auditable.
- Integrated with QMOI Auto-Dev and master-only audit logging.

---

*The QMOI AI Automated Linting System is designed to make code quality management effortless and intelligent.* 