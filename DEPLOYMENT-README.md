# QMOI Enhanced Auto-Deploy System

## Overview

The QMOI Enhanced Auto-Deploy System is a comprehensive deployment solution that automatically handles build, test, and deployment processes with intelligent error detection and auto-fixing capabilities.

## Features

- 🤖 **AI-Powered Error Detection**: Automatically identifies and fixes common deployment issues
- 🔄 **Multi-Strategy Deployment**: Multiple fallback strategies for Vercel deployment
- 🏥 **Health Monitoring**: Continuous monitoring of deployment health
- 🔧 **Auto-Fix Capabilities**: Automatically fixes build, test, and deployment errors
- 📊 **Comprehensive Logging**: Detailed logs for debugging and monitoring
- 🔔 **Multi-Channel Notifications**: WhatsApp, Slack, Discord, and email notifications

## Quick Start

### 1. Environment Setup

Ensure you have the following environment variables set:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# GitHub Actions Secrets
GITHUB_TOKEN=your_github_token
VERCEL_DEPLOY_URL=your_deployment_url
```

### 2. Manual Deployment

```bash
# Health check
npm run deploy:health

# Auto-fix issues
npm run deploy:fix

# Deploy to Vercel
npm run deploy:vercel

# Full deployment with monitoring
npm run deploy:monitor
```

### 3. GitHub Actions

The system includes enhanced GitHub Actions workflows:

- **`.github/workflows/auto-deploy.yml`**: Main deployment workflow
- **`.github/workflows/qmoi-autodev.yml`**: Auto-development workflow

## Deployment Scripts

### Health Check Script (`scripts/deploy/health-check.js`)

Comprehensive health monitoring for your deployment:

```bash
# Run full health check
node scripts/deploy/health-check.js check

# Apply auto-fixes
node scripts/deploy/health-check.js fix

# Check only Vercel deployment
node scripts/deploy/health-check.js vercel
```

**Health Check Areas:**
- ✅ Vercel deployment status
- ✅ Build directory integrity
- ✅ Environment configuration
- ✅ Dependencies validation

### Enhanced Error Fix Script (`scripts/enhanced-error-fix.js`)

AI-powered error detection and fixing:

```bash
# Fix specific error types
node scripts/enhanced-error-fix.js --type=build
node scripts/enhanced-error-fix.js --type=vercel
node scripts/enhanced-error-fix.js --type=test
node scripts/enhanced-error-fix.js --type=lint

# Comprehensive fix
node scripts/enhanced-error-fix.js --type=comprehensive
```

**Error Types Supported:**
- `build`: Build process errors
- `vercel`: Vercel deployment errors
- `test`: Test failures
- `lint`: Linting issues
- `license`: License compliance issues

### Vercel Auto-Deploy Script (`scripts/deploy/vercel_auto_deploy.js`)

Enhanced Vercel deployment with retry logic:

```bash
node scripts/deploy/vercel_auto_deploy.js
```

**Features:**
- 🔄 Automatic retry with exponential backoff
- 🧹 Cache clearing and cleanup
- 🔧 Multiple deployment strategies
- 📊 Health monitoring and rollback

## Configuration Files

### Vercel Configuration (`vercel.json`)

Enhanced Vercel configuration with:

```json
{
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
  }
}
```

### Environment Configuration

Create a `.env` file with:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
QMOI_AUTODEV_ENABLED=true
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Symptoms:**
- Build directory missing or empty
- TypeScript compilation errors
- Missing dependencies

**Solutions:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm ci --legacy-peer-deps

# Run auto-fix
npm run deploy:fix
```

#### 2. Vercel Deployment Failures

**Symptoms:**
- Deployment timeout
- Build errors on Vercel
- Environment variable issues

**Solutions:**
```bash
# Clear Vercel cache
npx vercel --clear-cache

# Force redeploy
npx vercel --prod --yes --force

# Check deployment status
npm run deploy:health
```

#### 3. Environment Issues

**Symptoms:**
- Missing environment variables
- Configuration errors

**Solutions:**
```bash
# Validate environment
node scripts/deploy/health-check.js check

# Auto-fix environment
npm run deploy:fix
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=true

# Run with verbose output
npm run deploy:vercel -- --debug
```

### Log Files

Check logs for detailed information:

```bash
# Deployment logs
tail -f logs/vercel_auto_deploy.log

# Health check logs
tail -f logs/deployment-health.log

# Error fix logs
tail -f logs/ai_error_fix.log
```

## Monitoring and Alerts

### Health Monitoring

The system provides continuous health monitoring:

```bash
# Start monitoring
node scripts/deploy/health-check.js check

# Monitor deployment status
npm run deploy:health
```

### Notification Channels

Configure notifications in `test_config.json`:

```json
{
  "notifications": {
    "slack": {
      "enabled": true,
      "webhook_url": "your_slack_webhook"
    },
    "email": {
      "enabled": true,
      "smtp_server": "smtp.gmail.com",
      "sender_email": "your_email@gmail.com",
      "sender_password": "your_password",
      "recipient_emails": ["admin@example.com"]
    }
  }
}
```

## Best Practices

### 1. Pre-Deployment Checklist

- [ ] Run health check: `npm run deploy:health`
- [ ] Fix any issues: `npm run deploy:fix`
- [ ] Test locally: `npm run build && npm start`
- [ ] Verify environment variables

### 2. Deployment Process

1. **Pre-deploy**: Health check and auto-fix
2. **Build**: Enhanced build with error handling
3. **Deploy**: Multi-strategy Vercel deployment
4. **Verify**: Health check and monitoring
5. **Notify**: Multi-channel status notifications

### 3. Post-Deployment

- Monitor deployment health
- Check application functionality
- Review logs for any issues
- Set up continuous monitoring

## Advanced Configuration

### Custom Build Commands

Modify `package.json` scripts:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "vercel-build": "react-scripts build",
    "postbuild": "echo 'Build completed successfully'"
  }
}
```

### Environment-Specific Configurations

Create environment-specific files:

```bash
# Development
.env.development

# Production
.env.production

# Staging
.env.staging
```

### Custom Error Fixes

Extend the error fixing system:

```javascript
// Add custom fix strategies
async function customFixStrategy(error) {
  // Your custom fix logic
}
```

## Support

For issues and questions:

1. Check the logs: `logs/` directory
2. Run health check: `npm run deploy:health`
3. Review this documentation
4. Check GitHub Actions logs

## Contributing

To enhance the deployment system:

1. Follow the existing code structure
2. Add comprehensive logging
3. Include error handling
4. Update this documentation
5. Test thoroughly before deployment

---

**QMOI Enhanced Auto-Deploy System** - Always running, always fixing, always deploying! 🚀 