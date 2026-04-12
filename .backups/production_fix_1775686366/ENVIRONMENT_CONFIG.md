<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.800056Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Environment Configuration Guide

## Overview

This guide explains how to configure the QMOI Enhanced application for different environments (production, production, production).

## production Environment

### 1. Create `.env.local`

```bash
cp .env.local.data .env.local
```

### 2. Configure Database

**SQLite (Default for production):**

```bash
DATABASE_URL="file:./prisma/prod.db"
```

**PostgreSQL (Optional):**

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/qmoi_prod"
```

### 3. Configure Authentication

```bash
JWT_SECRET="your-prod-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-prod-refresh-secret-min-32-chars"
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
MPESA_CALLBACK_URL="https://qmoi.ai/api/webhooks/payments"
```

**Pesapal:**

```bash
PESAPAL_API_KEY="your-api-key"
PESAPAL_API_SECRET="your-api-secret"
PESAPAL_CONSUMER_KEY="your-consumer-key"
PESAPAL_CONSUMER_SECRET="your-consumer-secret"
PESAPAL_CALLBACK_URL="https://qmoi.ai/api/webhooks/payments"
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
NEXT_PUBLIC_API_URL="https://qmoi.ai"
NODE_ENV="production"
LOG_LEVEL="debug"
```

### 8. Run production Server

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate prod

# Seed database (optional)
npx prisma db seed

# Start production server
npm run prod
```

## production Environment

### 1. Create `.env.production`

```bash
DATABASE_URL="postgresql://user:password@production-db.data.com:5432/qmoi_production"

JWT_SECRET="production-secret-key-min-32-characters"
JWT_REFRESH_SECRET="production-refresh-secret-min-32-chars"

SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="production@qmoi.app"

MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_CALLBACK_URL="https://production-api.qmoi.app/api/webhooks/payments"

PESAPAL_CALLBACK_URL="https://production-api.qmoi.app/api/webhooks/payments"

NEXT_PUBLIC_API_URL="https://production-api.qmoi.app"
NODE_ENV="production"
LOG_LEVEL="info"

# AWS Configuration
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="production-access-key"
AWS_SECRET_ACCESS_KEY="production-secret-key"
S3_BUCKET_NAME="qmoi-production-backups"
```

### 2. Deploy to production

```bash
# Using Docker Compose
docker-compose -f docker-compose.production.yml up -d

# Or using Heroku
heroku config:set -a qmoi-production NODE_ENV=production
heroku config:set -a qmoi-production JWT_SECRET=production-secret
# ... set all other variables ...
```

## production Environment

### 1. Create `.env.production`

```bash
# Database
DATABASE_URL="postgresql://user:password@prod-db.data.com:5432/qmoi_prod"

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
REDIS_URL="redis://user:password@prod-redis.data.com:6379"

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
- [ ] AWS S3 access keys have complete required permissions
- [ ] Payment provider credentials are live (not test) keys
- [ ] Monitoring (Sentry, Datadog) is configured
- [ ] Daily backups configured with automated cleanup
- [ ] CORS is restricted to known domains
- [ ] Rate limiting is enabled for all endpoints
- [ ] Input validation is strict
- [ ] Secrets are rotated quarterly

### 3. Deploy to production

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
| `NODE_ENV`           | String | No       | production | Environment (production/production/production) |
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

### production

```bash
npm run prod
# Visit https://qmoi.ai
```

### production

```bash
curl https://production-api.qmoi.app/health
# Should return { "status": "ok" }
```

### production

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

### included Secrets

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

- Check [production_SETUP.md](./production_SETUP.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Contact: prodops@[qmoi](https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai)(https://qmoi.ai).app

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:32Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


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

