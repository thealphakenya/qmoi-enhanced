# QMOI Enhanced - Team Onboarding Guide

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

### 1. Access the Development Environment

```bash
# Clone the repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# Setup development environment
npm install
cp .env.development .env.local
npm run dev

# Application will be available at http://localhost:3000
```

### 2. Understand the Project Structure

```
qmoi-enhanced/
├── pages/              # Next.js pages and API routes
├── src/                # Source code
│   ├── components/     # React components
│   ├── lib/           # Utility libraries
│   └── styles/        # CSS and styling
├── scripts/            # Deployment and utility scripts
├── pm2.config.cjs     # PM2 configuration
├── .env.example       # Environment variables template
└── README.md          # Project documentation
```

### 3. Key Files You Should Know

- **pm2.config.cjs**: Defines how processes are managed in production
- **PRODUCTION_DEPLOYMENT_PLAYBOOK.md**: Step-by-step deployment guide
- **DEPLOYMENT_CHECKLIST.md**: Pre-deployment verification checklist
- **scripts/deploy-production.sh**: Automated deployment script
- **.env.production.updated**: Production environment template

### 4. Meet the Team Roles

- **DevOps/Infrastructure**: Manages servers, SSL, monitoring
- **Backend Developers**: Work on API endpoints and database
- **Frontend Developers**: Work on React components and UI
- **QA/Testing**: Tests features before production release
- **On-Call Support**: Monitors production and responds to alerts

## Your First Week

### Day 2: Understand Deployments

The system uses **automated deployments** with PM2:

```bash
# Current development setup (local)
pm2 start pm2.config.cjs              # Start all processes
pm2 monit                              # Monitor in real-time
pm2 logs                               # View all logs
pm2 logs qmoi-app                      # View specific process
pm2 restart qmoi-app                   # Restart a process
```

**Key Concepts:**

- **Process**: A running Node.js instance (app, health monitor, dashboard)
- **Auto-restart**: If a process crashes, PM2 automatically restarts it
- **Health Check**: Runs every 30 seconds to verify system is OK
- **Recovery**: If health check fails, auto-restart triggers

### Day 3: Database Operations

```bash
# Development database setup
npx prisma migrate dev              # Run migrations
npx prisma studio                   # Visual database browser
npx prisma db seed                  # Seed initial data

# Production database (from production server)
npx prisma migrate deploy           # Apply migrations
npx prisma db execute --stdin       # Run raw SQL
```

**Important**: Never modify production database directly!

### Day 4: API Development

```bash
# View all compiled API endpoints
npm run build  # Creates .next/static/

# Test an API endpoint locally
curl http://localhost:3000/api/health
```

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

```bash
# 1. Check process logs
pm2 logs qmoi-app --lines 100

# 2. Check system status
pm2 status
pm2 monit

# 3. If process crashed, manually restart
pm2 restart qmoi-app

# 4. Check logs again to verify fix
pm2 logs qmoi-app
```

## Common Tasks

### Deploy a Code Change to Production

1. **Create a pull request** on GitHub
2. **Team reviews** the code
3. **CI/CD pipeline** runs tests
4. **Merge to main** branch
5. **Production deployment** happens automatically (or run manually):

   ```bash
   # SSH to production server
   ssh deploy@qmoi.app

   # Pull latest code
   cd /var/www/qmoi-enhanced
   git pull origin main

   # Rebuild
   npm run ci:build

   # Restart processes
   pm2 restart all

   # Verify
   curl https://qmoi.app/api/health
   ```

### Check Application Health

```bash
# Option 1: PM2 Dashboard
pm2 monit

# Option 2: Health endpoint
curl https://qmoi.app/api/health

# Option 3: Manual check
pm2 status
pm2 logs
```

### Troubleshoot a Problem

1. **Check PM2 logs:**

   ```bash
   pm2 logs qmoi-app --lines 50
   ```

2. **Check system status:**

   ```bash
   pm2 status
   free -h  # Memory
   df -h    # Disk
   ```

3. **Restart the process:**

   ```bash
   pm2 restart qmoi-app
   ```

4. **Check database connection:**

   ```bash
   npx prisma migrate status
   ```

5. **Run verification suite:**
   ```bash
   bash scripts/verify-deployment.sh
   ```

### Access Logs

```bash
# All processes
pm2 logs

# Specific process
pm2 logs qmoi-app

# Last 100 lines
pm2 logs qmoi-app --lines 100

# Real-time (follow)
pm2 logs qmoi-app --follow

# File-based logs
tail -f logs/app-out.log
```

## On-Call Rotation

If you're on-call:

1. **Morning**: Run verification script

   ```bash
   bash scripts/verify-deployment.sh
   ```

2. **Throughout Day**: Monitor alerts
   - Check Slack for alerts
   - Respond to pings
   - Track issues in GitHub

3. **Before End of Shift**: Handoff notes
   - Document any issues found
   - Note any ongoing problems
   - Update status page

4. **Emergency Response** (if application down):

   ```bash
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
   ```

## Important URLs

| Service      | Development                      | Production                  |
| ------------ | -------------------------------- | --------------------------- |
| Main App     | http://localhost:3000            | https://qmoi.app            |
| Health Check | http://localhost:3000/api/health | https://qmoi.app/api/health |
| Dashboard    | http://localhost:3001            | https://qmoi.app:3001       |
| Database     | localhost:5432                   | (On-server only)            |

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

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Run ESLint

# Process Management
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

# Database
npx prisma migrate dev
npx prisma migrate deploy
npx prisma studio
npx prisma generate

# Server Operations
bash scripts/deploy-production.sh
bash scripts/verify-deployment.sh
node scripts/validate-production-env.js
sudo bash scripts/setup-ssl-automated.sh
```

---

**Welcome to the team! 🎉**

If you have any questions, don't hesitate to ask your teammates or check the [main README.md](./README.md).
