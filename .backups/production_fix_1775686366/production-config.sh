#!/bin/bash
# production-config.sh - Interactive Production Credentials Configuration
# Version 2.4.0 - QMOI Enhanced

set -e

echo "🔧 QMOI Enhanced - Production Credentials Configuration"
echo "=================================================="
echo "This script will help you configure production credentials interactively."
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# Backup original file
echo "📋 Creating backup of current configuration..."
cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Count current placeholders
PLACEHOLDERS_BEFORE=$(grep -c "CHANGE_ME" .env.production)
echo "📊 Current placeholders: $PLACEHOLDERS_BEFORE"

echo ""
echo "🔑 Please enter your production credentials:"
echo "=========================================="

# Database Configuration
echo ""
echo "🗄️  DATABASE CONFIGURATION:"
read -p "PostgreSQL Database URL (with password): " DB_URL
read -p "Redis Password: " REDIS_PASS
read -p "QMOI Memory Database URL: " MEMORY_DB_URL

# Payment Processors
echo ""
echo "💳 PAYMENT PROCESSORS:"
read -p "Stripe Secret Key: " STRIPE_SECRET
read -p "Stripe Publishable Key: " STRIPE_PUBLISHABLE
read -p "Stripe Webhook Secret: " STRIPE_WEBHOOK
read -p "PayPal Client ID: " PAYPAL_CLIENT_ID
read -p "PayPal Client Secret: " PAYPAL_CLIENT_SECRET
read -p "M-Pesa Consumer Key: " MPESA_CONSUMER_KEY
read -p "M-Pesa Consumer Secret: " MPESA_CONSUMER_SECRET
read -p "M-Pesa Shortcode: " MPESA_SHORTCODE
read -p "M-Pesa Passkey: " MPESA_PASSKEY

# Email Services
echo ""
echo "📧 EMAIL SERVICES:"
read -p "SendGrid API Key: " SENDGRID_KEY
read -p "AWS SES Access Key (optional): " AWS_SES_ACCESS
read -p "AWS SES Secret Key (optional): " AWS_SES_SECRET

# Cloud Storage
echo ""
echo "☁️  CLOUD STORAGE:"
read -p "AWS S3 Access Key: " AWS_S3_ACCESS
read -p "AWS S3 Secret Key: " AWS_S3_SECRET
read -p "Cloudinary Cloud Name: " CLOUDINARY_CLOUD
read -p "Cloudinary API Key: " CLOUDINARY_API_KEY
read -p "Cloudinary API Secret: " CLOUDINARY_API_SECRET

# Monitoring
echo ""
echo "📊 MONITORING & ANALYTICS:"
read -p "DataDog API Key: " DATADOG_API_KEY
read -p "DataDog App Key: " DATADOG_APP_KEY
read -p "Sentry DSN: " SENTRY_DSN
read -p "LogRocket App ID (optional): " LOGROCKET_APP_ID
read -p "Mixpanel Token (optional): " MIXPANEL_TOKEN

# Security
echo ""
echo "🔒 SECURITY & COMPLIANCE:"
read -p "Webhook Secret Key: " WEBHOOK_SECRET
read -p "KYC API Key (optional): " KYC_API_KEY
read -p "AML API Key (optional): " AML_API_KEY
read -p "Cloudflare API Token (optional): " CLOUDFLARE_TOKEN
read -p "Cloudflare Zone ID (optional): " CLOUDFLARE_ZONE_ID
read -p "Exchange Rate API Key: " EXCHANGE_RATE_KEY
read -p "Backup Encryption Key: " BACKUP_ENCRYPTION_KEY

# Update the environment file
echo ""
echo "🔄 Updating .env.production with your credentials..."

# Database
if [ ! -z "$DB_URL" ]; then
    sed -i "s|postgresql://qmoi_prod_user:SECURE_PASSWORD_CHANGE_ME@prod-db.qmoi-enhanced.com:5432/qmoi_prod|$DB_URL|g" .env.production
fi

if [ ! -z "$REDIS_PASS" ]; then
    sed -i "s/SECURE_REDIS_PASSWORD_CHANGE_ME/$REDIS_PASS/g" .env.production
fi

if [ ! -z "$MEMORY_DB_URL" ]; then
    sed -i "s|postgresql://qmoi_memory:SECURE_PASSWORD@memory-db.qmoi-enhanced.com:5432/qmoi_memory|$MEMORY_DB_URL|g" .env.production
fi

# Payment Processors
if [ ! -z "$STRIPE_SECRET" ]; then
    sed -i "s/sk_live_CHANGE_ME_IN_PRODUCTION/$STRIPE_SECRET/g" .env.production
fi

if [ ! -z "$STRIPE_PUBLISHABLE" ]; then
    sed -i "s/pk_live_CHANGE_ME_IN_PRODUCTION/$STRIPE_PUBLISHABLE/g" .env.production
fi

if [ ! -z "$STRIPE_WEBHOOK" ]; then
    sed -i "s/whsec_CHANGE_ME_IN_PRODUCTION/$STRIPE_WEBHOOK/g" .env.production
fi

if [ ! -z "$PAYPAL_CLIENT_ID" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$PAYPAL_CLIENT_ID/g" .env.production
fi

if [ ! -z "$PAYPAL_CLIENT_SECRET" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$PAYPAL_CLIENT_SECRET/g" .env.production
fi

if [ ! -z "$MPESA_CONSUMER_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$MPESA_CONSUMER_KEY/g" .env.production
fi

if [ ! -z "$MPESA_CONSUMER_SECRET" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$MPESA_CONSUMER_SECRET/g" .env.production
fi

if [ ! -z "$MPESA_SHORTCODE" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$MPESA_SHORTCODE/g" .env.production
fi

if [ ! -z "$MPESA_PASSKEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$MPESA_PASSKEY/g" .env.production
fi

# Email Services
if [ ! -z "$SENDGRID_KEY" ]; then
    sed -i "s/SG.CHANGE_ME_IN_PRODUCTION/$SENDGRID_KEY/g" .env.production
fi

if [ ! -z "$AWS_SES_ACCESS" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_SES_ACCESS/g" .env.production
fi

if [ ! -z "$AWS_SES_SECRET" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_SES_SECRET/g" .env.production
fi

# Cloud Storage
if [ ! -z "$AWS_S3_ACCESS" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_S3_ACCESS/g" .env.production
fi

if [ ! -z "$AWS_S3_SECRET" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$AWS_S3_SECRET/g" .env.production
fi

if [ ! -z "$CLOUDINARY_CLOUD" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$CLOUDINARY_CLOUD/g" .env.production
fi

if [ ! -z "$CLOUDINARY_API_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$CLOUDINARY_API_KEY/g" .env.production
fi

if [ ! -z "$CLOUDINARY_API_SECRET" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$CLOUDINARY_API_SECRET/g" .env.production
fi

# Monitoring
if [ ! -z "$DATADOG_API_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$DATADOG_API_KEY/g" .env.production
fi

if [ ! -z "$DATADOG_APP_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$DATADOG_APP_KEY/g" .env.production
fi

if [ ! -z "$SENTRY_DSN" ]; then
    sed -i "s|https://CHANGE_ME_IN_PRODUCTION@sentry.io/CHANGE_ME|$SENTRY_DSN|g" .env.production
fi

if [ ! -z "$LOGROCKET_APP_ID" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$LOGROCKET_APP_ID/g" .env.production
fi

if [ ! -z "$MIXPANEL_TOKEN" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$MIXPANEL_TOKEN/g" .env.production
fi

# Security
if [ ! -z "$WEBHOOK_SECRET" ]; then
    sed -i "s/CHANGE_ME_TO_SECURE_WEBHOOK_SECRET_IN_PRODUCTION/$WEBHOOK_SECRET/g" .env.production
fi

if [ ! -z "$KYC_API_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$KYC_API_KEY/g" .env.production
fi

if [ ! -z "$AML_API_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$AML_API_KEY/g" .env.production
fi

if [ ! -z "$CLOUDFLARE_TOKEN" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$CLOUDFLARE_TOKEN/g" .env.production
fi

if [ ! -z "$CLOUDFLARE_ZONE_ID" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$CLOUDFLARE_ZONE_ID/g" .env.production
fi

if [ ! -z "$EXCHANGE_RATE_KEY" ]; then
    sed -i "s/CHANGE_ME_IN_PRODUCTION/$EXCHANGE_RATE_KEY/g" .env.production
fi

if [ ! -z "$BACKUP_ENCRYPTION_KEY" ]; then
    sed -i "s/CHANGE_ME_TO_SECURE_BACKUP_KEY_IN_PRODUCTION/$BACKUP_ENCRYPTION_KEY/g" .env.production
fi

# Count remaining placeholders
PLACEHOLDERS_AFTER=$(grep -c "CHANGE_ME" .env.production)
CONFIGURED=$((PLACEHOLDERS_BEFORE - PLACEHOLDERS_AFTER))

echo ""
echo "✅ Configuration Complete!"
echo "=========================="
echo "📊 Placeholders configured: $CONFIGURED"
echo "📊 Remaining placeholders: $PLACEHOLDERS_AFTER"

if [ $PLACEHOLDERS_AFTER -eq 0 ]; then
    echo "🎉 All production credentials configured successfully!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Review .env.production for accuracy"
    echo "2. Run: npm run build"
    echo "3. Run: npm test"
    echo "4. Deploy: bash deploy-production.sh"
else
    echo "⚠️  Some credentials still need configuration."
    echo "   Run this script again or manually update .env.production"
fi

echo ""
echo "🔍 To check remaining placeholders:"
echo "   grep -n 'CHANGE_ME' .env.production"</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/production-config.sh