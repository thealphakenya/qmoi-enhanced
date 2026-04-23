<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-06T01:46:16.070223
- note: Auto-validated by Lion Agent validation system
<!-- LION_VALIDATION_END -->

# 🚀 QMOI Enhanced - Production Credentials Configuration Guide
## Version 2.4.0 - Production Deployment

**Date**: April 4, 2026
**Status**: 🔧 CONFIGURATION REQUIRED - 41 Credentials Needed

---

## 📋 Required Production Credentials (41 Total)

### 🔐 Database & Infrastructure (3 credentials)
```bash
# PostgreSQL Production Database
DATABASE_URL=postgresql://qmoi_prod_user:SECURE_DB_PASSWORD@prod-db.qmoi-enhanced.com:5432/qmoi_prod

# Redis Production Instance
REDIS_PASSWORD=SECURE_REDIS_PASSWORD

# QMOI Memory Database
QMOI_MEMORY_DB_URL=postgresql://qmoi_memory:SECURE_MEMORY_PASSWORD@memory-db.qmoi-enhanced.com:5432/qmoi_memory
```

### 💳 Payment Processors (12 credentials)
```bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_KEY

# PayPal
PAYPAL_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET

# M-Pesa (Kenya)
MPESA_CONSUMER_KEY=YOUR_ACTUAL_CONSUMER_KEY
MPESA_CONSUMER_SECRET=YOUR_ACTUAL_CONSUMER_SECRET
MPESA_SHORTCODE=YOUR_ACTUAL_SHORTCODE
MPESA_PASSKEY=YOUR_ACTUAL_PASSKEY

# PesaPal (Multi-Country)
PESAPAL_CONSUMER_KEY=YOUR_ACTUAL_KEY
PESAPAL_CONSUMER_SECRET=YOUR_ACTUAL_KEY

# Binance Pay
BINANCE_API_KEY=YOUR_ACTUAL_API_KEY
BINANCE_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY

# Bitget
BITGET_API_KEY=YOUR_ACTUAL_API_KEY
BITGET_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY
BITGET_PASSPHRASE=YOUR_ACTUAL_PASSPHRASE
```

### 📧 Email & Communication (4 credentials)
```bash
# SendGrid
SENDGRID_API_KEY=SG.YOUR_ACTUAL_API_KEY

# AWS SES (Alternative)
AWS_SES_ACCESS_KEY=YOUR_ACTUAL_ACCESS_KEY
AWS_SES_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY

# SMTP (Generic)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### ☁️ Cloud Storage & CDN (6 credentials)
```bash
# AWS S3
AWS_S3_ACCESS_KEY=YOUR_ACTUAL_ACCESS_KEY
AWS_S3_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME=YOUR_ACTUAL_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_ACTUAL_API_KEY
CLOUDINARY_API_SECRET=YOUR_ACTUAL_API_SECRET
```

### 📊 Monitoring & Analytics (6 credentials)
```bash
# DataDog
DATADOG_API_KEY=YOUR_ACTUAL_API_KEY
DATADOG_APP_KEY=YOUR_ACTUAL_APP_KEY

# Sentry
SENTRY_DSN=https://YOUR_PROJECT_ID@YOUR_ORG.sentry.io/YOUR_PROJECT_ID

# LogRocket
LOGROCKET_APP_ID=YOUR_ACTUAL_APP_ID

# Mixpanel
MIXPANEL_TOKEN=YOUR_ACTUAL_TOKEN
```

### 🔒 Security & Compliance (6 credentials)
```bash
# Webhooks
WEBHOOK_SECRET_KEY=SECURE_WEBHOOK_SECRET

# KYC/AML
KYC_API_KEY=YOUR_ACTUAL_KYC_KEY
AML_API_KEY=YOUR_ACTUAL_AML_KEY

# Sanctions Screening
SANCTIONS_API_KEY=YOUR_ACTUAL_SANCTIONS_KEY

# Cloudflare
CLOUDFLARE_API_TOKEN=YOUR_ACTUAL_TOKEN
CLOUDFLARE_ZONE_ID=YOUR_ACTUAL_ZONE_ID

# Backup Encryption
BACKUP_ENCRYPTION_KEY=SECURE_BACKUP_KEY
```

### 💰 Exchange Rates (1 credential)
```bash
# Exchange Rate API
EXCHANGE_RATE_API_KEY=YOUR_ACTUAL_API_KEY
```

---

## 🛠️ How to Obtain Production Credentials

### 1. **Database & Infrastructure Setup**
```bash
# Choose a cloud provider (AWS, DigitalOcean, Linode, etc.)
# Provision PostgreSQL database instance
# Create Redis instance
# production: NOTE ADDRESSED - the connection URLs and credentials
```

### 2. **Payment Processors Setup**
```bash
# Stripe: https://dashboard.stripe.com/
# PayPal: https://developer.paypal.com/
# M-Pesa: https://developer.safaricom.co.ke/
# PesaPal: https://developer.pesapal.com/
# Binance: https://testnet.binance.vision/
# Bitget: https://www.bitget.com/
```

### 3. **Email Services Setup**
```bash
# SendGrid: https://app.sendgrid.com/
# AWS SES: https://console.aws.amazon.com/ses/
# Gmail SMTP: Generate app password in Google Account settings
```

### 4. **Cloud Storage Setup**
```bash
# AWS S3: https://console.aws.amazon.com/s3/
# Cloudinary: https://cloudinary.com/
```

### 5. **Monitoring & Analytics Setup**
```bash
# DataDog: https://app.datadoghq.com/
# Sentry: https://sentry.io/
# LogRocket: https://app.logrocket.com/
# Mixpanel: https://mixpanel.com/
```

### 6. **Security & Compliance Setup**
```bash
# KYC Providers: Veriff, Jumio, Onfido
# AML Providers: Chainalysis, Elliptic
# Sanctions: Dow Jones Risk & Compliance
# Cloudflare: https://dash.cloudflare.com/
```

---

## ⚡ Quick Configuration Script

```bash
#!/bin/bash
# production-config.sh - Configure production credentials

echo "🔧 QMOI Enhanced - Production Credentials Configuration"
echo "=================================================="

# Backup original file
cp .env.production .env.production.backup

# Interactive configuration
read -p "Enter Stripe Secret Key: " STRIPE_SECRET
read -p "Enter SendGrid API Key: " SENDGRID_KEY
read -p "Enter AWS S3 Access Key: " AWS_ACCESS
read -p "Enter AWS S3 Secret Key: " AWS_SECRET
read -p "Enter DataDog API Key: " DATADOG_KEY
read -p "Enter Sentry DSN: " SENTRY_DSN

# Update environment file
sed -i "s/sk_live_CHANGE_ME_IN_PRODUCTION/$STRIPE_SECRET/g" .env.production
sed -i "s/SG.CHANGE_ME_IN_PRODUCTION/$SENDGRID_KEY/g" .env.production
sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_ACCESS/g" .env.production
sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_SECRET/g" .env.production
sed -i "s/CHANGE_ME_IN_PRODUCTION/$DATADOG_KEY/g" .env.production
sed -i "s|https://CHANGE_ME_IN_PRODUCTION@sentry.io/CHANGE_ME|$SENTRY_DSN|g" .env.production

echo "✅ Production credentials configured!"
echo "🔍 Verify configuration:"
grep -c "CHANGE_ME" .env.production
```

---

## 🚀 Next Steps After Configuration

1. **Verify all credentials are configured**:
   ```bash
   grep -c "CHANGE_ME" .env.production
   # Should return 0
   ```

2. **Test configuration**:
   ```bash
   npm run build
   npm test
   ```

3. **Deploy to production**:
   ```bash
   bash deploy-production.sh
   ```

4. **Monitor deployment**:
   ```bash
   pm2 logs
   pm2 monit
   ```

---

## 🔐 Security Best Practices

- ✅ Use strong, unique passwords for all services
- ✅ Enable 2FA on all accounts
- ✅ Store credentials securely (not in version control)
- ✅ Rotate credentials regularly
- ✅ Use environment-specific credentials
- ✅ Monitor for credential leaks

---

## 📞 Support

If you need assistance obtaining any credentials:
- **Technical Support**: support@qmoi-enhanced.com
- **Security Issues**: security@qmoi-enhanced.com
- **Documentation**: https://docs.qmoi-enhanced.com/production-setup</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/PRODUCTION_CREDENTIALS_GUIDE.md
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