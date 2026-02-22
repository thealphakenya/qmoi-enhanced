# QMOI Enhanced - Production Implementation Guide

## Overview

This document provides a comprehensive guide for setting up and deploying QMOI Enhanced with production-grade implementations for all critical services.

## Architecture Summary

The application now includes:

- **Database Layer**: Prisma ORM with PostgreSQL support
- **Authentication**: JWT-based with refresh tokens and 2FA
- **Payment Processing**: M-Pesa, Pesapal, Stripe integrations
- **Email Notifications**: SendGrid integration with templates
- **Communications**: WhatsApp, Telegram, SMS via Twilio
- **Audit Logging**: Complete audit trail for compliance
- **Wallet Management**: Multi-currency wallet system

## Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 12+
- Environment variables configured (see `.env.local.example`)

## Setup Instructions

### 1. Database Setup

```bash
# Install Prisma dependencies
npm install @prisma/client prisma

# Set DATABASE_URL in .env.local
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/qmoi_enhanced"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 2. Authentication Setup

```bash
# Generate JWT secret
openssl rand -base64 32

# Add to .env.local
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=7d

# Add encryption key (32 characters minimum)
ENCRYPTION_KEY=your_encryption_key_here
```

### 3. Email Service Setup (SendGrid)

```bash
# Sign up at https://sendgrid.com
# Create API key from Settings > API Keys

# Add to .env.local
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=QMOI Enhanced
```

### 4. Payment Gateway Setup

#### M-Pesa (Safaricom)

```bash
# Register at https://developer.safaricom.co.ke
# Get consumer key and secret from sandbox credentials

# Add to .env.local
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORT_CODE=174379  # Test shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/webhooks/payments
```

#### Pesapal

```bash
# Register merchant account at https://pesapal.com
# Get API credentials from merchant dashboard

# Add to .env.local
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_API_URL=https://api.pesapal.com/api/
```

#### Stripe (Optional)

```bash
# Sign up at https://stripe.com
# Get API keys from Dashboard > API Keys

# Add to .env.local
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Communication Services Setup

#### Twilio (WhatsApp & SMS)

```bash
# Sign up at https://twilio.com
# Get Account SID and Auth Token from console

# Add to .env.local
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+your_twilio_phone
TWILIO_WHATSAPP_NUMBER=whatsapp:+your_whatsapp_number
```

#### Telegram

```bash
# Create bot via @BotFather on Telegram
# Get bot token and admin chat ID

# Add to .env.local
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id
```

### 6. AWS S3 Setup (Optional - for file storage)

```bash
# Create IAM user with S3 access at https://aws.amazon.com
# Get access key and secret key

# Add to .env.local
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=qmoi-enhanced-storage
```

## Running the Application

### Development

```bash
# Start dev server
npm run dev

# Server runs at http://localhost:3000
```

### Production Build

```bash
# Build application
npm run build

# Start production server
npm run start

# Or use PM2
npm run start:prod:pm2
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Payments

- `POST /api/payments/initiate` - Initiate payment
- `POST /api/webhooks/payments` - Payment webhook callback
- `GET /api/payments/status/:transactionId` - Check payment status

### Wallets

- `GET /api/wallets` - List user wallets
- `GET /api/wallets/:walletId` - Get wallet details
- `POST /api/wallets/:walletId/transfer` - Transfer funds

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user details (admin)

## Environment Variables Reference

See `.env.local.example` for complete list. Key variables:

```dotenv
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qmoi

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# Email
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@qmoi.app

# Payments
PAYMENT_PROVIDER=mpesa  # or pesapal, stripe
MPESA_CONSUMER_KEY=key
MPESA_CONSUMER_SECRET=secret

# Communications
TWILIO_ACCOUNT_SID=sid
TWILIO_AUTH_TOKEN=token
TELEGRAM_BOT_TOKEN=token

# Security
WEBHOOK_SIGNING_SECRET=your_secret_key
```

## Database Schema

The Prisma schema includes:

- **User** - User accounts with roles and permissions
- **Wallet** - Multi-currency wallets per user
- **Transaction** - Payment transactions with status tracking
- **AuditLog** - Complete audit trail for compliance
- **Discussion** - Knowledge sharing discussions
- **News** - News and announcements

See `prisma/schema.prisma` for full schema definition.

## Security Best Practices

1. **Secrets Management**
   - Never commit `.env.local` to version control
   - Use `.env.local.example` as template
   - Rotate API keys regularly
   - Use strong JWT secrets (32+ characters)

2. **Webhook Security**
   - Verify webhook signatures using `WEBHOOK_SIGNING_SECRET`
   - Implement rate limiting on webhooks
   - Log all webhook events for debugging

3. **Payment Security**
   - All payment data encrypted in transit (HTTPS)
   - PCI DSS compliance for payment handling
   - Transaction verification before wallet updates
   - Audit trail for all financial operations

4. **Authentication**
   - Enforce strong password requirements
   - Implement 2FA with TOTP
   - Refresh tokens for extended sessions
   - Rate limit login attempts

## Deployment

### Heroku

```bash
# Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/postgresql

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set DATABASE_URL=your_postgres_url

# Deploy
git push heroku main
```

### Docker

```bash
# Build image
docker build -t qmoi-enhanced:latest .

# Run container
docker run -e DATABASE_URL=postgresql://... \
           -e JWT_SECRET=your_secret \
           -p 3000:3000 \
           qmoi-enhanced:latest
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## Monitoring & Logging

Application logs are configured via Winston:

```bash
# View logs (development)
npm run dev 2>&1 | tee app.log

# Log levels: error, warn, info, debug
# Set via LOG_LEVEL environment variable
```

## Testing

```bash
# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint

# Run tests (if configured)
npm run test

# Coverage report
npm run test:coverage
```

## Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL format
# postgresql://username:password@host:5432/database

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Restart Prisma
npx prisma db push
```

### Payment Integration Issues

- Check provider credentials in environment variables
- Verify callback URLs are accessible
- Check webhook logs for errors
- Test with provider sandbox first

### Email Service Issues

- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Enable "Less Secure Apps" if using Nodemailer
- Check email templates in `lib/email/service.ts`

### Authentication Issues

- Verify JWT_SECRET is set and consistent
- Check token expiration times
- Verify refresh token rotation
- Check CORS settings for token endpoints

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference)
- [M-Pesa API Documentation](https://developer.safaricom.co.ke/)
- [Pesapal Integration Guide](https://pesapal.com/api)
- [Twilio API Docs](https://www.twilio.com/docs)

## Support

For issues or questions:

1. Check logs for specific error messages
2. Review environment variable configuration
3. Test each service independently
4. Consult provider documentation
5. Open issue in repository

## Version History

- v2.0.0 - Full production implementation
- v1.0.0 - Initial release

---

**Last Updated**: January 9, 2026
**Maintained By**: QMOI Development Team
