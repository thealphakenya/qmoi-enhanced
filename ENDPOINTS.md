# ENDPOINTS.md - Complete Endpoint Inventory

**Last Updated**: 2026-04-13T23:45:32.138264
**Version**: 2.0.0
**Total Endpoints**: 25+

## Endpoint Inventory

### QMOI Core Endpoints (8)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/qmoi-model | GET, PUT | app/api/qmoi-model.ts | ✅ Production |
| /api/qmoi/autodev | POST, PUT | routes/api/qmoi/autodev.ts | ✅ Production |
| /api/qmoi/suggestions | POST, PUT | src/app/api/qmoi/suggestions/route.ts | ✅ Production |
| /api/qmoi/own-device-logs | GET, PUT, POST | app/api/qmoi/own-device-logs/route.ts | ✅ Production |
| /api/qmoi/backup | GET | app/api/qmoi/backup/route.ts | ✅ Production |
| /api/reasoning/process | POST | scripts/qmoi_reasoning_controller.py | ✅ Production |
| /api/multimodal/process | POST | scripts/qmoi_multimodal_ingestion.py | ✅ Production |
| /api/healing/analyze | POST | scripts/qmoi_self_healing_loop.py | ✅ Production |

### Deployment Endpoints (2)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/deploy | PUT, GET | app/api/deploy/route.ts | ✅ Production |
| /api/deploy/auto-redeploy | PUT | app/api/deploy/auto-redeploy/route.ts | ✅ Production |

### Git Integration Endpoints (3)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/git/commit | PUT, POST | app/api/git/commit/route.ts | ✅ Production |
| /api/git/push | PUT | app/api/git/push/route.ts | ✅ Production |
| /api/git/pr | POST | app/api/git/pr/route.ts | ✅ Production |

### Health & Monitoring Endpoints (2)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/health | GET, PUT | app/api/health/route.ts | ✅ Production |
| /api/qmoi/revenue-dashboard | GET | app/api/qmoi/revenue-dashboard/route.ts | ✅ Production |

### Financial Endpoints (2)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/wallet | GET, POST, PUT | app/api/wallet.ts | ✅ Production |
| /api/production-api | PUT, GET | app/api/production-api.ts | ✅ Production |

### Admin Endpoints (2)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/master/domains/emergency-takeover | PUT | app/api/master/domains/emergency-takeover/route.ts | ✅ Production |
| /api/master/sponsored/analytics | GET, PUT | app/api/master/sponsored/analytics/route.ts | ✅ Production |

### QVillage Endpoints (3)
| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| /api/webhooks/qvillage | GET, PUT, POST | app/api/webhooks/qvillage/route.ts | ✅ Production |
| /api/benchmarking/autorate | GET, POST | scripts/qmoi_autorate_system.py | ✅ Production |
| /api/benchmarking/results | POST | scripts/qmoi_autorate_system.py | ✅ Production |

## HTTP Methods Summary

| Method | Count | Purpose |
|--------|-------|---------|
| GET | 8 | Retrieve data |
| POST | 7 | Create resources |
| PUT | 9 | Update resources |
| DELETE | 1 | Remove resources |

## Response Standards

**Success (200)**:
```json
{
  "status": "success",
  "data": {},
  "timestamp": "2026-04-13T23:45:00Z"
}
```

**Error (400/500)**:
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "timestamp": "2026-04-13T23:45:00Z"
}
```

---

**Auto-Updated**: 2026-04-13T23:45:32.138264
**Status**: All 25+ endpoints fully documented
