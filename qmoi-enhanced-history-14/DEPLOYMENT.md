# QMOI Enhanced - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying QMOI Enhanced to various environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [CI/CD Pipeline](#cicd-pipeline)

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# Run setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Manual Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Update credentials in .env.local

# Start Docker containers (PostgreSQL, Redis)
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Docker Deployment

### Development with Docker

```bash
# Build Docker image
docker build -t qmoi-enhanced:latest .

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build multi-stage production image
docker build --target production -t qmoi-enhanced:prod .

# Tag for registry
docker tag qmoi-enhanced:prod ghcr.io/thealphakenya/qmoi-enhanced:latest

# Push to registry
docker push ghcr.io/thealphakenya/qmoi-enhanced:latest
```

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Deploy with setup script
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh

# Manage with PM2
pm2 list
pm2 logs qmoi-enhanced
pm2 restart qmoi-enhanced
pm2 stop qmoi-enhanced
pm2 delete qmoi-enhanced
```

### Using Systemd (Ubuntu/Debian)

```bash
# Create systemd service
sudo tee /etc/systemd/system/qmoi-enhanced.service > /dev/null <<EOF
[Unit]
Description=QMOI Enhanced Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/app/qmoi-enhanced
EnvironmentFile=/app/qmoi-enhanced/.env.production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable qmoi-enhanced
sudo systemctl start qmoi-enhanced
```

## Cloud Platforms

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create qmoi-enhanced

# Set environment variables
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set SENDGRID_API_KEY="your-sendgrid-key"
# ... set other variables

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
# Settings > Environment Variables
```

### AWS (ECS/Fargate)

```bash
# Build and push Docker image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker build -t qmoi-enhanced:latest .
docker tag qmoi-enhanced:latest your-account.dkr.ecr.us-east-1.amazonaws.com/qmoi-enhanced:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/qmoi-enhanced:latest

# Create ECS task definition and service via AWS Console or CLI
```

### DigitalOcean

```bash
# Via App Platform (simplest)
# 1. Connect GitHub repository
# 2. Set environment variables
# 3. Deploy

# Via Docker (manual)
docker build -t qmoi-enhanced:latest .
docker tag qmoi-enhanced:latest registry.digitalocean.com/your-registry/qmoi-enhanced:latest
docker push registry.digitalocean.com/your-registry/qmoi-enhanced:latest
```

## CI/CD Pipeline

### GitHub Actions

Automatic CI/CD is configured in `.github/workflows/ci-cd.yml`:

- **Build**: TypeScript compilation check
- **Lint**: ESLint code quality checks
- **Test**: Unit and integration tests
- **Docker**: Build and push Docker image
- **Security**: Dependency vulnerability scanning
- **Deploy**: Automatic deployment to staging/production

### Triggering Deployments

```bash
# Automatic deployments on push
git push origin main          # Deploys to production
git push origin staging       # Deploys to staging
git push origin develop       # Runs tests only

# Manual deployment
gh workflow run ci-cd.yml --ref main
```

## Database Migrations

### Running Migrations

```bash
# Run all pending migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name add_new_table

# View migration status
npx prisma migrate status

# Resolve migration conflicts
npx prisma migrate resolve --rolled-back migration_name
```

### Backup and Restore

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Monitoring & Logging

### Application Logs

```bash
# Docker Compose
docker-compose logs -f app

# PM2
pm2 logs qmoi-enhanced

# Systemd
journalctl -u qmoi-enhanced -f
```

### Health Checks

```bash
# Check application health
curl http://localhost:3000/api/health

# Check database connection
curl http://localhost:3000/api/health/db

# Check external services
curl http://localhost:3000/api/health/services
```

### Metrics & Monitoring

Configure monitoring tools:

- **Application Insights**: Azure
- **Datadog**: Multi-cloud monitoring
- **New Relic**: Performance monitoring
- **Grafana**: Metrics visualization

## Scaling

### Horizontal Scaling (Multiple Instances)

```bash
# With PM2
pm2 start npm --name "app" -i max -- start
pm2 save

# With Docker
docker-compose up -d --scale app=3
```

### Database Replication

Configure PostgreSQL replication for high availability:

```sql
-- Primary server: Enable WAL
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET wal_keep_size = '1GB';

-- Restart PostgreSQL
systemctl restart postgresql

-- Create replication user
CREATE USER replication_user REPLICATION ENCRYPTED PASSWORD 'password';
```

## Rollback Procedures

### Application Rollback

```bash
# Git rollback
git revert <commit-hash>
git push origin main

# Docker rollback
docker run -d ghcr.io/thealphakenya/qmoi-enhanced:previous-tag
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy

# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Security Checklist

- [ ] Update `.env.local` with production secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable database replication
- [ ] Configure rate limiting
- [ ] Set up DDoS protection
- [ ] Enable logging and monitoring
- [ ] Configure alerts for errors
- [ ] Review security headers
- [ ] Enable CORS properly
- [ ] Validate API request signatures

## Troubleshooting

### Application Won't Start

```bash
# Check logs
npm run dev

# Check environment variables
env | grep -E "DATABASE_URL|JWT_SECRET"

# Verify database connection
npx prisma db execute --stdin < /dev/null
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pooling
netstat -an | grep 5432
```

### High Memory Usage

```bash
# Monitor memory
docker stats qmoi_app

# Clear cache
redis-cli FLUSHDB

# Restart containers
docker-compose restart
```

## Support

For deployment issues:

1. Check logs: `docker-compose logs -f`
2. Review PRODUCTION_SETUP.md
3. Check GitHub Issues
4. Contact support team

---

**Last Updated**: January 9, 2026
