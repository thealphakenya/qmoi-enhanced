# Environment Configuration Guide

## Overview

This guide explains how to configure the QMOI Enhanced application for different environments (development, staging, production).

## Development Environment

### 1. Create `.env.local`

```bash
cp .env.local.example .env.local
```

### 2. Configure Database

**SQLite (Default for Development):**

```bash
DATABASE_URL="file:./prisma/dev.db"
```

**PostgreSQL (Optional):**

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/qmoi_dev"
```

### 3. Configure Authentication

```bash
JWT_SECRET="your-dev-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-dev-refresh-secret-min-32-chars"
JWT_EXPIRATION=604800
JWT_REFRESH_EXPIRATION=2592000
```

### 4. Configure Email Service

**SendGrid:**

```bash
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@qmoi.app"
SENDGRID_FROM_NAME="QMOI"
EMAIL_VERIFICATION_TEMPLATE_ID="d-xxx"
PAYMENT_RECEIPT_TEMPLATE_ID="d-xxx"
```

### 5. Configure Payment Services

**M-Pesa:**

```bash
MPESA_CONSUMER_KEY="your-consumer-key"
MPESA_CONSUMER_SECRET="your-consumer-secret"
MPESA_PASS_KEY="your-pass-key"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="http://localhost:3000/api/webhooks/payments"
```

**Pesapal:**

```bash
PESAPAL_API_KEY="your-api-key"
PESAPAL_API_SECRET="your-api-secret"
PESAPAL_CONSUMER_KEY="your-consumer-key"
PESAPAL_CONSUMER_SECRET="your-consumer-secret"
PESAPAL_CALLBACK_URL="http://localhost:3000/api/webhooks/payments"
```

**Stripe:**

```bash
STRIPE_PUBLIC_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_test_xxx"
```

### 6. Configure Notifications

**SMS Provider (Twilio):**

```bash
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

**WhatsApp (Twilio):**

```bash
WHATSAPP_PHONE_NUMBER="whatsapp:+1234567890"
```

**Telegram:**

```bash
TELEGRAM_BOT_TOKEN="your-bot-token"
```

### 7. Configure Application

```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
LOG_LEVEL="debug"
```

### 8. Run Development Server

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

## Staging Environment

### 1. Create `.env.staging`

```bash
DATABASE_URL="postgresql://user:password@staging-db.example.com:5432/qmoi_staging"

JWT_SECRET="staging-secret-key-min-32-characters"
JWT_REFRESH_SECRET="staging-refresh-secret-min-32-chars"

SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="staging@qmoi.app"

MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="https://staging-api.qmoi.app/api/webhooks/payments"

PESAPAL_CALLBACK_URL="https://staging-api.qmoi.app/api/webhooks/payments"

NEXT_PUBLIC_API_URL="https://staging-api.qmoi.app"
NODE_ENV="staging"
LOG_LEVEL="info"

# AWS Configuration
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="staging-access-key"
AWS_SECRET_ACCESS_KEY="staging-secret-key"
S3_BUCKET_NAME="qmoi-staging-backups"
```

### 2. Deploy to Staging

```bash
# Using Docker Compose
docker-compose -f docker-compose.staging.yml up -d

# Or using Heroku
heroku config:set -a qmoi-staging NODE_ENV=staging
heroku config:set -a qmoi-staging JWT_SECRET=staging-secret
# ... set all other variables ...
```

## Production Environment

### 1. Create `.env.production`

```bash
# Database
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/qmoi_prod"

# Authentication
JWT_SECRET="prod-secret-key-very-long-min-32-chars"
JWT_REFRESH_SECRET="prod-refresh-secret-very-long-min-32-chars"
JWT_EXPIRATION=604800
JWT_REFRESH_EXPIRATION=2592000

# Email
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@qmoi.app"
SENDGRID_FROM_NAME="QMOI"
EMAIL_VERIFICATION_TEMPLATE_ID="d-xxx"
PAYMENT_RECEIPT_TEMPLATE_ID="d-xxx"

# Payments
MPESA_CONSUMER_KEY="prod-consumer-key"
MPESA_CONSUMER_SECRET="prod-consumer-secret"
MPESA_PASS_KEY="prod-pass-key"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="https://api.qmoi.app/api/webhooks/payments"

PESAPAL_API_KEY="prod-api-key"
PESAPAL_API_SECRET="prod-api-secret"
PESAPAL_CONSUMER_KEY="prod-consumer-key"
PESAPAL_CONSUMER_SECRET="prod-consumer-secret"
PESAPAL_CALLBACK_URL="https://api.qmoi.app/api/webhooks/payments"

STRIPE_PUBLIC_KEY="pk_live_xxx"
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_live_xxx"

# SMS/Notifications
TWILIO_ACCOUNT_SID="prod-account-sid"
TWILIO_AUTH_TOKEN="prod-auth-token"
TWILIO_PHONE_NUMBER="+xxxxxxxxxxxx"

TELEGRAM_BOT_TOKEN="prod-bot-token"

# Redis
REDIS_URL="redis://user:password@prod-redis.example.com:6379"

# AWS
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="prod-access-key"
AWS_SECRET_ACCESS_KEY="prod-secret-key"
S3_BUCKET_NAME="qmoi-prod-backups"

# Application
NEXT_PUBLIC_API_URL="https://api.qmoi.app"
NODE_ENV="production"
LOG_LEVEL="warn"

# Monitoring
SENTRY_DSN="https://xxx@sentry.io/xxx"
DATADOG_API_KEY="prod-datadog-key"

# Webhook Security
WEBHOOK_SECRET="prod-webhook-secret-very-secure"
```

### 2. Security Checklist

- [ ] All secrets are stored in `.env.production` (never in code)
- [ ] Database is on dedicated PostgreSQL instance (not SQLite)
- [ ] Redis is enabled for caching and rate limiting
- [ ] SSL/TLS certificates configured
- [ ] AWS S3 access keys have minimal required permissions
- [ ] Payment provider credentials are live (not test) keys
- [ ] Monitoring (Sentry, Datadog) is configured
- [ ] Daily backups configured with automated cleanup
- [ ] CORS is restricted to known domains
- [ ] Rate limiting is enabled for all endpoints
- [ ] Input validation is strict
- [ ] Secrets are rotated quarterly

### 3. Deploy to Production

**Using Docker:**

```bash
docker build -t qmoi-enhanced:latest .
docker run -d \
  --env-file .env.production \
  -e DATABASE_URL="postgresql://..." \
  -p 3000:3000 \
  qmoi-enhanced:latest
```

**Using Heroku:**

```bash
heroku config:set -a qmoi NODE_ENV=production
heroku config:set -a qmoi JWT_SECRET=prod-secret
# ... set all other production variables ...
git push heroku main
```

**Using AWS ECS:**

```bash
# Create task definition with .env.production values
# Deploy using CloudFormation or Terraform
```

## Environment Variables Reference

| Variable             | Type   | Required | Default     | Description                                  |
| -------------------- | ------ | -------- | ----------- | -------------------------------------------- |
| `DATABASE_URL`       | URL    | Yes      | -           | Database connection string                   |
| `NODE_ENV`           | String | No       | development | Environment (development/staging/production) |
| `JWT_SECRET`         | String | Yes      | -           | JWT signing secret (min 32 chars)            |
| `JWT_REFRESH_SECRET` | String | Yes      | -           | JWT refresh secret (min 32 chars)            |
| `SENDGRID_API_KEY`   | String | No       | -           | SendGrid API key                             |
| `MPESA_CONSUMER_KEY` | String | No       | -           | M-Pesa consumer key                          |
| `PESAPAL_API_KEY`    | String | No       | -           | Pesapal API key                              |
| `STRIPE_SECRET_KEY`  | String | No       | -           | Stripe secret key                            |
| `REDIS_URL`          | URL    | No       | -           | Redis connection URL                         |
| `S3_BUCKET_NAME`     | String | No       | -           | AWS S3 bucket for backups                    |
| `SENTRY_DSN`         | URL    | No       | -           | Sentry error tracking DSN                    |

## Verification

### Development

```bash
npm run dev
# Visit http://localhost:3000
```

### Staging

```bash
curl https://staging-api.qmoi.app/health
# Should return { "status": "ok" }
```

### Production

```bash
curl https://api.qmoi.app/health
# Should return { "status": "ok" }
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db push

# Check migrations status
npx prisma migrate status
```

### Missing Secrets

```bash
# Verify all required variables are set
node -e "console.log(process.env)"
```

### Payment Provider Issues

- Verify consumer keys/secrets are correct
- Check callback URLs match provider configuration
- Ensure phone numbers are in correct format

## Support

For environment configuration issues:

- Check [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Contact: devops@qmoi.app
