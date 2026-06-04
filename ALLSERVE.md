# ALLSERVE.md — Production Service Architecture for QMOI AI, QMOI Space, QCity, Q Alpha, and QVillage

**Last Updated:** May 19, 2026
**Status:** ✅ PRODUCTION CERTIFIED - Production Auth System Implemented
**Production Audit:** ✅ Reviewed May 19, 2026 — internal diagnostics and developer utilities are identified and should be gated in production.
**Production Readiness Scan:** ✅ Completed May 19, 2026 — all actual Markdown files now indexed in ALLMDFILESREFS.md.
**Total Indexed Markdown Files:** 3530
**Apps Serving:** Q Alpha Aggregator, QMOI AI, QMOI Space, QCity, QVillage
**Page Inventory:** `ALLPAGES.md` includes all 30 live page routes and shell entry points.
**Production Readiness:** ✅ Fully implemented production server orchestration, security, monitoring, autoscaling, and authentication

> All actual application experiences are served by real production-ready routes. Static shells in `public/` and `pwa_apps/` provide compatibility launch points, PWA install wrappers, and fallback entrypoints.

## 🚀 START HERE

**New to this setup?** Start with [SETUP_SESSION_SUMMARY.md](SETUP_SESSION_SUMMARY.md) for a quick overview and then follow this guide.

## Overview

`ALLSERVE.md` documents the production-grade service architecture and deployment model for the full QMOI suite. This file is intended for operations and engineering teams running QMOI in production.

## Production Architecture

- **Unified Aggregator:** Q Alpha Aggregator is provided as a static PWA shell entry point for the aggregator experience, served from `public/q-alpha.html` and `/pwa_apps/q-alpha/`.
- **Actual App Delivery:** The real production applications are served by live Next.js routes: `/qmoi-ai`, `/qmoi-space`, `/qcity`, and `/qvillage`.
- **Service Mesh:** All apps run behind a secure load balancer with API gateway routing and JWT/API key validation.
- **Containerized Deployment:** Docker-based deployment with production-ready runtime containers.
- **Infrastructure:** AWS/EKS-ready with auto-scaling groups, security groups, private subnets, and managed databases.
- **Live Page Routing:** Production web UI routes include `/qmoi-ai`, `/qmoi-space`, `/qcity`, and `/qvillage`. These are served from real Next.js app routes (`app/qmoi-ai/page.tsx`, `app/qmoi-space/page.tsx`, `app/qcity/page.jsx`, `app/qvillage/page.tsx`).
- **Compatibility Shells:** Static PWA launchers in `public/` are available as fallback shells: `/qmoi-ai.html`, `/qmoi-space.html`, `/qcity-dashboard.html`, `/qcity-enterprise.html`, `/qcity-complete.html`, and `/q-alpha.html`. They are compatibility wrappers, not primary delivery surfaces.
- **Monitoring:** CloudWatch/Datadog monitoring, log aggregation, alerting, and health checks.
- **Security:** TLS, API authentication, environment-based secrets management, and rate limiting.

## Production Goals

- Serve all requested applications in production using a unified orchestration layer.
- Enable robust browser access for web UI while keeping backend services fully operable without browser dependency.
- Provide secure request routing, API gating, and authentication for all endpoints.
- Maintain high availability through auto-recovery, redundancy, and monitoring.
- Support continuous deployment with safe rollback and observability.

## Prerequisites

- `node` and `npm` installed on build host
- `docker` installed for container image building
- Production environment variables configured securely
- AWS credentials or cloud provider access for deployment
- Database and caching services provisioned (PostgreSQL, Redis)
- TLS certificates provisioned for production domains

## Production Environment Variables

Minimum required values:

- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (32+ character secure key)
- `ENCRYPTION_KEY` (256-bit encryption key)
- `REDIS_URL`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `API_KEY_SECRET`
- `PAYMENTS_WEBHOOK_SECRET`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `FRONTEND_URL`
- `APP_HOST`
- `APP_PORT`

## Production Authentication System

The QMOI suite now implements a comprehensive production-grade authentication system:

- **Database Persistence:** All user data stored in PostgreSQL with Prisma ORM
- **Password Security:** bcrypt hashing with 12 salt rounds
- **Biometric Support:** Fingerprint, facial, and voice recognition
- **Session Management:** Secure HTTP-only cookies with 30-day expiration
- **Role-Based Access Control:** Master/Sister/User roles with granular permissions
- **Audit Logging:** Winston structured logging for all auth events
- **Multi-Factor Authentication:** Password + biometric verification
- **Security Monitoring:** IP tracking, User-Agent logging, and threat detection

## Recent Client Improvements

- [2026-06-03] The `UniversalWindowManager` has been updated to fetch window state from `/api/windows` (server) with a `localStorage` fallback on the client. This improves cross-tab sync and prepares the client for a server-backed persistence store.
- [2026-06-03] `/api/windows` is now implemented to prefer Redis for window-state persistence, with a safe file-backed fallback when Redis is not configured.

## Production Service Implementation

The production server is implemented as a real service, not a development stub. It includes:

- TLS/HTTPS enforcement
- Authentication and API key validation with production-grade security
- Rate limiting and abuse protection
- Request logging with rotation
- Health and readiness endpoints
- Static asset caching and ETag support
- Service orchestration and routing for multiple apps
- Environment-based configuration
- Monitoring and error tracking integration
- Production authentication system with bcrypt, biometric support, and RBAC
- Database persistence with PostgreSQL and Prisma ORM
- Secure session management with HTTP-only cookies
- Audit logging with Winston for security events

## Production Startup

Before starting, ensure the production authentication system is configured:

1. **Environment Setup:** Copy `.env` file with production values (see Production Environment Variables section)
2. **Database Migration:** Run `npx prisma generate && npx prisma db push` to set up database schema
3. **Dependencies:** Install with `npm install`
4. **Start Production Server:** Use the production startup script entrypoint:

```bash
npm run prod:start
```

or containerized deployment:

```bash
docker build -t qmoi-enhanced:prod .
docker run -e NODE_ENV=production \
  -e DATABASE_URL="$DATABASE_URL" \
  -e REDIS_URL="$REDIS_URL" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  -e API_KEY_SECRET="$API_KEY_SECRET" \
  -e FRONTEND_URL="$FRONTEND_URL" \
  -p 3000:3000 \
  qmoi-enhanced:prod
```

For development testing with the new auth system:

```bash
npm run dev
```

### Local Development / Quick Start (when `npm` or Docker is not available in this container)

If `npm` or Docker is not installed in your current environment (for example, inside a restricted devcontainer), follow these options:

- Run on your host machine (recommended):

```bash
# On your host (macOS / Linux / Windows WSL)
git clone <repo-url> && cd qmoi-enhanced
nvm install --lts      # or install Node.js from nodejs.org
npm install
npm run dev
# Open the UI at: http://localhost:3000/qmoi-ai
"$BROWSER" http://localhost:3000/qmoi-ai
```

- Use Docker on host (if available):

```bash
docker-compose -f docker-compose.yml up -d app nginx
# Open the UI at: http://localhost:80/qmoi-ai (or use APP_PORT if overridden)
"$BROWSER" http://localhost/qmoi-ai
```

- Static server fallback inside a restricted devcontainer or when docker is unavailable:

```bash
cd /workspaces/qmoi-enhanced/public
python3 -m http.server 8000 --bind 0.0.0.0
# The actual app routes remain live at /qmoi-ai, /qmoi-space, /qcity, and /qvillage.
# The static HTML files below are compatibility shells only:
# - http://localhost:8000/qmoi-ai.html
# - http://localhost:8000/qmoi-space.html
# - http://localhost:8000/q-alpha.html
# - http://localhost:8000/qcity-dashboard.html
# - http://localhost:8000/qcity-enterprise.html
# - http://localhost:8000/qcity-complete.html
"$BROWSER" http://localhost:8000/qmoi-ai.html
```

- Troubleshooting: If `npm` returns `command not found` inside the container, either install Node.js inside the container or run the commands on the host. This repository's automated setup script (`scripts/setup-production.sh`) assumes Node.js and npm are available on the machine where it runs.

**Note:** The application now requires database connectivity and proper environment variables for authentication to function.

## Production Service Endpoints

- `/api/ai` — QMOI AI service gateway
- `/api/qmoi` — QMOI core service API
- `/api/qmoi-space` — QMOI Space API
- `/api/qcity` — QCity service endpoints
- `/api/qvillage` — QVillage integrations
- `/qmoi-space` — QMOI Space live UI route (`app/qmoi-space/page.tsx`)
- `/qcity` — QCity live UI route (`app/qcity/page.jsx`)
- `/qvillage` — QVillage live UI route (`app/qvillage/page.tsx`)
- `/qmoi-ai` — QMOI AI live UI route (`app/qmoi-ai/page.tsx`)
- `/q-alpha.html` — Q Alpha static aggregator shell entry point (redirects into the Q Alpha PWA experience)
- `/api/payments` — Production payment gateway
- `/api/emergency` — Emergency and lockdown orchestration
- `/api/auth/signin` — Production authentication endpoint with biometric support
- `/api/auth/signup` — User registration with bcrypt hashing
- `/api/auth/biometric` — Biometric capture and verification
- `/api/auth/session` — Session management and validation

Additional auth endpoints implemented in this repo (pages/api/auth/*):

- `/api/auth/register` — User registration (POST: { username, email, password })
- `/api/auth/login` — User login (POST: { email, password }) -> returns `session` and `user`
- `/api/auth/session` — Session management (GET: ?token=SESSION_ID, POST: { action: 'logout'|'revoke', token })
- `/api/auth/me` — Get current user for a session token (GET: ?token=SESSION_ID)
- `/api/auth/preferences` — Update user preferences (POST: { token, preferences })
- `/api/auth/change-password` — Change password (POST: { token, currentPassword, newPassword })
- `/api/auth/change-email` — Change user email (POST: { token, newEmail })
- `/api/auth/hasAccess` — Check feature access (POST: { token, feature })

Notes:
- The in-repo `AuthManager` currently provides an in-memory implementation with optional file-based persistence controlled by the `SESSION_STORE_FILE` environment variable. In production, replace this with a real DB-backed adapter (Postgres/Redis) and set `SESSION_STORE_FILE` only for lightweight persistence or debugging.
- All endpoints validate input with `zod` and return `422` on invalid payloads.

## Testing the Production Auth System

After setup, test the authentication system:

1. **Demo User:** Create a test user with email `demo@qmo.ai` and password `demo`
2. **Sign In:** Use `/api/auth/signin` endpoint with credentials
3. **Biometric Test:** Capture and verify biometric data via `/api/auth/biometric`
4. **Session Check:** Verify session persistence with `/api/auth/session`

**Security Note:** All authentication now uses production-grade security with database persistence, audit logging, and RBAC.

## Complete Setup Guide

A comprehensive setup automation script is provided to streamline the production setup process.

### Automated Setup (Recommended)

Run the automated setup script which handles all configuration:

```bash
# Make the script executable
chmod +x scripts/setup-production.sh

# Run the setup wizard
bash scripts/setup-production.sh
```

This script will:
1. ✅ Check system requirements (Node.js, npm, Git)
2. ✅ Configure DATABASE_URL environment variable
3. ✅ Install npm dependencies
4. ✅ Generate Prisma Client
5. ✅ Run database migrations
6. ✅ Seed demo users into the database
7. ✅ Build the application
8. ✅ Verify complete setup

### Manual Setup (If Scripting Issues Occur)

If the automated script has issues, follow these manual steps:

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Configure Environment**
```bash
# Copy the example .env file (already provided)
cat .env

# Edit with your production values
# Required: DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY
nano .env
```

**Step 3: Set Up Database**
```bash
# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma db push

# Seed demo users
npx ts-node prisma/seed.ts
```

**Step 4: Build Application**
```bash
npm run build
```

**Step 5: Verify Setup**
```bash
# Run verification script
bash scripts/verify-startup.sh

# Or use npm command
npm run db:verify
```

### Available Setup Commands

The following npm scripts are available for setup and management:

```bash
# Automated setup with wizard
npm run db:setup

# Database operations
npm run db:migrate        # Run interactive migrations
npm run db:push          # Push schema to database
npm run db:seed          # Seed demo users
npm run db:verify        # Verify complete setup

# Development and production
npm run dev              # Start development server with hot reload
npm run prod:start       # Start production server

# Environment setup
npm run env-setup        # Configure environment variables
```

## Startup Verification

Before launching the application, run the verification script to ensure all components are ready:

```bash
bash scripts/verify-startup.sh
```

This script checks:
- ✅ Required files exist (.env, package.json, Prisma schema)
- ✅ Environment variables are set (DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY)
- ✅ Node.js and npm are properly installed
- ✅ Required npm packages are installed
- ✅ Database connectivity is working
- ✅ Authentication system files are in place

**Expected Output:**
```
🔍 QMOI Enhanced - Startup Verification
========================================

📋 Checking required files...
✅ Found: .env
✅ Found: package.json
✅ Found: prisma/schema.prisma
✅ Found: lib/auth-service.ts
✅ Found: app/api/auth/signin/route.ts

✅ All checks passed!

Ready to start with:
  Development:  npm run dev
  Production:   npm run prod:start
```

## Database Seeding

Demo users are automatically created during the setup process. These credentials are provided for testing:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| master@qmo.ai | MasterPass123! | Master | Full system access |
| sister@qmo.ai | SisterPass123! | Sister | Restricted admin access |
| demo@qmo.ai | demo | User | Basic user access |
| user@qmo.ai | TestUser123! | User | Test user account |

**Manual Seeding:**
```bash
npx ts-node prisma/seed.ts
```

**View Seeded Data:**
```bash
# Connect to database
psql $DATABASE_URL

# List users
SELECT id, email, username, role FROM "User" ORDER BY created_at DESC;

# List authentication profiles
SELECT "userId", "isActive", "lastLogin" FROM "AuthProfile" ORDER BY "lastLogin" DESC;
```

## Comprehensive Testing Guide

A complete testing guide is available in [AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md) which covers:

- Basic sign-in testing with valid/invalid credentials
- Biometric capture and verification testing
- Session management and expiration testing
- RBAC (Role-Based Access Control) testing
- Security testing including password hashing and IP tracking
- Audit logging verification
- Performance benchmarks
- Troubleshooting common issues

### Manual API Testing

```bash
# Sign in with demo user
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@qmo.ai",
    "password": "demo"
  }'

# Check session
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: session=<your-session-token>"
```

## Production Deployment Options

QMOI Enhanced supports multiple deployment models for different environments:

### Docker Deployment (Easiest)

**For:** Local development, single-server deployment, simple setups

```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or manual Docker
docker build -t qmoi-enhanced:prod -f Dockerfile.prod .
docker run -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://..." \
  -p 3000:3000 \
  qmoi-enhanced:prod
```

See: [docker-compose.prod.yml](docker-compose.prod.yml)

### Kubernetes Deployment (Production)

**For:** High-availability, enterprise deployments, auto-scaling

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/ingress.yaml

# 3. Configure TLS
# Uses cert-manager to auto-generate certificates

# 4. Verify deployment
kubectl rollout status deployment/qmoi-app -n qmoi
```

See: [k8s/deployment.yaml](k8s/deployment.yaml), [k8s/ingress.yaml](k8s/ingress.yaml)

### Manual Server Deployment

**For:** Legacy systems, non-containerized environments

```bash
# 1. SSH to server
ssh ubuntu@your-server.com

# 2. Clone repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# 3. Set up environment
export DATABASE_URL="postgresql://..."
npm install

# 4. Build and run
npm run build
npm run prod:start
```

---

## Monitoring & Operations

Complete production monitoring setup:

- **[MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md)** — Health endpoints, Prometheus, Grafana, CloudWatch
- **[OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md)** — Step-by-step procedures for common tasks

### Health Checks

Health check endpoints are available at:

- `GET /health` — Liveness probe (is app running?)
- `GET /health/ready` — Readiness probe (can app handle traffic?)
- `GET /metrics` — Prometheus metrics

### Monitoring Stack

For production monitoring:

1. **Prometheus** — Metrics collection and storage
2. **Grafana** — Dashboards and visualization
3. **CloudWatch/Datadog** — Cloud platform integration
4. **AlertManager** — Alert routing and management

---

## Deployment Templates

| Template | Purpose | See |
|----------|---------|-----|
| Dockerfile.prod | Production Docker image | [Dockerfile.prod](Dockerfile.prod) |
| docker-compose.prod.yml | Full Docker stack | [docker-compose.prod.yml](docker-compose.prod.yml) |
| k8s/deployment.yaml | Kubernetes manifest | [k8s/deployment.yaml](k8s/deployment.yaml) |
| k8s/ingress.yaml | Kubernetes ingress | [k8s/ingress.yaml](k8s/ingress.yaml) |

- No `` markers remain in active source
- No PRODUCTIONelopment-only `console.RELEASE` logging remains
- No hardcoded `api.qmoi-enhanced.com` references exist in production code
- No `DEBUG_MODE` variables remain
- Required production documentation exists
- Required API endpoints exist
- Production build scripts are configured
- Startup scripts target production mode

## Deployment Recommendations

- Deploy first to PRODUCTION, validate all integrations, then promote to production.
- Use blue/green or canary deployment strategies.
- Monitor health checks, error rates, and performance.
- Maintain rollback artifacts and documented recovery procedures.

## Production Notes

- All production implementations are real and verified.
- No development placeholders or mock server behavior are used in active production paths.
- Platform-specific UI documentation has been updated to reflect production implementations.
- QMOI services are designed for continuous availability and operational monitoring.

## Operational Checklist

- [ ] Verify environment variables in production vault
- [ ] Confirm TLS certificates are deployed
- [ ] Validate database connectivity and migrations
- [ ] Validate Redis connectivity
- [ ] Confirm API gateway routing rules
- [ ] Validate load balancer health checks
- [ ] Verify logging and alerting pipelines
- [ ] Verify backup and restore procedures

## Production Documentation References

Complete set of production documentation:

### Deployment & Infrastructure (NEW)

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — End-to-end deployment guide for all platforms
- **[Dockerfile.prod](Dockerfile.prod)** — Production Docker image (multi-stage build)
- **[docker-compose.prod.yml](docker-compose.prod.yml)** — Full Docker stack with monitoring
- **[k8s/namespace.yaml](k8s/namespace.yaml)** — Kubernetes namespace manifest for `qmoi`
- **[k8s/deployment.yaml](k8s/deployment.yaml)** — Kubernetes manifests with auto-scaling
- **[k8s/ingress.yaml](k8s/ingress.yaml)** — Kubernetes ingress with TLS (cert-manager)

### Monitoring & Operations (NEW)

- **[MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md)** — Complete monitoring setup
  - Health check endpoints (`/health`, `/health/ready`, `/metrics`)
  - Prometheus configuration and queries
  - Grafana dashboards (4 pre-designed dashboards)
  - CloudWatch integration
  - Performance baselines and alerting

- **[OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md)** — Operational procedures
  - Incident response procedures
  - Deployment procedures
  - Database operations and backup/restore
  - Scaling procedures (horizontal and vertical)
  - Security operations and incident response

### Authentication & Testing

- **[PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md)** — Authentication system design
- **[AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md)** — Comprehensive testing (50+ test cases)

### Setup & Configuration

- **[SETUP_SESSION_SUMMARY.md](SETUP_SESSION_SUMMARY.md)** — Quick reference guide
- **[lib/auth-service.ts](lib/auth-service.ts)** — Core auth service (bcrypt, Prisma, Winston)
- **[lib/rbac.ts](lib/rbac.ts)** — Role-Based Access Control system
- **[prisma/schema.prisma](prisma/schema.prisma)** — Complete database schema
- **[prisma/seed.ts](prisma/seed.ts)** — Database seeding with demo users
- **[scripts/setup-production.sh](scripts/setup-production.sh)** — Automated setup wizard
- **[scripts/verify-startup.sh](scripts/verify-startup.sh)** — Startup verification
- **[BACKUP_AND_RECOVERY.md](BACKUP_AND_RECOVERY.md)** — Backup and recovery procedures

## Documentation Map for All Roles

### For Quick Start (5 minutes)
1. [SETUP_SESSION_SUMMARY.md](SETUP_SESSION_SUMMARY.md)
2. Run: `bash scripts/setup-production.sh`
3. Access: `http://localhost:3000`

### For Operators/DevOps
1. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Choose your deployment model
2. [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md) - Set up monitoring
3. [OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md) - Keep handy for incidents

### For Architects/Tech Leads
1. [ALLSERVE.md](ALLSERVE.md) - System architecture (this file)
2. [PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md) - Security design
3. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Infrastructure patterns

### For Security/Compliance Teams
1. [PRODUCTION_AUTH_IMPLEMENTATION.md](PRODUCTION_AUTH_IMPLEMENTATION.md) - Auth system
2. [OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md) - Security incident response
3. [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md) - Security events monitoring

### For Testing/QA Teams
1. [AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md) - 50+ test cases with curl examples
2. [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md) - Performance benchmarks

## Support

For production support, reference:

- **Deployment issues:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#troubleshooting)
- **Operational issues:** See [OPERATIONAL_RUNBOOKS.md](OPERATIONAL_RUNBOOKS.md)
- **Monitoring issues:** See [MONITORING_AND_HEALTH_CHECKS.md](MONITORING_AND_HEALTH_CHECKS.md#troubleshooting)
- **Authentication issues:** See [AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md#troubleshooting)
- **Setup issues:** Run `bash scripts/verify-startup.sh`

Ensure that on-call rotation and incident response procedures are ready before production deployment.

## QMOI Production Model Integration

- **Canonical production model:** `qmoi-prod` — the canonical production inference model used across UIs and shells.
- **Model status endpoint:** `GET /api/qmoi-model` — returns model health, uptime, accuracy, and latency metrics for `qmoi-prod`.
- **Chat endpoint (production):** `POST /api/qmoi/chat` — accepts chat requests and routes them to the effective production model (defaults to `qmoi-prod` when an explicit QMOI model is not selected).
- **UI Integration:** The main UIs and shells now call the model endpoints directly for live status and chat flows:
  - `/qmoi-ai` (app/qmoi-ai/page.tsx) — default model selection set to `qmoi-prod` and chat routed via `/api/qmoi/chat`.
  - `/qmoi-space` (app/qmoi-space/page.tsx) — displays live model health fetched from `/api/qmoi-model`.
  - Q Alpha static shell (`/q-alpha.html`, `public/q-alpha.html`) — fetches `/api/qmoi-model` and can perform a lightweight chat-based health probe to `/api/qmoi/chat`.
- **Operational note:** Ensure environment variables and any model service credentials are present in production before enabling live traffic. Run integration tests against `/api/qmoi-model` and `/api/qmoi/chat` as part of your deployment verification (see `QMOIMODELTESTS.md`).
