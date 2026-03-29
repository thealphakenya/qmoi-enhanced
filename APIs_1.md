<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T01:01:10.433088Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Complete APIs List v1.0

**Generated**: 2026-03-29T00:59:40.589636
**Total Endpoints**: 20
**Format**: Comprehensive Single-File Reference

## APIs Summary

| Domain | Endpoints | Status |
|--------|-----------|--------|
| QCity | 12 | ✅ Production |
| QMOI | 7 | ✅ Production |
| General | 0 | ✅ Production |
| **TOTAL** | **20** | **✅ Ready** |

## All Available Endpoints


### /api/deployment-status
- **File**: `deployment-status.ts`
- **Domain**: `general`

### /api/qcity/ai/fix
- **File**: `qcity/ai/fix.ts`
- **Domain**: `qcity`

### /api/qcity/config
- **File**: `qcity/config.ts`
- **Domain**: `qcity`

### /api/qcity/projects/[id]
- **File**: `qcity/projects/[id].ts`
- **Domain**: `qcity`

### /api/qcity/projects/[id]/tasks
- **File**: `qcity/projects/[id]/tasks.ts`
- **Domain**: `qcity`

### /api/qcity/projects/index
- **File**: `qcity/projects/index.ts`
- **Domain**: `qcity`

### /api/qcity/start
- **File**: `qcity/start.ts`
- **Domain**: `qcity`

### /api/qcity/status
- **File**: `qcity/status.ts`
- **Domain**: `qcity`

### /api/qcity/stop
- **File**: `qcity/stop.ts`
- **Domain**: `qcity`

### /api/qcity/trading/config
- **File**: `qcity/trading/config.ts`
- **Domain**: `qcity`

### /api/qcity/trading/positions
- **File**: `qcity/trading/positions.ts`
- **Domain**: `qcity`

### /api/qcity/whatsapp/config
- **File**: `qcity/whatsapp/config.ts`
- **Domain**: `qcity`

### /api/qcity/whatsapp/messages
- **File**: `qcity/whatsapp/messages.ts`
- **Domain**: `qcity`

### /api/qmoi/autodev
- **File**: `qmoi/autodev.ts`
- **Domain**: `qmoi`

### /api/qmoi/feedback
- **File**: `qmoi/feedback.ts`
- **Domain**: `qmoi`

### /api/qmoi/file
- **File**: `qmoi/file.ts`
- **Domain**: `qmoi`

### /api/qmoi/memory
- **File**: `qmoi/memory.ts`
- **Domain**: `qmoi`

### /api/qmoi/memory-backup
- **File**: `qmoi/memory-backup.ts`
- **Domain**: `qmoi`

### /api/qmoi/payload
- **File**: `qmoi/payload.ts`
- **Domain**: `qmoi`

### /api/qmoi/status
- **File**: `qmoi/status.ts`
- **Domain**: `qmoi`

## Webhook APIs

The QMOI system includes webhook support for real-time event processing:

- **Payment Webhooks**: `/api/webhooks/payments` - Stripe and PayPal payment events
- **GitHub Webhooks**: `/api/webhooks/github` - Repository and CI/CD events
- **QVillage Webhooks**: `/api/webhooks/qvillage` - Community and collaboration events

## Integration Examples

### Authentication
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Error Response Format
```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "status": 400
}
```

### Success Response Format
```json
{
  "status": "success",
  "data": {},
  "timestamp": "2026-03-29T00:00:00Z"
}
```

