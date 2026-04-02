<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-04-01T03:05:16.705777Z
- note: Auto-updated by `scripts/comprehensive_docs_update.py`
<!-- LION_VALIDATION_END -->

# QMOI API Documentation

**Generated**: 2026-04-01 SESSION CONTINUOUS
**Last Updated**: 2026-04-01T03:05:16.705777Z
**Total Endpoints**: 260

## Overview

This document provides comprehensive documentation for all QMOI system APIs. All endpoints are auto-generated and verified.

## Quick Access

- **Total Endpoints**: 260
- **API Base URL**: `/api`
- **Authentication**: JWT tokens required for most endpoints
- **Rate Limiting**: Applied to all endpoints
- **Response Format**: JSON (application/json)

## Authentication

All API endpoints require authentication via JWT tokens (except public endpoints).

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure_password"
}
```

## API Endpoints by Category

### Evolution System
- `POST /api/qmoi/evolution/replace-model` - Execute or decide model replacement
- `GET /api/qmoi/evolution/replace-model` - Get current model status
- `POST /api/qmoi/evolution/compare-models` - Compare model performance metrics
- `GET /api/qmoi/evolution/compare-models` - Get available models
- `GET /api/qmoi/evolution/track-evolution` - Get evolution tracking data
- `POST /api/qmoi/evolution/track-evolution` - Manage evolution tracking

### Autoprod - Core
- `GET /api/qmoi/autoprod/research` - Get research suggestions
- `POST /api/qmoi/autoprod/research` - Execute research recommendations
- `GET /api/qmoi/autoprod/generate-feature` - Get feature generation status
- `POST /api/qmoi/autoprod/generate-feature` - Generate new feature
- `GET /api/qmoi/autoprod/state` - Get Autoprod state
- `POST /api/qmoi/autoprod/toggle` - Toggle Autoprod functionality

### Autoprod - Suggestions
- `GET /api/qmoi/autoprod/suggestions/improvements` - Get improvement suggestions
- `POST /api/qmoi/autoprod/suggestions/improvements` - Process improvements
- `GET /api/qmoi/autoprod/suggestions/optimizations` - Get optimization suggestions
- `GET /api/qmoi/autoprod/suggestions/features` - Get feature suggestions

### Self-Work
- `POST /api/qmoi/self-work/code-review` - Code review
- `POST /api/qmoi/self-work/debug` - Debug code
- `POST /api/qmoi/self-work/run-tests` - Run tests

### Global APIs
- `POST /api/global` - Global operations
- `POST /api/qvs` - QVS operations

### Health & Monitoring
- `GET /api/qmoi/health` - Health check
- `GET /api/qmoi/health/stream` - Health stream

### Consciousness & Awareness
- `GET /api/consciousness` - Get consciousness state
- `POST /api/consciousness` - Update consciousness

### Tracks System
- `GET /api/tracks` - Get all tracks
- `POST /api/tracks` - Create new track
- `GET /api/tracks/[id]` - Get specific track
- `GET /api/tracks/stream` - Track stream
- `GET /api/tracks/settings` - Track settings

### Master Operations
- `GET /api/master/tracks` - Master track operations
- `GET /api/master/links` - Master link operations
- `GET /api/master/domains` - Master domain operations
- `POST /api/master/domains/emergency-takeover` - Emergency domain takeover
- `GET /api/master/domains/status` - Domain status
- `POST /api/master/sponsored` - Sponsored user operations

### Domain Management
- `GET /api/domains/health` - Domain health
- `POST /api/domains/check` - Check domain
- `GET /api/domains/report` - Domain report

### QVillage
- `GET /api/qvillage` - QVillage info
- `GET /api/qvillage/models` - Available models
- `POST /api/qvillage/inference` - Run inference
- `GET /api/qvillage/spaces` - Available spaces

### Datasets
- `GET /api/datasets` - Get datasets
- `POST /api/datasets` - Create dataset
- `GET /api/datasets/[id]` - Get specific dataset
- `GET /api/datasets/settings` - Dataset settings

### Media
- `POST /api/media/generate` - Generate media
- `GET /api/media/status` - Media generation status

### Links
- `GET /api/links` - Get links
- `POST /api/links` - Create link
- `POST /api/links/validate` - Validate links
- `GET /api/global-links` - Global links

### WebAuthn
- `POST /api/webauthn/register` - Register WebAuthn
- `POST /api/webauthn/authenticate` - Authenticate with WebAuthn

### Biometric
- `POST /api/biometric/templates` - Biometric templates
- `POST /api/biometric/verify` - Verify biometric

### Integration APIs
- `POST /api/whatsapp-business` - WhatsApp Business
- `GET /api/qi-trading` - QI Trading
- `POST /api/deploy` - Deployment
- `POST /api/deploy/auto-redeploy` - Auto-redeploy
- `GET /api/qstore` - Q Store
- `GET /api/qnews` - Q News

## Complete Endpoint List

- `GET` `/api/account-automation`
- `GET` `/api/accountability`
- `GET` `/api/accountability`
- `GET` `/api/admin/alerts`
- `GET` `/api/admin/audit-logs`
- `GET` `/api/admin/autofix/automation`
- `GET` `/api/admin/autofix/autoscan`
- `GET` `/api/admin/autofix/background-automation`
- `GET` `/api/admin/autofix/bootstrap`
- `GET` `/api/admin/autofix/config`
- `GET` `/api/admin/autofix/errors`
- `GET` `/api/admin/autofix/fix-all`
- `POST` `/api/admin/autofix/fix/[errorId]`
- `GET` `/api/admin/autofix/health`
- `GET` `/api/admin/autofix/healthmonitor`
- `GET` `/api/admin/autofix/scan`
- `GET` `/api/admin/autofix/stream`
- `GET` `/api/admin/dashboard`
- `GET` `/api/admin/financial/global`
- `GET` `/api/admin/financial/summary`
- `POST` `/api/admin/master/auth`
- `POST` `/api/admin/master/logout`
- `GET` `/api/admin/metrics`
- `GET` `/api/admin/monitoring`
- `GET` `/api/admin/rate-limits`
- `GET` `/api/admin/tracing`
- `GET` `/api/admin/users`
- `GET` `/api/ai`
- `GET` `/api/ai-anomaly-service`
- `GET` `/api/ai-health`
- `GET` `/api/ai-self-diagnostics`
- `GET` `/api/ai/scan`
- `POST` `/api/alerts/webhook`
- `GET` `/api/analytics/transactions`
- `GET` `/api/analytics/wallets`
- `GET` `/api/auth/biometric/capture`
- `POST` `/api/auth/login`
- `POST` `/api/auth/login`
- `GET` `/api/auth/oauth/[provider]`
- `POST` `/api/auth/profile`
- `POST` `/api/auth/refresh`
- `POST` `/api/auth/register`
- `GET` `/api/auth/settings`
- `GET` `/api/auth/signin`
- `GET` `/api/auth/signup`
- `POST` `/api/auth/verify`
- `POST` `/api/auth/verify-email`
- `POST` `/api/auth/webauthn/auth/finish`
- `POST` `/api/auth/webauthn/auth/options`
- `POST` `/api/auth/webauthn/authenticate`
- `POST` `/api/auth/webauthn/register`
- `POST` `/api/auth/webauthn/register/finish`
- `POST` `/api/auth/webauthn/register/options`
- `GET` `/api/automation/status`
- `POST` `/api/automation/trigger`
- `GET` `/api/avatars/[userId]`
- `GET` `/api/biometric/templates`
- `POST` `/api/biometric/verify`
- `GET` `/api/cashon`
- `GET` `/api/cashon/balance`
- `POST` `/api/cashon/deposit`
- `GET` `/api/cashon/signals`
- `POST` `/api/cashon/start-trading`
- `POST` `/api/cashon/stop-trading`
- `GET` `/api/cashon/trading-status`
- `POST` `/api/chat/enhanced`
- `GET` `/api/consciousness`
- `GET` `/api/consciousness/health`
- `GET` `/api/datasets`
- `GET` `/api/datasets/[id]`
- `POST` `/api/datasets/settings`
- `GET` `/api/debug/users`
- `POST` `/api/deploy`
- `POST` `/api/deploy/auto-redeploy`
- `GET` `/api/deployment-status`
- `GET` `/api/device-fingerprint`
- `POST` `/api/document-backup`
- `GET` `/api/domains`
- `GET` `/api/domains/health`
- `GET` `/api/earning`
- `GET` `/api/emails`
- `GET` `/api/emergency/config`
- `POST` `/api/emergency/dispatch`
- `POST` `/api/emergency/email`
- `GET` `/api/emergency/lockdown`
- `POST` `/api/emergency/sms`
- `GET` `/api/emergency/wipe`
- `GET` `/api/employment`
- `GET` `/api/employment/megavault`
- `GET` `/api/employment/payment`
- `GET` `/api/employment/revenue`
- `GET` `/api/enhanced-email/analytics`
- `GET` `/api/enhanced-email/realtime`
- `GET` `/api/enhanced-email/rules`
- `POST` `/api/enhanced-email/send`
- `GET` `/api/enhanced-email/templates`
- `GET` `/api/enhanced-link-domain`
- `GET` `/api/evolution/autoclone-evolution`
- `GET` `/api/evolution/platform-evolution`
- `GET` `/api/files`
- `GET` `/api/financial/audit`
- `GET` `/api/financial/balances`
- `GET` `/api/financial/transactions`
- `GET` `/api/financial/verify`
- `GET` `/api/git/branch`
- `POST` `/api/git/commit`
- `POST` `/api/git/pr`
- `POST` `/api/git/push`
- `GET` `/api/git/remote`
- `GET` `/api/git/status`
- `GET` `/api/global`
- `GET` `/api/global-links`
- `GET` `/api/global-news`
- `GET` `/api/health`
- `GET` `/api/health/data`
- `GET` `/api/links`
- `PATCH` `/api/links/[id]/zero-rated`
- `GET` `/api/links/validate`
- `GET` `/api/master/domains`
- `POST` `/api/master/domains/approve/[domain]`
- `POST` `/api/master/domains/emergency-takeover`
- `POST` `/api/master/domains/force-refresh`
- `DELETE` `/api/master/domains/remove/[domain]`
- `GET` `/api/master/domains/status`
- `GET` `/api/master/links`
- `POST` `/api/master/sponsored/add`
- `GET` `/api/master/sponsored/analytics`
- `GET` `/api/master/sponsored/list`
- `DELETE` `/api/master/sponsored/remove/[userId]`
- `GET` `/api/master/sponsored/sync`
- `GET` `/api/master/tracks`
- `GET` `/api/media/generate`
- `GET` `/api/media/status`
- `GET` `/api/metrics`
- `GET` `/api/monitor/status`
- `POST` `/api/mpesa/callback`
- `POST` `/api/notifications/test`
- `POST` `/api/payments/initiate`
- `GET` `/api/platforms`
- `POST` `/api/preview/analyze`
- `POST` `/api/preview/execute-tool`
- `GET` `/api/qapikey`
- `GET` `/api/qcity/audit-log`
- `GET` `/api/qcity/remote-command`
- `POST` `/api/qcity/selfheal-npm`
- `GET` `/api/qcity/status`
- `GET` `/api/qi-spaces`
- `GET` `/api/qi-trading`
- `GET` `/api/qmoi-database`
- `GET` `/api/qmoi-earning-enhanced`
- `GET` `/api/qmoi-gitlab/deployments`
- `GET` `/api/qmoi-gitlab/errors`
- `GET` `/api/qmoi-gitlab/jobs`
- `GET` `/api/qmoi-gitlab/pipelines`
- `POST` `/api/qmoi-gitlab/trigger`
- `GET` `/api/qmoi-model`
- `GET` `/api/qmoi-tracks`
- `GET` `/api/qmoi/advanced-analysis`
- `POST` `/api/qmoi/audio`
- `GET` `/api/qmoi/auto-fix/download-report`
- `GET` `/api/qmoi/auto-fix/github-status`
- `POST` `/api/qmoi/auto-fix/start`
- `GET` `/api/qmoi/auto-fix/status`
- `POST` `/api/qmoi/auto-fix/stop`
- `GET` `/api/qmoi/auto-setup`
- `POST` `/api/qmoi/autodev/generate-feature`
- `POST` `/api/qmoi/autodev/generate-feature`
- `POST` `/api/qmoi/autodev/research`
- `POST` `/api/qmoi/autodev/research`
- `GET` `/api/qmoi/autodev/state`
- `GET` `/api/qmoi/autodev/suggestions/features`
- `GET` `/api/qmoi/autodev/suggestions/improvements`
- `GET` `/api/qmoi/autodev/suggestions/optimizations`
- `POST` `/api/qmoi/autodev/toggle`
- `POST` `/api/qmoi/autodev/toggle`
- `GET` `/api/qmoi/avatars`
- `GET` `/api/qmoi/backup`
- `GET` `/api/qmoi/chat`
- `GET` `/api/qmoi/chat-enhanced`
- `GET` `/api/qmoi/evolution/compare-models`
- `GET` `/api/qmoi/evolution/replace-model`
- `GET` `/api/qmoi/evolution/track-evolution`
- `POST` `/api/qmoi/execute`
- `GET` `/api/qmoi/files/[id]`
- `GET` `/api/qmoi/friendship`
- `GET` `/api/qmoi/health`
- `GET` `/api/qmoi/health/stream`
- `GET` `/api/qmoi/language`
- `GET` `/api/qmoi/master-mode`
- `GET` `/api/qmoi/memory`
- `GET` `/api/qmoi/own-device-logs`
- `POST` `/api/qmoi/own-device-logs/export`
- `GET` `/api/qmoi/profile-questions`
- `GET` `/api/qmoi/projects`
- `GET` `/api/qmoi/research`
- `GET` `/api/qmoi/revenue`
- `GET` `/api/qmoi/revenue-dashboard`
- `POST` `/api/qmoi/revenue/reset`
- `POST` `/api/qmoi/revenue/start`
- `GET` `/api/qmoi/revenue/status`
- `POST` `/api/qmoi/revenue/stop`
- `POST` `/api/qmoi/revenue/target`
- `GET` `/api/qmoi/revenue/transactions`
- `POST` `/api/qmoi/revenue/transfer`
- `POST` `/api/qmoi/self-work/code-review`
- `POST` `/api/qmoi/self-work/debug`
- `POST` `/api/qmoi/self-work/run-tests`
- `GET` `/api/qmoi/session`
- `POST` `/api/qmoi/suggestions`
- `POST` `/api/qmoi/transcribe`
- `POST` `/api/qmoi/upload`
- `GET` `/api/qmoi/user`
- `GET` `/api/qmoi/visuals`
- `GET` `/api/qmoi/voice`
- `POST` `/api/qmoi/voice-enroll`
- `POST` `/api/qmoi/voice-preview`
- `GET` `/api/qmoi/voice-profiles`
- `GET` `/api/qnews`
- `GET` `/api/qradio`
- `GET` `/api/qstore`
- `GET` `/api/qvillage`
- `GET` `/api/qvillage/inference`
- `GET` `/api/qvillage/model-card`
- `GET` `/api/qvillage/models`
- `GET` `/api/qvillage/spaces`
- `GET` `/api/qvs`
- `GET` `/api/realtime/stream`
- `GET` `/api/social-automation`
- `POST` `/api/ssh/list`
- `POST` `/api/ssh/read`
- `POST` `/api/ssh/write`
- `GET` `/api/subscriptions`
- `GET` `/api/tracks`
- `DELETE` `/api/tracks/[id]`
- `GET` `/api/tracks/settings`
- `GET` `/api/tracks/stream`
- `GET` `/api/trading/status`
- `GET` `/api/transactions`
- `GET` `/api/tts/generate`
- `GET` `/api/tts/stream`
- `GET` `/api/users/profile`
- `GET` `/api/v1/health`
- `GET` `/api/v2/health`
- `GET` `/api/version`
- `POST` `/api/voice/enroll`
- `POST` `/api/voice/verify`
- `GET` `/api/wallets`
- `GET` `/api/wallets/[walletId]`
- `POST` `/api/webauthn/authenticate`
- `POST` `/api/webauthn/register`
- `GET` `/api/webhooks/payments`
- `POST` `/api/webhooks/qvillage`
- `POST` `/api/whatsapp-bot`
- `GET` `/api/whatsapp-business`
- `GET` `/api/whatsapp/audit`
- `GET` `/api/whatsapp/verify`
- `GET` `/api/wifi`
- `GET` `/api/wifi-security`
- `GET` `/api/wifi/scan`
- `GET` `/api/youtube/download`

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

All endpoints are rate-limited to prevent abuse:
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- Master endpoints: 10000 requests per minute

## Version Info

- **API Version**: v1
- **Compatibility**: Node.js 18+
- **Framework**: Next.js 13+

## Last Update

- **Date**: 2026-04-01
- **By**: `scripts/comprehensive_docs_update.py`
- **Analysis**: Auto-generated from routing structure

---

Generated by QMOI Continuous Documentation System


## AUTO-GENERATED ENDPOINTS

- /api/account-automation
- /api/accountability
- /api/accountability
- /api/admin/alerts
- /api/admin/audit-logs
- /api/admin/autofix/automation
- /api/admin/autofix/autoscan
- /api/admin/autofix/background-automation
- /api/admin/autofix/bootstrap
- /api/admin/autofix/config
- /api/admin/autofix/errors
- /api/admin/autofix/fix-all
- /api/admin/autofix/fix/{errorId}
- /api/admin/autofix/health
- /api/admin/autofix/healthmonitor
- /api/admin/autofix/scan
- /api/admin/autofix/stream
- /api/admin/dashboard
- /api/admin/financial/global
- /api/admin/financial/summary
- /api/admin/master/auth
- /api/admin/master/logout
- /api/admin/metrics
- /api/admin/monitoring
- /api/admin/rate-limits
- /api/admin/tracing
- /api/admin/users
- /api/ai
- /api/ai-anomaly-service
- /api/ai-health
- /api/ai-self-diagnostics
- /api/ai/scan
- /api/alerts/webhook
- /api/analytics/transactions
- /api/analytics/wallets
- /api/auth/biometric/capture
- /api/auth/login
- /api/auth/login
- /api/auth/oauth/{provider}
- /api/auth/profile
- /api/auth/refresh
- /api/auth/register
- /api/auth/settings
- /api/auth/signin
- /api/auth/signup
- /api/auth/verify
- /api/auth/verify-email
- /api/auth/webauthn/auth/finish
- /api/auth/webauthn/auth/options
- /api/auth/webauthn/authenticate
- /api/auth/webauthn/register
- /api/auth/webauthn/register/finish
- /api/auth/webauthn/register/options
- /api/automation/status
- /api/automation/trigger
- /api/avatars/{userId}
- /api/biometric/templates
- /api/biometric/verify
- /api/cashon
- /api/cashon/balance
- /api/cashon/deposit
- /api/cashon/signals
- /api/cashon/start-trading
- /api/cashon/stop-trading
- /api/cashon/trading-status
- /api/chat/enhanced
- /api/consciousness
- /api/consciousness/health
- /api/datasets
- /api/datasets/settings
- /api/datasets/{id}
- /api/debug/users
- /api/deploy
- /api/deploy/auto-redeploy
- /api/deployment-status
- /api/device-fingerprint
- /api/document-backup
- /api/domains
- /api/domains/health
- /api/earning
- /api/emails
- /api/emergency/config
- /api/emergency/dispatch
- /api/emergency/email
- /api/emergency/lockdown
- /api/emergency/sms
- /api/emergency/wipe
- /api/employment
- /api/employment/megavault
- /api/employment/payment
- /api/employment/revenue
- /api/enhanced-email/analytics
- /api/enhanced-email/realtime
- /api/enhanced-email/rules
- /api/enhanced-email/send
- /api/enhanced-email/templates
- /api/enhanced-link-domain
- /api/evolution/autoclone-evolution
- /api/evolution/platform-evolution
- /api/files
- /api/financial/audit
- /api/financial/balances
- /api/financial/transactions
- /api/financial/verify
- /api/git/branch
- /api/git/commit
- /api/git/pr
- /api/git/push
- /api/git/remote
- /api/git/status
- /api/global
- /api/global-links
- /api/global-news
- /api/health
- /api/health/data
- /api/links
- /api/links/validate
- /api/links/{id}/zero-rated
- /api/master/domains
- /api/master/domains/approve/{domain}
- /api/master/domains/emergency-takeover
- /api/master/domains/force-refresh
- /api/master/domains/remove/{domain}
- /api/master/domains/status
- /api/master/links
- /api/master/sponsored/add
- /api/master/sponsored/analytics
- /api/master/sponsored/list
- /api/master/sponsored/remove/{userId}
- /api/master/sponsored/sync
- /api/master/tracks
- /api/media/generate
- /api/media/status
- /api/metrics
- /api/monitor/status
- /api/mpesa/callback
- /api/notifications/test
- /api/payments/initiate
- /api/platforms
- /api/preview/analyze
- /api/preview/execute-tool
- /api/qapikey
- /api/qcity/audit-log
- /api/qcity/remote-command
- /api/qcity/selfheal-npm
- /api/qcity/status
- /api/qi-spaces
- /api/qi-trading
- /api/qmoi-database
- /api/qmoi-earning-enhanced
- /api/qmoi-gitlab/deployments
- /api/qmoi-gitlab/errors
- /api/qmoi-gitlab/jobs
- /api/qmoi-gitlab/pipelines
- /api/qmoi-gitlab/trigger
- /api/qmoi-model
- /api/qmoi-tracks
- /api/qmoi/advanced-analysis
- /api/qmoi/audio
- /api/qmoi/auto-fix/download-report
- /api/qmoi/auto-fix/github-status
- /api/qmoi/auto-fix/start
- /api/qmoi/auto-fix/status
- /api/qmoi/auto-fix/stop
- /api/qmoi/auto-setup
- /api/qmoi/autodev/generate-feature
- /api/qmoi/autodev/generate-feature
- /api/qmoi/autodev/research
- /api/qmoi/autodev/research
- /api/qmoi/autodev/state
- /api/qmoi/autodev/suggestions/features
- /api/qmoi/autodev/suggestions/improvements
- /api/qmoi/autodev/suggestions/optimizations
- /api/qmoi/autodev/toggle
- /api/qmoi/autodev/toggle
- /api/qmoi/avatars
- /api/qmoi/backup
- /api/qmoi/chat
- /api/qmoi/chat-enhanced
- /api/qmoi/evolution/compare-models
- /api/qmoi/evolution/replace-model
- /api/qmoi/evolution/track-evolution
- /api/qmoi/execute
- /api/qmoi/files/{id}
- /api/qmoi/friendship
- /api/qmoi/health
- /api/qmoi/health/stream
- /api/qmoi/language
- /api/qmoi/master-mode
- /api/qmoi/memory
- /api/qmoi/own-device-logs
- /api/qmoi/own-device-logs/export
- /api/qmoi/profile-questions
- /api/qmoi/projects
- /api/qmoi/research
- /api/qmoi/revenue
- /api/qmoi/revenue-dashboard
- /api/qmoi/revenue/reset
- /api/qmoi/revenue/start
- /api/qmoi/revenue/status
- /api/qmoi/revenue/stop
- /api/qmoi/revenue/target
- /api/qmoi/revenue/transactions
- /api/qmoi/revenue/transfer
- /api/qmoi/self-work/code-review
- /api/qmoi/self-work/debug
- /api/qmoi/self-work/run-tests
- /api/qmoi/session
- /api/qmoi/suggestions
- /api/qmoi/transcribe
- /api/qmoi/upload
- /api/qmoi/user
- /api/qmoi/visuals
- /api/qmoi/voice
- /api/qmoi/voice-enroll
- /api/qmoi/voice-preview
- /api/qmoi/voice-profiles
- /api/qnews
- /api/qradio
- /api/qstore
- /api/qvillage
- /api/qvillage/inference
- /api/qvillage/model-card
- /api/qvillage/models
- /api/qvillage/spaces
- /api/qvs
- /api/realtime/stream
- /api/social-automation
- /api/ssh/list
- /api/ssh/read
- /api/ssh/write
- /api/subscriptions
- /api/tracks
- /api/tracks/settings
- /api/tracks/stream
- /api/tracks/{id}
- /api/trading/status
- /api/transactions
- /api/tts/generate
- /api/tts/stream
- /api/users/profile
- /api/v1/health
- /api/v2/health
- /api/version
- /api/voice/enroll
- /api/voice/verify
- /api/wallets
- /api/wallets/{walletId}
- /api/webauthn/authenticate
- /api/webauthn/register
- /api/webhooks/payments
- /api/webhooks/qvillage
- /api/whatsapp-bot
- /api/whatsapp-business
- /api/whatsapp/audit
- /api/whatsapp/verify
- /api/wifi
- /api/wifi-security
- /api/wifi/scan
- /api/youtube/download
