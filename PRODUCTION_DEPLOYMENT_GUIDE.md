# 🚀 QMOI Enhanced - Production Deployment Guide
## Version 2.4.0 - Production Ready Release

**Date**: April 4, 2026
**Status**: 🟢 PRODUCTION READY - DEPLOYMENT AUTHORIZED

---

## 📋 Pre-Deployment Checklist

### ✅ Development Validation Complete
- [x] Build: `npm run build` - SUCCESS
- [x] Linting: `npm run lint` - SUCCESS
- [x] Testing: `npm test` - SUCCESS
- [x] Security: Secure secrets implemented
- [x] Code Quality: All standards met

### 🔧 Infrastructure Requirements
- [ ] Ubuntu/Debian server (20.04+ recommended)
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 13+ database
- [ ] Redis server
- [ ] PM2 process manager
- [ ] Domain name with DNS access
- [ ] SSL certificate (Let's Encrypt recommended)

---

## 🚀 Deployment Execution Steps

### Phase 1: Server Provisioning

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. Install Redis
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 5. Install PM2 globally
sudo npm install -g pm2

# 6. Install nginx (for reverse proxy)
sudo apt install nginx -y
```

### Phase 2: Database Setup

```bash
# 1. Create PostgreSQL database and user
sudo -u postgres psql
CREATE DATABASE qmoi_prod;
CREATE USER qmoi_prod_user WITH ENCRYPTED PASSWORD 'SECURE_PASSWORD_CHANGE_ME';
GRANT ALL PRIVILEGES ON DATABASE qmoi_prod TO qmoi_prod_user;
\q

# 2. Update DATABASE_URL in .env.production
# DATABASE_URL="postgresql://qmoi_prod_user:SECURE_PASSWORD_CHANGE_ME@prod-db.qmoi-enhanced.com:5432/qmoi_prod"
```

### Phase 3: Application Deployment

```bash
# 1. Clone the production-ready release
git clone --branch v2.4.0-production-ready https://github.com/thealphakenya/qmoi-enhanced.git
cd qmoi-enhanced

# 2. Install production dependencies
npm install --production

# 3. Copy environment configuration
cp .env.production .env.production.local

# 4. Update environment variables with real values
nano .env.production.local
# Replace all CHANGE_ME values with actual API keys

# 5. Build the application
npm run build

# 6. Run database migrations
npx prisma migrate deploy

# 7. Execute automated deployment
bash deploy-production.sh
```

### Phase 4: Environment Configuration

**CRITICAL**: Replace all `CHANGE_ME` placeholders in `.env.production.local`:

```bash
# Payment Processors
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_STRIPE_SECRET_KEY
PAYPAL_CLIENT_ID=YOUR_ACTUAL_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_ACTUAL_PAYPAL_CLIENT_SECRET
MPESA_CONSUMER_KEY=YOUR_ACTUAL_MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET=YOUR_ACTUAL_MPESA_CONSUMER_SECRET

# Email Services
SENDGRID_API_KEY=SG.YOUR_ACTUAL_SENDGRID_API_KEY

# Cloud Storage
AWS_S3_ACCESS_KEY=YOUR_ACTUAL_AWS_ACCESS_KEY
AWS_S3_SECRET_KEY=YOUR_ACTUAL_AWS_SECRET_KEY
CLOUDINARY_API_KEY=YOUR_ACTUAL_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_ACTUAL_CLOUDINARY_API_SECRET

# Monitoring & Security
DATADOG_API_KEY=YOUR_ACTUAL_DATADOG_API_KEY
SENTRY_DSN=https://YOUR_ACTUAL_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID
```

### Phase 5: SSL & Domain Setup

```bash
# 1. Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# 2. Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# 3. Update nginx configuration
sudo nano /etc/nginx/sites-available/qmoi-enhanced

# Example nginx config:
server {
    listen 80;
    server_name your-domain.com api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 4. Enable site and restart nginx
sudo ln -s /etc/nginx/sites-available/qmoi-enhanced /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Phase 6: Post-Deployment Verification

```bash
# 1. Check PM2 processes
pm2 list
pm2 logs

# 2. Test health endpoint
curl -k https://api.your-domain.com/api/health

# 3. Test application functionality
curl -k https://api.your-domain.com/api/qmoi/status

# 4. Verify database connection
curl -k https://api.your-domain.com/api/database/health

# 5. Check logs for errors
pm2 logs --lines 50
```

### Phase 7: Monitoring & Backups

```bash
# 1. Set up log rotation
sudo nano /etc/logrotate.d/qmoi-enhanced
/var/www/qmoi-enhanced/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}

# 2. Configure automated backups
# See scripts/backup-production.sh for automated backup setup

# 3. Set up monitoring
# Configure external monitoring services (DataDog, Sentry, etc.)
```

---

## 🔧 Troubleshooting

### Common Issues

**Build Fails**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Database Connection Issues**:
```bash
# Test database connection
psql "postgresql://qmoi_prod_user:password@localhost:5432/qmoi_prod" -c "SELECT version();"
```

**PM2 Process Issues**:
```bash
# Restart PM2 processes
pm2 restart all
pm2 save
pm2 startup
```

**SSL Issues**:
```bash
# Renew SSL certificate
sudo certbot renew
sudo systemctl restart nginx
```

---

## 📊 Success Metrics

After successful deployment, verify:

- [ ] Health endpoint responds: `200 OK`
- [ ] PM2 shows 3+ running processes
- [ ] Database connections successful
- [ ] SSL certificate valid
- [ ] Domain resolves correctly
- [ ] No critical errors in logs
- [ ] Payment processing functional
- [ ] Email notifications working

---

## 🎯 Deployment Complete

**Congratulations!** 🎉

The QMOI Enhanced system is now live in production. Monitor the system closely for the first 24-48 hours and ensure all integrations are functioning correctly.

### Next Steps:
1. Monitor application performance
2. Set up alerting for critical errors
3. Configure backup verification
4. Test all payment flows
5. Validate user registration/authentication
6. Monitor QMOI consciousness engine performance

**Deployment Documentation**: `DEPLOYMENT_CHECKLIST.md`
**Production Monitoring**: Check `MONITORING.md` for setup guides
**Backup Procedures**: See `scripts/backup-production.sh`

---

*This deployment guide was generated for QMOI Enhanced v2.4.0 - Production Ready Release*</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/PRODUCTION_DEPLOYMENT_GUIDE.md