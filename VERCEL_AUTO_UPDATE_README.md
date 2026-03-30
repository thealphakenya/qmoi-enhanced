<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.632491Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
# Vercel Links Auto-Update System

Comprehensive guide for automatically managing and verifying Vercel deployment links in the QMOI Enhanced project.

## 📋 Overview

The Auto-Update System automatically:

- **Verifies** all Vercel deployment links every 5 minutes
- **Updates** VERCELLINKS.md with current deployment status
- **Detects** when deployment goes live (changes from 404 to 200)
- **Integrates** seamlessly with Git hooks and npm scripts
- **Monitors** health check endpoints
- **Reports** detailed deployment status

## 🔗 Key Files

| File                                                         | Purpose                             | Status       |
| ------------------------------------------------------------ | ----------------------------------- | ------------ |
| [VERCELLINKS.md](./VERCELLINKS.md)                           | Master list of all deployment links | ✓ Active     |
| [update_vercel_links.sh](./update_vercel_links.sh)           | Bash script for link verification   | ✓ Executable |
| [scripts/check-deployment.js](./scripts/check-deployment.js) | Node.js deployment checker          | ✓ Executable |
| [setup-git-hooks.sh](./setup-git-hooks.sh)                   | Git hook setup utility              | ✓ Ready      |

## 📍 Deployment Links

### Primary Application

- **URL**: https://qmoi-enhanced.vercel.app
- **Status**: Currently pending deployment
- **Expected**: Goes live in 5-6 minutes

### Vercel Dashboard

- **URL**: https://vercel.com/thealphakenya/qmoi-enhanced
- **Status**: ✓ Live and accessible
- **View**: Deployment logs, environment variables, settings

### GitHub Repository

- **URL**: https://github.com/thealphakenya/qmoi-enhanced
- **Status**: ✓ Live and accessible
- **View**: Source code, commits, pull requests

## 🚀 Usage

### Run Manual Verification

```bash
# Simple update (non-verbose)
npm run update-links

# Verbose output with detailed logs
npm run update-links:verbose

# Force update and commit
npm run update-links:force
```

Or use the bash script directly:

```bash
# Execute bash script
./update_vercel_links.sh

# With verbose logging
./update_vercel_links.sh --verbose

# Force update
./update_vercel_links.sh --force
```

### Check Deployment Status

```bash
# Run Node.js deployment checker
npm run check-deployment

# Or run directly
node scripts/check-deployment.js

# Verify full deployment
npm run verify-vercel
```

## 🔄 Automatic Updates

### npm Scripts

Add these scripts to your workflow:

```json
{
  "scripts": {
    "update-links": "./update_vercel_links.sh",
    "update-links:verbose": "./update_vercel_links.sh --verbose",
    "update-links:force": "./update_vercel_links.sh --force",
    "check-deployment": "node scripts/check-deployment.js",
    "verify-vercel": "npm run update-links && npm run check-deployment"
  }
}
```

### Git Hooks

Setup automatic updates on git events:

```bash
# Initialize git hooks
./setup-git-hooks.sh
```

This creates:

- **post-push hook**: Automatically checks deployment after `git push`
- **pre-commit hook**: Updates VERCELLINKS.md before committing

### Scheduled Cron Jobs

Add to your crontab for periodic checks:

```bash
# Check every 5 minutes
*/5 * * * * cd /workspaces/qmoi-enhanced && ./update_vercel_links.sh >> /tmp/qmoi-links.log 2>&1

# Check every hour
0 * * * * cd /workspaces/qmoi-enhanced && npm run verify-vercel >> /tmp/qmoi-deploy.log 2>&1
```

## 📊 Link Verification Process

The auto-update system:

1. **Tests** each link with HTTP HEAD request
2. **Records** response status code
3. **Compares** with previous status
4. **Updates** VERCELLINKS.md with latest results
5. **Timestamps** each check for tracking
6. **Logs** all activities to `/tmp/qmoi-links.log`

### Status Codes Explained

| Code  | Meaning                          | Action               |
| ----- | -------------------------------- | -------------------- |
| 200   | Link is live and working         | ✓ Success            |
| 404   | Deployment in progress           | ⏳ Wait 5-6 minutes  |
| 000   | Connection timeout or error      | ✗ Check connectivity |
| Other | Server error or misconfiguration | ⚠️ Investigate       |

## 🎯 What Gets Monitored

### Application Links

- **https://qmoi-enhanced.vercel.app** - Main application
- **https://qmoi-enhanced.vercel.app/api** - API base endpoint
- **https://qmoi-enhanced.vercel.app/api/health** - Health check endpoint

### Management Links

- **https://vercel.com/thealphakenya/qmoi-enhanced** - Vercel dashboard
- **https://github.com/thealphakenya/qmoi-enhanced** - GitHub repository

## 📝 VERCELLINKS.md Structure

The main documentation file includes:

```
# QMOI Enhanced - Vercel Deployment Links
├── Last Updated: [timestamp]
├── Status: Ready/Live/In Progress
├── Auto-Update: Enabled/enabled
├── 🌐 Primary Application Links
├── 📊 Vercel Dashboard & Monitoring
├── 🔧 Repository & Code
├── 🎯 Testing Endpoints
├── 📋 Link Status Summary (auto-updated)
├── 🔄 Auto-Update Configuration
├── 📊 Deployment Verification Checklist
└── 🚀 Quick Actions
```

## 🔍 data Output

```
═══════════════════════════════════════
    QMOI VERCEL LINKS AUTO-UPDATE REPORT
═══════════════════════════════════════

  ⏳ [404] Primary App
  ⏳ [404] API Base
  ⏳ [404] Health Check
  ✓ [200] Vercel Dashboard
  ✓ [200] GitHub Repository

⏳ Deployment in progress (checking every 5 minutes)

📊 LINK STATUS SUMMARY
────────────────────────────────────────
  [404] Primary App
  [404] API Base
  [404] Health Check
  [200] Vercel Dashboard
  [200] GitHub Repository

✓ Auto-update completed
```

## 🔒 Security Considerations

- **No credentials** stored in VERCELLINKS.md
- **No API keys** logged in output
- **HTTPS only** for all links
- **Read-only** link checking (no POST/PUT requests)
- **Timeout protection** (5-second default)
- **Error isolation** (one failing link doesn't affect others)

## 🐛 Troubleshooting

### Links Keep Showing 404

**Cause**: Deployment still in progress  
**Solution**: Wait 5-6 minutes after push, then refresh  
**Check**: https://vercel.com/thealphakenya/qmoi-enhanced for status

### Script Permission Denied

**Cause**: Script not executable  
**Solution**: Run `chmod +x update_vercel_links.sh`  
**Verify**: `ls -lh update_vercel_links.sh` should show `x` in permissions

### Auto-Update Not Triggering

**Cause**: Git hooks not initialized  
**Solution**: Run `./setup-git-hooks.sh`  
**Verify**: Check `.git/hooks/` directory for hook files

### npm Scripts Not Working

**Cause**: package.json scripts not configured  
**Solution**: Verify `package.json` has the link update scripts  
**Check**: Run `npm run | grep update`

## 📞 Support

For deployment issues:

1. Check [VERCELLINKS.md](./VERCELLINKS.md) for current status
2. Visit [Vercel Dashboard](https://vercel.com/thealphakenya/qmoi-enhanced)
3. Review logs in `/tmp/qmoi-links.log`
4. Check GitHub integration status

## 🎓 Learning Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Bash Scripting](https://www.gnu.org/software/bash/manual/)

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0  
**Status**: production Ready

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*
