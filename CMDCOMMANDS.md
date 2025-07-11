# QMOI Command Reference - Enhanced GitLab Automation

## 🚀 Quick Start Commands

### Full QMOI Automation
```bash
# Complete QMOI automation pipeline
npm run qmoi:all

# Full setup, test, build, deploy, and push
npm run qmoi:full

# GitLab CI/CD pipeline
npm run qmoi:ci

# Comprehensive automation with all platforms
npm run qmoi:comprehensive
```

### Individual Automation Steps
```bash
# Setup and dependency management
npm run qmoi:setup

# Error fixing and recovery
npm run qmoi:fix

# Testing (all test suites)
npm run qmoi:test

# Building and optimization
npm run qmoi:build

# GitLab deployment
npm run qmoi:deploy

# Health checks and monitoring
npm run qmoi:health

# Error recovery
npm run qmoi:recovery
```

## 🔧 GitLab Automation Commands

### GitLab Pipeline Automation
```bash
# Full GitLab automation pipeline
npm run gitlab:full-pipeline

# GitLab push automation
npm run gitlab:push-pipeline

# GitLab deployment only
npm run gitlab:deploy

# GitLab notifications only
npm run gitlab:notify

# GitLab error recovery
npm run gitlab:recovery

# GitLab health checks
npm run gitlab:health

# GitLab auto-fix
npm run gitlab:fix
```

### GitLab Push Operations
```bash
# Full push pipeline (commit, push, merge request, tag)
npm run gitlab:push

# Create merge request
npm run gitlab:merge-request

# Create release tag
npm run gitlab:tag-release

# Commit changes only
npm run gitlab:commit

# Push changes only
npm run gitlab:push-only
```

## 🐳 Gitpod Integration Commands

### Gitpod Notifications
```bash
# Gitpod notification service
npm run gitpod:notify

# Workspace notifications
npm run gitpod:workspace-started
npm run gitpod:workspace-stopped
npm run gitpod:workspace-cloned
npm run gitpod:workspace-synced
npm run gitpod:workspace-error

# QMOI integration with Gitpod
npm run gitpod:qmoi-integration

# Monitor Gitpod workspaces
npm run gitpod:monitor
```

### Gitpod Workspace Management
```bash
# Start new Gitpod workspace
npm run gitpod:start

# Stop Gitpod workspace
npm run gitpod:stop

# Clone Gitpod workspace
npm run gitpod:clone

# Sync Gitpod workspace
npm run gitpod:sync
```

### QMOI Gitpod Integration
```bash
# Full QMOI Gitpod integration
npm run qmoi:gitpod

# This command runs:
# 1. Monitor Gitpod workspaces
# 2. Send QMOI integration notifications
# 3. Track workspace status
# 4. Manage workspace lifecycle
```

## 🔧 JSON Configuration Fixing

### JSON File Fixing
```bash
# Fix all JSON files
npm run json:fix-all

# Fix specific configuration files
npm run json:fix-package
npm run json:fix-tsconfig
npm run json:fix-jest
npm run json:fix-eslint

# Validate JSON files
npm run json:validate
```

### QMOI JSON Fixing
```bash
# QMOI JSON configuration fixing
npm run qmoi:json-fix

# This command:
# 1. Fixes all JSON files in the project
# 2. Validates JSON syntax
# 3. Fixes common JSON errors
# 4. Updates configuration files
# 5. Ensures proper formatting
```

## 🔄 GitHub Fallback System

### GitHub Fallback Commands
```bash
# GitHub fallback pipeline
npm run github:fallback

# GitHub sync operations
npm run github:sync-to
npm run github:sync-from

# GitHub setup
npm run github:setup

# Platform monitoring
npm run github:monitor
npm run github:check-gitlab
npm run github:check-github

# GitHub notifications
npm run github:notify
```

### QMOI GitHub Fallback
```bash
# QMOI GitHub fallback system
npm run qmoi:github-fallback

# Platform monitoring
npm run qmoi:platform-monitor

# This command:
# 1. Checks GitLab availability
# 2. Falls back to GitHub if needed
# 3. Syncs code between platforms
# 4. Sends notifications
# 5. Monitors platform status
```

## 🧪 Testing Commands

### Comprehensive Testing
```bash
# All tests (unit, UI, E2E)
npm run qmoi:test

# Unit tests with coverage
npm test

# UI tests (Playwright)
npm run test:ui

# E2E tests (Cypress)
npm run test:e2e

# Test coverage report
npm run test:coverage

# Performance tests
npm run test:performance

# Debug tests
npm run test:debug
```

### Individual Test Commands
```bash
# Jest tests
npm test -- --watchAll=false --coverage

# Playwright tests
npx playwright test

# Cypress tests
npx cypress run

# Test with specific patterns
npm test -- --testNamePattern="component name"
```

## 🏗️ Build Commands

### Build Operations
```bash
# Development build
npm run build

# Production build with optimization
npm run build:prod

# Build optimization
npm run build:optimize
```

### Build Scripts
```bash
# Build optimizer
node scripts/build-optimizer.js

# Build with specific configurations
npm run build -- --mode production
```

## 🔍 Quality Assurance Commands

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatting
npm run format
npm run format:check
```

### Security and Performance
```bash
# Security scan
npm run security:scan

# Performance tests
npm run test:performance

# Lighthouse tests
npm run lighthouse:test
```

## 🛠️ Maintenance Commands

### Setup and Health
```bash
# Auto setup
npm run auto:setup
npm run auto:fix

# Health checks
npm run health:check

# Cleanup
npm run cleanup
```

### Documentation
```bash
# Generate documentation
npm run docs:generate

# Deploy documentation
npm run docs:deploy
```

## 🚨 Error Recovery Commands

### Automatic Error Recovery
```bash
# Full error recovery
npm run qmoi:recovery

# GitLab error recovery
npm run gitlab:recovery

# Direct error recovery script
node scripts/gitlab-error-recovery.js --full-recovery
```

### Specific Error Fixes
```bash
# NPM issues
node scripts/gitlab-error-recovery.js --fix-npm

# Build issues
node scripts/gitlab-error-recovery.js --fix-build

# Test issues
node scripts/gitlab-error-recovery.js --fix-tests

# Git issues
node scripts/gitlab-error-recovery.js --fix-git

# Environment issues
node scripts/gitlab-error-recovery.js --fix-env

# Script issues
node scripts/gitlab-error-recovery.js --fix-scripts

# Configuration issues
node scripts/gitlab-error-recovery.js --fix-config
```

## 📊 Monitoring and Notifications

### GitLab Notifications
```bash
# Pipeline notifications
node scripts/gitlab-notification-service.js --pipeline-started
node scripts/gitlab-notification-service.js --pipeline-success
node scripts/gitlab-notification-service.js --pipeline-failed

# Error notifications
node scripts/gitlab-notification-service.js --error

# Success notifications
node scripts/gitlab-notification-service.js --success
```

### Gitpod Notifications
```bash
# Workspace notifications
node scripts/gitpod-notification-service.js --workspace-started
node scripts/gitpod-notification-service.js --workspace-stopped
node scripts/gitpod-notification-service.js --workspace-cloned
node scripts/gitpod-notification-service.js --workspace-synced
node scripts/gitpod-notification-service.js --workspace-error

# QMOI integration notifications
node scripts/gitpod-notification-service.js --qmoi-integration

# Monitor workspaces
node scripts/gitpod-notification-service.js --monitor-workspaces
```

### GitHub Notifications
```bash
# GitHub fallback notifications
node scripts/github-fallback.js --notify

# Platform monitoring
node scripts/github-fallback.js --monitor-platforms
```

### Health Monitoring
```bash
# Health check
npm run health:check

# GitLab health check
npm run gitlab:health

# Comprehensive health monitoring
npm run qmoi:health

# Platform monitoring
npm run qmoi:platform-monitor
```

## 🔧 Development Commands

### Development Workflow
```bash
# Start development server
npm start

# Watch tests
npm run test:watch

# Eject (if needed)
npm run eject
```

### Debugging
```bash
# Debug tests
npm run test:debug

# Debug build
npm run build -- --debug

# Debug automation
node scripts/gitlab-automation.js --debug
```

## 🌐 Platform-Specific Commands

### Vercel Integration
```bash
# Vercel auto-fix
npm run vercel:auto-fix

# Vercel build
npm run vercel-build
```

### GitLab CI/CD
```bash
# GitLab CI pipeline
npm run qmoi:ci

# GitLab automation
npm run gitlab:automation

# GitLab push
npm run gitlab:push
```

### Gitpod Integration
```bash
# Gitpod workspace management
npm run gitpod:start
npm run gitpod:stop
npm run gitpod:clone
npm run gitpod:sync

# Gitpod monitoring
npm run gitpod:monitor
```

### GitHub Fallback
```bash
# GitHub fallback system
npm run github:fallback

# GitHub sync
npm run github:sync-to
npm run github:sync-from

# Platform monitoring
npm run github:monitor
```

## 📋 Environment Setup

### Required Environment Variables
```bash
# GitLab Configuration
export GITLAB_TOKEN="your-gitlab-token"
export GITLAB_PROJECT_ID="your-project-id"
export GITLAB_URL="https://gitlab.com"

# GitHub Configuration
export GITHUB_TOKEN="your-github-token"
export GITHUB_REPOSITORY="username/repository"

# Gitpod Configuration
export GITPOD_API_TOKEN="your-gitpod-token"
export GITPOD_URL="https://api.gitpod.io/v1"

# CI/CD Variables
export CI_COMMIT_REF_NAME="main"
export CI_COMMIT_SHA="commit-hash"
export CI_JOB_ID="job-id"
export CI_PIPELINE_ID="pipeline-id"

# QMOI Configuration
export QMOI_AUTO_FIX="true"
export QMOI_NOTIFICATIONS="true"
export QMOI_ERROR_RECOVERY="true"
```

### PowerShell Commands (Windows)
```powershell
# Set environment variables
$env:GITLAB_TOKEN="your-gitlab-token"
$env:GITLAB_PROJECT_ID="your-project-id"
$env:GITHUB_TOKEN="your-github-token"
$env:GITPOD_API_TOKEN="your-gitpod-token"

# Run QMOI commands
npm run qmoi:all
npm run qmoi:comprehensive
npm run gitlab:full-pipeline
npm run qmoi:gitpod
npm run qmoi:github-fallback
```

## 🚀 Advanced Automation

### Complete Automation Pipeline
```bash
# Full QMOI automation with all platforms
npm run qmoi:comprehensive

# This command runs:
# 1. Auto setup and dependency management
# 2. All tests (unit, UI, E2E)
# 3. Build and optimization
# 4. GitLab deployment
# 5. GitLab notifications
# 6. Git push automation
# 7. Merge request creation
# 8. Release tagging
# 9. Gitpod integration
# 10. JSON configuration fixing
# 11. GitHub fallback monitoring
# 12. Platform health monitoring
```

### Error Recovery Pipeline
```bash
# Automatic error recovery
npm run qmoi:recovery

# This command:
# 1. Diagnoses current issues
# 2. Fixes NPM problems
# 3. Fixes build issues
# 4. Fixes test problems
# 5. Fixes Git issues
# 6. Fixes environment issues
# 7. Fixes script problems
# 8. Fixes configuration issues
# 9. Fixes JSON files
# 10. Runs health checks
# 11. Sends notifications
```

### Platform Integration Pipeline
```bash
# QMOI platform integration
npm run qmoi:gitpod && npm run qmoi:github-fallback

# This command:
# 1. Monitors Gitpod workspaces
# 2. Sends Gitpod notifications
# 3. Checks platform availability
# 4. Syncs between GitLab and GitHub
# 5. Sends platform notifications
# 6. Monitors platform health
```

## 📝 Troubleshooting

### Common Issues and Solutions

#### NPM Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Build Issues
```bash
# Clear build cache
rm -rf build/ dist/
npm run build
```

#### Test Issues
```bash
# Clear test cache
rm -rf coverage/ test-results/
npm test
```

#### Git Issues
```bash
# Configure Git
git config --global user.name "QMOI Automation"
git config --global user.email "qmoi-automation@gitlab.com"
```

#### Environment Issues
```bash
# Check Node.js version
node --version

# Check NPM version
npm --version

# Set environment variables
export NODE_ENV=production
export CI=true
```

#### JSON Configuration Issues
```bash
# Fix all JSON files
npm run json:fix-all

# Fix specific configuration
npm run json:fix-package
npm run json:fix-tsconfig
```

#### Platform Issues
```bash
# Check platform availability
npm run github:check-gitlab
npm run github:check-github

# Monitor platforms
npm run qmoi:platform-monitor
```

## 🔄 Continuous Integration

### GitLab CI/CD Pipeline Stages
1. **Setup**: Initialize environment and install dependencies
2. **Validate**: Run linting, type checking, and formatting
3. **Test**: Execute all test suites with coverage
4. **Build**: Create production build with optimization
5. **Deploy**: Deploy to GitLab with notifications
6. **Notify**: Send comprehensive notifications
7. **Gitpod**: Integrate with Gitpod workspaces
8. **GitHub**: Sync with GitHub fallback
9. **Monitor**: Monitor all platforms

### Pipeline Jobs
- `setup`: Environment initialization
- `auto-fix`: Automatic error fixing
- `validate`: Code quality checks
- `test`: Comprehensive testing
- `build`: Production build
- `deploy`: GitLab deployment
- `notify`: Notification system
- `qmoi-full-automation`: Complete automation
- `error-recovery`: Error recovery
- `health-check`: Health monitoring
- `docs-update`: Documentation updates
- `security-scan`: Security scanning
- `performance-test`: Performance testing
- `cleanup`: Cleanup operations
- `gitpod-integration`: Gitpod integration
- `github-fallback`: GitHub fallback
- `platform-monitor`: Platform monitoring

## 📊 Monitoring and Analytics

### Health Monitoring
```bash
# Comprehensive health check
npm run qmoi:health

# GitLab health check
npm run gitlab:health

# Platform monitoring
npm run qmoi:platform-monitor

# System diagnostics
node scripts/gitlab-error-recovery.js --diagnose
```

### Performance Monitoring
```bash
# Performance tests
npm run test:performance

# Lighthouse tests
npm run lighthouse:test

# Build optimization
npm run build:optimize
```

### Platform Monitoring
```bash
# Monitor all platforms
npm run qmoi:platform-monitor

# Check specific platforms
npm run github:check-gitlab
npm run github:check-github
npm run gitpod:monitor
```

## 🎯 Best Practices

### Command Execution Order
1. Always run `npm run qmoi:setup` first
2. Use `npm run qmoi:test` to verify functionality
3. Run `npm run qmoi:build` before deployment
4. Use `npm run qmoi:deploy` for GitLab deployment
5. Monitor with `npm run qmoi:health`
6. Integrate platforms with `npm run qmoi:gitpod`
7. Monitor fallbacks with `npm run qmoi:github-fallback`

### Error Handling
1. Use `npm run qmoi:recovery` for automatic error fixing
2. Check logs in `logs/` directory
3. Review GitLab issues for specific problems
4. Use `npm run gitlab:notify` for error notifications
5. Fix JSON issues with `npm run qmoi:json-fix`
6. Monitor platforms with `npm run qmoi:platform-monitor`

### Automation Workflow
1. `npm run qmoi:comprehensive` for complete automation
2. `npm run gitlab:full-pipeline` for GitLab CI/CD
3. `npm run qmoi:push` for Git operations
4. `npm run qmoi:gitpod` for Gitpod integration
5. `npm run qmoi:github-fallback` for GitHub fallback
6. Monitor results and notifications

### Platform Integration
1. Monitor GitLab availability
2. Integrate with Gitpod workspaces
3. Use GitHub as fallback
4. Sync code between platforms
5. Send notifications to all platforms
6. Monitor platform health

---

## 📞 Support and Documentation

For additional support:
- Check the logs in `logs/` directory
- Review GitLab issues and merge requests
- Consult the main documentation files
- Use the health check commands for diagnostics
- Monitor platform status with `npm run qmoi:platform-monitor`
- Fix JSON issues with `npm run qmoi:json-fix`

**Generated by QMOI Automation System** 