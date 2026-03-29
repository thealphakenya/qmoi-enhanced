<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T01:01:10.449509Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# WEBHOOKS.md - Webhook Integration Guide

**Last Updated**: 2026-03-29T01:00:55.806820
**Status**: ✅ Production Ready

## 🔗 Webhook Overview

This document describes how the QMOI system handles webhooks for real-time event processing and external integrations.

## Webhook Architecture

### Event Processing Flow

1. **Receive** - Webhook endpoint receives HTTP POST request
2. **Verify** - Validate signature and authentication
3. **Parse** - Extract and validate payload
4. **Queue** - Add event to processing queue
5. **Process** - Handle event idempotently
6. **Respond** - Send acknowledgment

### Security Best Practices

- **Signature Verification**: Validate X-Hub-Signature-256 header
- **IP Whitelisting**: Restrict source IPs where applicable
- **Rate Limiting**: Prevent abuse with rate limits
- **Retry Logic**: Implement exponential backoff
- **Idempotency**: Process events exactly-once
- **Secrets Management**: Secure webhook secret storage

## Available Webhooks

### Payment Webhooks
**Endpoint**: `/api/webhooks/payments`

Handles:
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed
- `charge.dispute.created` - Dispute initiated

**Providers**:
- Stripe
- PayPal
- Pesapal

### GitHub Webhooks
**Endpoint**: `/api/webhooks/github`

Handles:
- `push` - Code pushed to repository
- `pull_request` - PR opened/updated
- `issues` - Issue events
- `release` - Release published

### QVillage Webhooks
**Endpoint**: `/api/webhooks/qvillage`

Handles:
- `paper.published` - New paper published
- `entry.created` - New entry created
- `discussion.started` - Discussion started
- `sync.completed` - Sync operation completed
- `enhancement.applied` - Enhancement applied
- `alert.triggered` - Alert triggered

## Webhook Implementation

### Example Handler

```typescript
import { Request, Response } from 'express';
import { verifyWebhookSignature } from '@/services/webhooks';

export async function handleWebhook(req: Request, res: Response) {
  try {
    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      req.headers['x-hub-signature-256'] as string,
      req.body
    );
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Acknowledge receipt immediately
    res.status(200).json({ status: 'received' });
    
    // Process asynchronously
    await processWebhookEvent(req.body);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Testing Webhooks

### Using curl
```bash
curl -X POST http://localhost:3000/api/webhooks/payments \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{"type": "payment_intent.succeeded"}'
```

### Using Webhook Testing Tools
- Webhook.site - Quick testing
- Hookbin - Event capture
- ngrok - Tunnel for local testing

## Webhook Retry Policy

- **Initial Attempt**: Immediate
- **Retry 1**: 30 seconds
- **Retry 2**: 5 minutes
- **Retry 3**: 30 minutes
- **Retry 4**: 24 hours
- **Max Retries**: 5

## Monitoring

- All webhooks logged with request/response
- Event tracking dashboard available
- Failed webhook alerts sent to admin
- Webhook metrics tracked:
  - Success rate
  - Average latency
  - Error frequency

---
*Webhook documentation automatically maintained by QMOI evolution system.*
