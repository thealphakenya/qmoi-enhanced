---
quantum-enabled: true
---

# Webhooks & Webhook Endpoints ✅

**Last Updated:** 2026-06-05T19:30:00.000000Z
**Total Webhook Endpoints:** 7+
**Status:** ✅ Production Implementation

## Document Purpose

This document catalogs all webhook endpoints and integration points across the QMOI Enhanced system, organized by handler type and integration system.

## 🔗 Webhook Endpoints (Active Production)

### Payment & Transaction Webhooks
- `POST /api/webhooks/payments` — Payment processor webhook (Stripe, Pesapal, M-Pesa)
  - **Handler**: `app/api/webhooks/payments/route.ts`
  - **Environment**: `PAYMENTS_WEBHOOK_SECRET` or `WEBHOOK_SIGNING_SECRET`
  - **Events**: transaction.completed, transaction.failed, payment.refunded
  - **Security**: HMAC-SHA256 signature verification required
  - **Status**: ✅ Production

- `POST /api/mpesa/callback` — M-Pesa payment callback (STK Push)
  - **Handler**: `app/api/mpesa/callback/route.ts`
  - **Environment**: `PAYMENTS_WEBHOOK_SECRET`
  - **Events**: M-Pesa transaction confirmations
  - **Security**: Signature verification (HMAC-SHA256)
  - **Status**: ✅ Production

### Trading & Finance Webhooks
- **CashOn Webhook Handler** (`services/cashon-production.ts`)
  - **Environment**: `CASHON_WEBHOOK_SECRET`
  - **Events**: transaction.completed, transaction.failed, trade.executed
  - **Methods**: `verifyWebhookSignature()`, `handleWebhookEvent()`
  - **Status**: ✅ Production (wired to Cashon routes)

### Domain & Infrastructure Webhooks
- `POST /api/webhooks/godaddy-domain` — GoDaddy domain status
  - **Handler**: `app/api/webhooks/godaddy-domain/route.ts`
  - **Events**: Domain renewal, transfer, expiration, DNS updates
  - **Status**: ✅ Ready for production

- `POST /api/webhooks/godaddy-health` — GoDaddy domain health
  - **Handler**: `app/api/webhooks/godaddy-health/route.ts`
  - **Events**: SSL status, health checks, security alerts
  - **Status**: ✅ Ready for production

### Marketplace & QVillage Webhooks
- `POST /api/webhooks/qvillage` — QVillage marketplace updates
  - **Handler**: `app/api/webhooks/qvillage/route.ts`
  - **Events**: Dataset releases, model updates, space changes
  - **Status**: ✅ Ready for production

### Alerts & Notifications
- `POST /api/alerts/webhook` — Alert delivery via webhook
  - **Handler**: `src/app/api/alerts/webhook/route.ts`
  - **Environment**: `ALERT_WEBHOOK_URL`
  - **Events**: System alerts, security events, trading signals
  - **Status**: ✅ Production

### Notification Delivery (Slack, Discord, WhatsApp)
- **Slack Notifications**: `process.env.SLACK_WEBHOOK_URL`
  - Usage: Deployments, health checks, trading alerts, system status
  - Handlers: `scripts/qmoi-notification-system.js`, `scripts/ci-self-heal.js`
  - Status: ✅ Production

- **Discord Notifications**: `process.env.DISCORD_WEBHOOK_URL`
  - Usage: Community alerts, trading signals, system events
  - Handlers: `scripts/qmoi-notification-system.js`, `scripts/qmoi-production-autohealth.js`
  - Status: ✅ Production

- **WhatsApp Webhook**: `process.env.WHATSAPP_WEBHOOK_URL`
  - Handler: `scripts/services/whatsapp_service.ts`
  - Methods: `registerWebhook()`, `initializeWebhook()`
  - Status: ✅ Production

## 🔐 Webhook Security (Production Grade)

### Signature Verification
All production webhooks implement HMAC-SHA256 signature verification:

```typescript
export function verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string): boolean {
  const computed = createHmac('sha256', secret).update(payload).digest('base64');
  return timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
}
```

### Required Headers & Authentication
- `Authorization`: Bearer `WEBHOOK_SIGNING_SECRET` or `PAYMENTS_WEBHOOK_SECRET`
- `X-CashOn-Signature`: HMAC signature (for CashOn events)
- `X-Signature`: Generic webhook signature (constant-time comparison)

### Secrets Management
- `PAYMENTS_WEBHOOK_SECRET` — Payment processor validation
- `WEBHOOK_SIGNING_SECRET` — Generic webhook security
- `CASHON_WEBHOOK_SECRET` — CashOn trading events
- `SLACK_WEBHOOK_URL` — Slack notifications
- `DISCORD_WEBHOOK_URL` — Discord notifications
- `WHATSAPP_WEBHOOK_URL` — WhatsApp integration
- `ALERT_WEBHOOK_URL` — Alert notifications

## 📋 Webhook Integration Patterns (Production)

### Event-Driven Automation Flow
1. External system POSTs webhook to endpoint with signature header
2. Server receives and validates signature (timing-safe HMAC-SHA256)
3. Payload deserialized and business logic executed
4. Idempotency key checked to prevent duplicate processing
5. Transaction recorded in audit log
6. Notifications sent to Slack/Discord/WhatsApp
7. Success/failure response returned to sender

### Payment Flow
```
Pesapal/M-Pesa → POST /api/mpesa/callback 
  → verifyWebhookSignature() 
  → Update wallet balance 
  → Record transaction 
  → Notify master via WhatsApp 
  → Return 200 OK
```

### Trading Flow
```
CashOn → handleWebhookEvent() 
  → Update trade status 
  → Recalculate portfolio 
  → Update analytics 
  → Alert master if risk threshold exceeded 
  → Log audit trail
```

## ✅ Production Webhook Checklist

- [x] All webhook signatures verified (HMAC-SHA256, timing-safe)
- [x] Error handling with structured logging
- [x] Rate limiting (configurable per endpoint)
- [x] Webhook payloads validated against schema
- [x] Idempotency keys tracked (24-hour deduplication)
- [x] Notification delivery (Slack, Discord, WhatsApp)
- [x] Comprehensive audit trail logged
- [x] Retry logic with exponential backoff (3 attempts)
- [x] Monitoring and alerting (5+ failures = escalation)
- [x] Dead letter queue for failed webhooks

## 🔄 Webhook Reliability (Production)

### Retry Configuration
- **Max Retries**: 3 attempts with exponential backoff
- **Backoff Strategy**: 1s, 2s, 4s (power of 2)
- **Dead Letter Queue**: Failed webhooks stored for manual review
- **Timeout**: 30 seconds per webhook attempt

### Idempotency
- `Idempotency-Key` header supported (UUID format)
- 24-hour deduplication window
- Cached in Redis (or in-memory fallback)
- Automatic cleanup of old keys

## 📊 Webhook Monitoring & Metrics

### Tracked Metrics
- Webhook delivery success rate (target: 99.9%)
- Average processing time per webhook (target: <100ms)
- Error frequency by event type
- Signature verification failure rate (alert if > 1%)
- Notification delivery status (Slack, Discord, WhatsApp)

### Alerting Rules
- Failed signatures → immediate security alert to master
- 5+ failures in 1 minute → escalate to admin
- Payment webhook failures → halt trading + notify master
- M-Pesa callback failures → manual review + retry
- CashOn trade failures → automatic risk reduction

## ⚛️ Quantum Integration

This webhook infrastructure is part of the **Quantum multi orchestra intelligence (QMOI) autonomous trading system** and enables:
- Real-time payment processing (M-Pesa, Pesapal, Stripe)
- Autonomous trading execution (CashOn, Binance, Bitget)
- Master-only financial controls with full audit trails
- Global notification delivery (Slack, Discord, WhatsApp)
- Self-healing error recovery with exponential backoff
