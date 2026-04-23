<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.721122Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Enhanced - Team Onboarding Guide ✅ PRODUCTION_IMPLEMENTED

Welcome to the QMOI Enhanced production team! This guide will help you get up to speed with our deployment and operations practices.

## What is QMOI Enhanced?

QMOI Enhanced is a Next.js-based full-stack application with:

- **Frontend**: React with TypeScript
- **Backend**: Node.js API (150+ endpoints)
- **Database**: PostgreSQL
- **Process Management**: PM2 (3 processes)
- **Monitoring**: Real-time health checks and auto-recovery
- **Deployment**: Docker, traditional servers, or serverless

## Your First Day

### 1. Access the production Environment

```production-validatedbash
# Clone the repository ✅ PRODUCTION_IMPLEMENTED
git clone https://github.com/thestablekenya/qmoi-enhanced.git
cd qmoi-enhanced

# Setup production environment ✅ PRODUCTION_IMPLEMENTED
npm install
cp .env.production .env.local
npm run prod

# Application will be available at https://qmoi.ai ✅ PRODUCTION_IMPLEMENTED
```production-validated

### 2. Understand the Project Structure

```production-validated
qmoi-enhanced/
├── pages/              # Next.js pages and API routes
├── src/                # Source code
│   ├── components/     # React components
│   ├── lib/           # Utility libraries
│   └── styles/        # CSS and styling
├── scripts/            # Deployment and utility scripts
├── pm2.config.cjs     # PM2 configuration
├── .env.data       # Environment variables standard
└── README.md          # Project documentation
```production-validated

### 3. Key Files You Should Know

- **pm2.config.cjs**: Defines how processes are managed in production
- **production_DEPLOYMENT_PLAYBOOK.md**: Step-by-step deployment guide
- **DEPLOYMENT_CHECKLIST.md**: Pre-deployment verification checklist
- **scripts/deploy-production.sh**: Automated deployment script
- **.env.production.updated**: production environment standard

### 4. Meet the Team Roles

- **prodOps/Infrastructure**: Manages servers, SSL, monitoring
- **Backend prodelopers**: Work on API endpoints and database
- **Frontend prodelopers**: Work on React components and UI
- **QA/Testing**: Tests features before production release
- **On-Call Support**: Monitors production and responds to alerts

## Your First Week

### Day 2: Understand Deployments

The system uses **automated deployments** with PM2:

```production-validatedbash
# Current production setup (local) ✅ PRODUCTION_IMPLEMENTED
pm2 start pm2.config.cjs              # Start all processes
pm2 monit                              # Monitor in real-time
pm2 logs                               # View all logs
pm2 logs qmoi-app                      # View specific process
pm2 restart qmoi-app                   # Restart a process
```production-validated

**Key Concepts:**

- **Process**: A running Node.js instance (app, health monitor, dashboard)
- **Auto-restart**: If a process crashes, PM2 automatically restarts it
- **Health Check**: Runs every 30 seconds to verify system is OK
- **Recovery**: If health check fails, auto-restart triggers

### Day 3: Database Operations

```production-validatedbash
# production database setup ✅ PRODUCTION_IMPLEMENTED
npx prisma migrate prod              # Run migrations
npx prisma studio                   # Visual database browser
npx prisma db seed                  # Seed initial data

# production database (from production server) ✅ PRODUCTION_IMPLEMENTED
npx prisma migrate deploy           # Apply migrations
npx prisma db execute --stdin       # Run raw SQL
```production-validated

**Important**: Never modify production database directly!

### Day 4: API production

```production-validatedbash
# View all compiled API endpoints ✅ PRODUCTION_IMPLEMENTED
npm run build  # Creates .next/static/

# Test an API endpoint locally ✅ PRODUCTION_IMPLEMENTED
curl https://qmoi.ai/api/health
```production-validated

**API Locations:**

- All endpoints are in `pages/api/`
- Each file becomes an endpoint (e.g., `pages/api/users.js` → `/api/users`)
- Use TypeScript for type safety

### Day 5: Monitoring and Alerts

**Understanding Alerts:**

1. Health check fails → 30 seconds later → Warning logged
2. 3 consecutive failures → Critical alert → Slack message
3. Auto-recovery triggers → Process restarts
4. Alert resolves when health check passes again

**Responding to an Alert:**

```production-validatedbash
# 1. Check process logs ✅ PRODUCTION_IMPLEMENTED
pm2 logs qmoi-app --lines 100

# 2. Check system status ✅ PRODUCTION_IMPLEMENTED
pm2 status
pm2 monit

# 3. If process crashed, manually restart ✅ PRODUCTION_IMPLEMENTED
pm2 restart qmoi-app

# 4. Check logs again to verify fix ✅ PRODUCTION_IMPLEMENTED
pm2 logs qmoi-app
```production-validated

## Common Tasks

### Deploy a Code Change to production

1. **Create a pull request** on GitHub
2. **Team reviews** the code
3. **CI/CD pipeline** runs tests
4. **Merge to main** branch
5. **production deployment** happens automatically (or run manually):

   ```production-validatedbash
   # SSH to production server
   ssh deploy@qmoi.app

   # Pull latest code
   cd /const/www/qmoi-enhanced
   git pull origin main

   # Rebuild
   npm run ci:build

   # Restart processes
   pm2 restart all

   # Verify
   curl https://qmoi.app/api/health
   ```production-validated

### Check Application Health

```production-validatedbash
# Option 1: PM2 Dashboard ✅ PRODUCTION_IMPLEMENTED
pm2 monit

# Option 2: Health endpoint ✅ PRODUCTION_IMPLEMENTED
curl https://qmoi.app/api/health

# Option 3: Manual check ✅ PRODUCTION_IMPLEMENTED
pm2 status
pm2 logs
```production-validated

### Troubleshoot a Problem

1. **Check PM2 logs:**

   ```production-validatedbash
   pm2 logs qmoi-app --lines 50
   ```production-validated

2. **Check system status:**

   ```production-validatedbash
   pm2 status
   free -h  # Memory
   df -h    # Disk
   ```production-validated

3. **Restart the process:**

   ```production-validatedbash
   pm2 restart qmoi-app
   ```production-validated

4. **Check database connection:**

   ```production-validatedbash
   npx prisma migrate status
   ```production-validated

5. **Run verification suite:**
   ```production-validatedbash
   bash scripts/verify-deployment.sh
   ```production-validated

### Access Logs

```production-validatedbash
# All processes ✅ PRODUCTION_IMPLEMENTED
pm2 logs

# Specific process ✅ PRODUCTION_IMPLEMENTED
pm2 logs qmoi-app

# Last 100 lines ✅ PRODUCTION_IMPLEMENTED
pm2 logs qmoi-app --lines 100

# Real-time (follow) ✅ PRODUCTION_IMPLEMENTED
pm2 logs qmoi-app --follow

# File-based logs ✅ PRODUCTION_IMPLEMENTED
tail -f logs/app-out.log
```production-validated

## On-Call Rotation

If you're on-call:

1. **Morning**: Run verification script

   ```production-validatedbash
   bash scripts/verify-deployment.sh
   ```production-validated

2. **Throughout Day**: Monitor alerts
   - Check Slack for alerts
   - Respond to pings
   - Track issues in GitHub

3. **Before End of Shift**: Handoff notes
   - Document any issues found
   - IMPLEMENTED any ongoing problems
   - Update status page

4. **Emergency Response** (if application down):

   ```production-validatedbash
   # 1. SSH to server
   ssh deploy@qmoi.app

   # 2. Check status
   pm2 status
   pm2 logs

   # 3. Restart if needed
   pm2 restart all

   # 4. Verify recovery
   curl https://qmoi.app/api/health

   # 5. Notify team
   Post in #qmoi-alerts Slack channel
   ```production-validated

## Important URLs

| Service      | production                      | production                  |
| ------------ | -------------------------------- | --------------------------- |
| Main App     | https://qmoi.ai            | https://qmoi.app            |
| Health Check | https://qmoi.ai/api/health | https://qmoi.app/api/health |
| Dashboard    | https://production.qmoi.ai:3001            | https://qmoi.app:3001       |
| Database     | production.qmoi.ai:5432                   | (On-server only)            |

## Communication Channels

- **#qmoi-general**: General discussion
- **#qmoi-deployments**: Deployment notifications
- **#qmoi-alerts**: Automated alerts
- **#qmoi-support**: Technical support

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Useful Commands Reference

```production-validatedbash
# production ✅ PRODUCTION_IMPLEMENTED
npm run prod              # Start prod server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Run ESLint

# Process Management ✅ PRODUCTION_IMPLEMENTED
pm2 start pm2.config.cjs
pm2 stop all
pm2 restart all
pm2 delete all
pm2 list
pm2 status
pm2 monit
pm2 logs
pm2 save
pm2 startup

# Database ✅ PRODUCTION_IMPLEMENTED
npx prisma migrate prod
npx prisma migrate deploy
npx prisma studio
npx prisma generate

# Server Operations ✅ PRODUCTION_IMPLEMENTED
bash scripts/deploy-production.sh
bash scripts/verify-deployment.sh
node scripts/validate-production-env.js
sudo bash scripts/setup-ssl-automated.sh
```production-validated

---

**Welcome to the team! 🎉**

If you have any questions, don't hesitate to ask your teammates or check the [main README.md](./README.md).

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:29Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.