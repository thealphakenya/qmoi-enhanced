# QMOI System Endpoints

Last Updated: 2026-03-26 (SESSION 2 - EVOLUTION & AUTODEV ENHANCED)

## Overview

This document lists all available endpoints in the QMOI system, including the new Evolution and Enhanced AutoDev systems.

### Consciousness & Awareness APIs

#### Consciousness Engine
- GET /api/consciousness?endpoint=consciousness - Get current consciousness state
- GET /api/consciousness?endpoint=consciousness/introspect - Get consciousness introspection and analysis
- POST /api/consciousness - Update consciousness state
- POST /api/consciousness - Add thought to consciousness stream

#### Awareness System
- GET /api/consciousness?endpoint=awareness/global - Get global awareness snapshot
- GET /api/consciousness?endpoint=awareness/user&user_id=USER_ID - Get user specific awareness
- GET /api/consciousness?endpoint=awareness/environment&device_id=DEVICE_ID - Get environment awareness

#### Memory Sync
- GET /api/consciousness?endpoint=memory - Get memory status
- GET /api/consciousness?endpoint=memory/search&keyword=KEYWORD - Search memories
- POST /api/consciousness - Store new memory
- POST /api/consciousness - Consolidate memories

#### Orchestration
- GET /api/consciousness?endpoint=orchestration - Get orchestration status
- POST /api/consciousness - Execute orchestrated action

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | /api/qmoi/evolution/replace-model | Execute or decide model replacement | Master | ✅ New |
| GET | /api/qmoi/evolution/replace-model | Get current model status | Master | ✅ New |
| POST | /api/qmoi/evolution/compare-models | Compare model performance metrics | User | ✅ New |
| GET | /api/qmoi/evolution/compare-models | Get available models for comparison | User | ✅ New |
| GET | /api/qmoi/evolution/track-evolution | Get evolution tracking data | User | ✅ New |
| POST | /api/qmoi/evolution/track-evolution | Manage evolution tracking (start/stop) | Master | ✅ New |

### AutoDev - Suggestions

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | /api/qmoi/autodev/suggestions/improvements | Get improvement suggestions | User | ✅ New |
| POST | /api/qmoi/autodev/suggestions/improvements | Process improvement suggestions | Master | ✅ New |
| GET | /api/qmoi/autodev/suggestions/optimizations | Get optimization suggestions | User | ✅ New |
| GET | /api/qmoi/autodev/suggestions/features | Get feature suggestions | User | ✅ New |

### AutoDev - Core

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | /api/qmoi/autodev/research | Get research suggestions | User | ✅ existing |
| POST | /api/qmoi/autodev/research | Execute research recommendations | Master | ✅ existing |
| GET | /api/qmoi/autodev/generate-feature | Get feature generation status | User | ✅ existing |
| POST | /api/qmoi/autodev/generate-feature | Generate new feature | Master | ✅ existing |
| GET | /api/qmoi/autodev/state | Get AutoDev state | User | ✅ existing |
| POST | /api/qmoi/autodev/toggle | Toggle AutoDev functionality | Master | ✅ existing |

### Domains

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/domains/health | Get domain health status |
| POST | /api/domains/check | Check specific domain |
| GET | /api/domains/report | Generate domain health report |
| POST | /api/domains/failover | Initiate domain failover |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health/system | System health check |
| GET | /api/health/domains | Domain health overview |
| GET | /api/health/production | Production readiness status |
| GET | /api/health/telemetry | System telemetry data |

### Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/monitor/logs | System logs |
| GET | /api/monitor/metrics | Performance metrics |
| GET | /api/monitor/alerts | Active alerts |
| POST | /api/monitor/test | Test monitoring systems |

### Automation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auto/status | Automation status |
| POST | /api/auto/scan | Run production scan |
| POST | /api/auto/fix | Auto-fix issues |
| GET | /api/auto/report | Automation report |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/verify | Verify token |
| POST | /api/auth/refresh | Refresh token |

### Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/data/export | Export system data |
| POST | /api/data/import | Import data |
| GET | /api/data/backup | Create backup |
| POST | /api/data/restore | Restore from backup |

### Global Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/global?action=stats | Get global operations statistics |
| GET | /api/global?action=countries | List configured countries |
| GET | /api/global?action=operations | List active and queued operations |
| GET | /api/global?action=health | Get global system health |
| POST | /api/global | Start global operations or batch operations |
| PUT | /api/global | Update global config |
| DELETE | /api/global?action=stop-operations | Stop global operations |
| DELETE | /api/global?action=clear-completed | Clear completed or failed operations |

### QVS (QMOI Virtual System)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/qvs?action=stats | Get QVS system statistics |
| GET | /api/qvs?action=health | Get QVS health snapshot |
| POST | /api/qvs | Manage QVS (configure, start-operations, scale-up) |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/health | Health reports |
| GET | /api/reports/production | Production reports |
| GET | /api/reports/performance | Performance reports |
| GET | /api/reports/compliance | Compliance reports |

### Core Engines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/qmoi-model?consciousness | Get consciousness state |
| POST | /api/qmoi-model?action=consciousness | Process consciousness actions |
| GET | /api/qmoi-model?awareness | Get awareness context |
| POST | /api/qmoi-model?action=awareness | Process awareness actions |
| GET | /api/qmoi-model?memory | Get memory status |
| POST | /api/qmoi-model?action=memory | Process memory actions |
| GET | /api/qmoi-model?orchestration | Get orchestration status |
| POST | /api/qmoi-model?action=orchestration | Process orchestration actions |
| GET | /api/qmoi-model?execution | Get execution status |
| POST | /api/qmoi-model?action=execution | Process execution actions |
| GET | /api/qmoi-model?validation | Get validation status |
| POST | /api/qmoi-model?action=validation | Process validation actions |
| GET | /api/qmoi-model?selfLearning | Get self-learning status |
| POST | /api/qmoi-model?action=selfLearning | Process self-learning actions |
| GET | /api/qmoi-model?accessibility | Get accessibility status |
| POST | /api/qmoi-model?action=accessibility | Process accessibility actions |

## Health Check Endpoints

| Endpoint | Status |
|----------|--------|
| /api/health/system | ✅ Operational |
| /api/health/domains | ✅ Operational |
| /api/health/production | ✅ Operational |
| /api/health/telemetry | ✅ Operational |

## Notes

- All endpoints require authentication
- HTTPS only in production
- Rate limiting applies
- CORS enabled for web clients


<!-- ENDPOINTS_AUTOGEN_START -->

# Auto-generated endpoints snapshot

- /api/account-automation -> app/api/account-automation/route.ts
- /api/admin/alerts -> app/api/admin/alerts/route.ts
- /api/admin/audit-logs -> app/api/admin/audit-logs/route.ts
- /api/admin/autofix/automation -> app/api/admin/autofix/automation/route.ts
- /api/admin/autofix/autoscan -> app/api/admin/autofix/autoscan/route.ts
- /api/admin/autofix/background-automation -> app/api/admin/autofix/background-automation/route.ts
- /api/admin/autofix/bootstrap -> app/api/admin/autofix/bootstrap/route.ts
- /api/admin/autofix/config -> app/api/admin/autofix/config/route.ts
- /api/admin/autofix/errors -> app/api/admin/autofix/errors/route.ts
- /api/admin/autofix/fix/{errorId} -> app/api/admin/autofix/fix/[errorId]/route.ts
- /api/admin/autofix/fix-all -> app/api/admin/autofix/fix-all/route.ts
- /api/admin/autofix/health -> app/api/admin/autofix/health/route.ts
- /api/admin/autofix/healthmonitor -> app/api/admin/autofix/healthmonitor/route.ts
- /api/admin/autofix/scan -> app/api/admin/autofix/scan/route.ts
- /api/admin/autofix/stream -> app/api/admin/autofix/stream/route.ts
- /api/admin/dashboard -> app/api/admin/dashboard/route.ts
- /api/admin/financial/global -> app/api/admin/financial/global/route.ts
- /api/admin/financial/summary -> app/api/admin/financial/summary/route.ts
- /api/admin/master/auth -> app/api/admin/master/auth/route.ts
- /api/admin/master/logout -> app/api/admin/master/logout/route.ts
- /api/admin/monitoring -> app/api/admin/monitoring/route.ts
- /api/admin/rate-limits -> app/api/admin/rate-limits/route.ts
- /api/admin/users -> app/api/admin/users/route.ts
- /api/ai -> app/api/ai/route.ts
- /api/ai/scan -> app/api/ai/scan/route.ts
- /api/ai-anomaly-service -> app/api/ai-anomaly-service/route.ts
- /api/ai-health -> app/api/ai-health/route.ts
- /api/ai-self-diagnostics -> app/api/ai-self-diagnostics/route.ts
- /api/analytics/transactions -> app/api/analytics/transactions/route.ts
- /api/analytics/wallets -> app/api/analytics/wallets/route.ts
- /api/auth/biometric/capture -> app/api/auth/biometric/capture/route.ts
- /api/auth/login -> app/api/auth/login/route.ts
- /api/auth/profile -> app/api/auth/profile/route.ts
- /api/auth/refresh -> app/api/auth/refresh/route.ts
- /api/auth/register -> app/api/auth/register/route.ts
- /api/auth/settings -> app/api/auth/settings/route.ts
- /api/auth/signin -> app/api/auth/signin/route.ts
- /api/auth/signup -> app/api/auth/signup/route.ts
- /api/auth/verify -> app/api/auth/verify/route.ts
- /api/auth/verify-email -> app/api/auth/verify-email/route.ts
- /api/auth/webauthn/authenticate -> app/api/auth/webauthn/authenticate/route.ts
- /api/auth/webauthn/register -> app/api/auth/webauthn/register/route.ts
- /api/automation/status -> app/api/automation/status/route.ts
- /api/biometric/templates -> app/api/biometric/templates/route.ts
- /api/biometric/verify -> app/api/biometric/verify/route.ts
- /api/cashon/balance -> app/api/cashon/balance/route.ts
- /api/cashon/deposit -> app/api/cashon/deposit/route.ts
- /api/cashon -> app/api/cashon/route.ts
- /api/cashon/signals -> app/api/cashon/signals/route.ts
- /api/cashon/start-trading -> app/api/cashon/start-trading/route.ts
- /api/cashon/stop-trading -> app/api/cashon/stop-trading/route.ts
- /api/cashon/trading-status -> app/api/cashon/trading-status/route.ts
- /api/chat/enhanced -> app/api/chat/enhanced/route.ts
- /api/consciousness -> app/api/consciousness/route.ts
- /api/datasets/{id} -> app/api/datasets/[id]/route.ts
- /api/datasets -> app/api/datasets/route.ts
- /api/datasets/settings -> app/api/datasets/settings/route.ts
- /api/debug/users -> app/api/debug/users/route.ts
- /api/deploy/auto-redeploy -> app/api/deploy/auto-redeploy/route.ts
- /api/deploy -> app/api/deploy/route.ts
- /api/deployment-status -> app/api/deployment-status/route.ts
- /api/device-fingerprint -> app/api/device-fingerprint/route.ts
- /api/document-backup -> app/api/document-backup/route.ts
- /api/domains/health -> app/api/domains/health/route.ts
- /api/domains -> app/api/domains/route.ts
- /api/earning -> app/api/earning/route.ts
- /api/emails -> app/api/emails/route.ts
- /api/emergency/config -> app/api/emergency/config/route.ts
- /api/emergency/dispatch -> app/api/emergency/dispatch/route.ts
- /api/emergency/email -> app/api/emergency/email/route.ts
- /api/emergency/lockdown -> app/api/emergency/lockdown/route.ts
- /api/emergency/sms -> app/api/emergency/sms/route.ts
- /api/emergency/wipe -> app/api/emergency/wipe/route.ts
- /api/employment/megavault -> app/api/employment/megavault/route.ts
- /api/employment/payment -> app/api/employment/payment/route.ts
- /api/employment/revenue -> app/api/employment/revenue/route.ts
- /api/employment -> app/api/employment/route.ts
- /api/enhanced-email/analytics -> app/api/enhanced-email/analytics/route.ts
- /api/enhanced-email/realtime -> app/api/enhanced-email/realtime/route.ts
- /api/enhanced-email/rules -> app/api/enhanced-email/rules/route.ts
- /api/enhanced-email/send -> app/api/enhanced-email/send/route.ts
- /api/enhanced-email/templates -> app/api/enhanced-email/templates/route.ts
- /api/enhanced-link-domain -> app/api/enhanced-link-domain/route.ts
- /api/files -> app/api/files/route.ts
- /api/financial/audit -> app/api/financial/audit/route.ts
- /api/financial/balances -> app/api/financial/balances/route.ts
- /api/financial/transactions -> app/api/financial/transactions/route.ts
- /api/financial/verify -> app/api/financial/verify/route.ts
- /api/git/branch -> app/api/git/branch/route.ts
- /api/git/commit -> app/api/git/commit/route.ts
- /api/git/pr -> app/api/git/pr/route.ts
- /api/git/push -> app/api/git/push/route.ts
- /api/git/remote -> app/api/git/remote/route.ts
- /api/git/status -> app/api/git/status/route.ts
- /api/global-links -> app/api/global-links/route.ts
- /api/health/data -> app/api/health/data/route.ts
- /api/health -> app/api/health/route.ts
- /api/links/{id}/zero-rated -> app/api/links/[id]/zero-rated/route.ts
- /api/links -> app/api/links/route.ts
- /api/links/validate -> app/api/links/validate/route.ts
- /api/master/domains/approve/{domain} -> app/api/master/domains/approve/[domain]/route.ts
- /api/master/domains/emergency-takeover -> app/api/master/domains/emergency-takeover/route.ts
- /api/master/domains/force-refresh -> app/api/master/domains/force-refresh/route.ts
- /api/master/domains/remove/{domain} -> app/api/master/domains/remove/[domain]/route.ts
- /api/master/domains -> app/api/master/domains/route.ts
- /api/master/domains/status -> app/api/master/domains/status/route.ts
- /api/master/links -> app/api/master/links/route.ts
- /api/master/sponsored/add -> app/api/master/sponsored/add/route.ts
- /api/master/sponsored/analytics -> app/api/master/sponsored/analytics/route.ts
- /api/master/sponsored/list -> app/api/master/sponsored/list/route.ts
- /api/master/sponsored/remove/{userId} -> app/api/master/sponsored/remove/[userId]/route.ts
- /api/master/sponsored/sync -> app/api/master/sponsored/sync/route.ts
- /api/master/tracks -> app/api/master/tracks/route.ts
- /api/media/generate -> app/api/media/generate/route.ts
- /api/media/status -> app/api/media/status/route.ts
- /api/metrics -> app/api/metrics/route.ts
- /api/monitor/status -> app/api/monitor/status/route.ts
- /api/mpesa/callback -> app/api/mpesa/callback/route.ts
- /api/notifications/test -> app/api/notifications/test/route.ts
- /api/payments/initiate -> app/api/payments/initiate/route.ts
- /api/platforms -> app/api/platforms/route.ts
- /api/qapikey -> app/api/qapikey/route.ts
- /api/qcity/audit-log -> app/api/qcity/audit-log/route.ts
- /api/qcity/remote-command -> app/api/qcity/remote-command/route.ts
- /api/qcity/selfheal-npm -> app/api/qcity/selfheal-npm/route.ts
- /api/qcity/status -> app/api/qcity/status/route.ts
- /api/qi-trading -> app/api/qi-trading/route.ts
- /api/qmoi/advanced-analysis -> app/api/qmoi/advanced-analysis/route.ts
- /api/qmoi/audio -> app/api/qmoi/audio/route.ts
- /api/qmoi/auto-fix/download-report -> app/api/qmoi/auto-fix/download-report/route.ts
- /api/qmoi/auto-fix/github-status -> app/api/qmoi/auto-fix/github-status/route.ts
- /api/qmoi/auto-fix/start -> app/api/qmoi/auto-fix/start/route.ts
- /api/qmoi/auto-fix/status -> app/api/qmoi/auto-fix/status/route.ts
- /api/qmoi/auto-fix/stop -> app/api/qmoi/auto-fix/stop/route.ts
- /api/qmoi/auto-setup -> app/api/qmoi/auto-setup/route.ts
- /api/qmoi/autodev/generate-feature -> app/api/qmoi/autodev/generate-feature/route.ts
- /api/qmoi/autodev/research -> app/api/qmoi/autodev/research/route.ts
- /api/qmoi/autodev/toggle -> app/api/qmoi/autodev/toggle/route.ts
- /api/qmoi/avatars -> app/api/qmoi/avatars/route.ts
- /api/qmoi/backup -> app/api/qmoi/backup/route.ts
- /api/qmoi/chat -> app/api/qmoi/chat/route.ts
- /api/qmoi/chat-enhanced -> app/api/qmoi/chat-enhanced/route.ts
- /api/qmoi/files/{id} -> app/api/qmoi/files/[id]/route.ts
- /api/qmoi/friendship -> app/api/qmoi/friendship/route.ts
- /api/qmoi/language -> app/api/qmoi/language/route.ts
- /api/qmoi/master-mode -> app/api/qmoi/master-mode/route.ts
- /api/qmoi/memory -> app/api/qmoi/memory/route.ts
- /api/qmoi/own-device-logs/export -> app/api/qmoi/own-device-logs/export/route.ts
- /api/qmoi/own-device-logs -> app/api/qmoi/own-device-logs/route.ts
- /api/qmoi/profile-questions -> app/api/qmoi/profile-questions/route.ts
- /api/qmoi/projects -> app/api/qmoi/projects/route.ts
- /api/qmoi/research -> app/api/qmoi/research/route.ts
- /api/qmoi/revenue/reset -> app/api/qmoi/revenue/reset/route.ts
- /api/qmoi/revenue -> app/api/qmoi/revenue/route.ts
- /api/qmoi/revenue/start -> app/api/qmoi/revenue/start/route.ts
- /api/qmoi/revenue/status -> app/api/qmoi/revenue/status/route.ts
- /api/qmoi/revenue/stop -> app/api/qmoi/revenue/stop/route.ts
- /api/qmoi/revenue/target -> app/api/qmoi/revenue/target/route.ts
- /api/qmoi/revenue/transactions -> app/api/qmoi/revenue/transactions/route.ts
- /api/qmoi/revenue/transfer -> app/api/qmoi/revenue/transfer/route.ts
- /api/qmoi/revenue-dashboard -> app/api/qmoi/revenue-dashboard/route.ts
- /api/qmoi/session -> app/api/qmoi/session/route.ts
- /api/qmoi/transcribe -> app/api/qmoi/transcribe/route.ts
- /api/qmoi/upload -> app/api/qmoi/upload/route.ts
- /api/qmoi/user -> app/api/qmoi/user/route.ts
- /api/qmoi/visuals -> app/api/qmoi/visuals/route.ts
- /api/qmoi/voice -> app/api/qmoi/voice/route.ts
- /api/qmoi/voice-enroll -> app/api/qmoi/voice-enroll/route.ts
- /api/qmoi/voice-preview -> app/api/qmoi/voice-preview/route.ts
- /api/qmoi/voice-profiles -> app/api/qmoi/voice-profiles/route.ts
- /api/qmoi-database -> app/api/qmoi-database/route.ts
- /api/qmoi-earning-enhanced -> app/api/qmoi-earning-enhanced/route.ts
- /api/qmoi-gitlab/deployments -> app/api/qmoi-gitlab/deployments/route.ts
- /api/qmoi-gitlab/errors -> app/api/qmoi-gitlab/errors/route.ts
- /api/qmoi-gitlab/jobs -> app/api/qmoi-gitlab/jobs/route.ts
- /api/qmoi-gitlab/pipelines -> app/api/qmoi-gitlab/pipelines/route.ts
- /api/qmoi-gitlab/trigger -> app/api/qmoi-gitlab/trigger/route.ts
- /api/qmoi-model -> app/api/qmoi-model/route.ts
- /api/qmoi-tracks -> app/api/qmoi-tracks/route.ts
- /api/qnews -> app/api/qnews/route.ts
- /api/qradio -> app/api/qradio/route.ts
- /api/qstore -> app/api/qstore/route.ts
- /api/qvillage/inference -> app/api/qvillage/inference/route.ts
- /api/qvillage/models -> app/api/qvillage/models/route.ts
- /api/qvillage -> app/api/qvillage/route.ts
- /api/qvillage/spaces -> app/api/qvillage/spaces/route.ts
- /api/social-automation -> app/api/social-automation/route.ts
- /api/ssh/list -> app/api/ssh/list/route.ts
- /api/ssh/read -> app/api/ssh/read/route.ts
- /api/ssh/write -> app/api/ssh/write/route.ts
- /api/tracks/{id} -> app/api/tracks/[id]/route.ts
- /api/tracks -> app/api/tracks/route.ts
- /api/tracks/settings -> app/api/tracks/settings/route.ts
- /api/tracks/stream -> app/api/tracks/stream/route.ts
- /api/trading/status -> app/api/trading/status/route.ts
- /api/transactions -> app/api/transactions/route.ts
- /api/tts/generate -> app/api/tts/generate/route.ts
- /api/tts/stream -> app/api/tts/stream/route.ts
- /api/users/profile -> app/api/users/profile/route.ts
- /api/version -> app/api/version/route.ts
- /api/voice/enroll -> app/api/voice/enroll/route.ts
- /api/voice/verify -> app/api/voice/verify/route.ts
- /api/wallets/{walletId} -> app/api/wallets/[walletId]/route.ts
- /api/wallets -> app/api/wallets/route.ts
- /api/webauthn/authenticate -> app/api/webauthn/authenticate/route.ts
- /api/webauthn/register -> app/api/webauthn/register/route.ts
- /api/webhooks/payments -> app/api/webhooks/payments/route.ts
- /api/webhooks/qvillage -> app/api/webhooks/qvillage/route.ts
- /api/whatsapp/audit -> app/api/whatsapp/audit/route.ts
- /api/whatsapp/verify -> app/api/whatsapp/verify/route.ts
- /api/whatsapp-bot -> app/api/whatsapp-bot/route.ts
- /api/whatsapp-business -> app/api/whatsapp-business/route.ts
- /api/wifi -> app/api/wifi/route.ts
- /api/wifi/scan -> app/api/wifi/scan/route.ts
- /api/wifi-security -> app/api/wifi-security/route.ts
- /api/youtube/download -> app/api/youtube/download/route.ts

<!-- ENDPOINTS_AUTOGEN_END -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:31Z

---
*This document is maintained by QMOI's autonomous evolution system*
