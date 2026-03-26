# QMOI API Documentation

Generated: 2026-03-26 SESSION 2
Last Updated: 2026-03-26 (EVOLUTION & AUTODEV ENHANCED)

## Overview

This document provides comprehensive documentation for all QMOI system APIs. Updated to include Evolution System and Enhanced AutoDev endpoints.

## New in this Session

### Evolution System
- Model replacement engine with autonomous decision making
- Model comparison and metrics tracking
- Evolution history and progress monitoring
- Consciousness-integrated model decision making

### Enhanced AutoDev
- Advanced suggestions for improvements
- Optimization recommendations
- Feature generation suggestions
- Research and insights pipeline

## Authentication

All API endpoints require authentication via JWT tokens.

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure_password"
}
```

## API Endpoints

### Domains APIs

- GET /api/domains/health - Get domain health status
- POST /api/domains/check - Check specific domain
- GET /api/domains/report - Generate domain health report
- POST /api/domains/failover - Initiate domain failover

### Core Engine APIs

#### Consciousness Engine
- GET /api/qmoi-model?consciousness - Get current consciousness state
- POST /api/qmoi-model - Process consciousness actions
  ```json
  {
    "action": "consciousness",
    "data": {
      "thought": "User needs help",
      "context": "UI interaction"
    }
  }
  ```

#### Awareness System
- GET /api/qmoi-model?awareness - Get awareness context
- POST /api/qmoi-model - Process awareness actions
  ```json
  {
    "action": "awareness",
    "data": {
      "user_id": "user123",
      "context": "User is frustrated"
    }
  }
  ```

#### Memory Sync System
- GET /api/qmoi-model?memory - Get memory status
- POST /api/qmoi-model - Process memory actions
  ```json
  {
    "action": "memory",
    "data": {
      "tags": ["urgent", "help"],
      "keyword": "error"
    }
  }
  ```

#### Orchestration Engine
- GET /api/qmoi-model?orchestration - Get orchestration status
- POST /api/qmoi-model - Process orchestration actions
  ```json
  {
    "action": "orchestration",
    "data": {
      "user_id": "user123",
      "device_ids": ["device1", "device2"]
    }
  }
  ```

#### Execution Engine
- GET /api/qmoi-model?execution - Get execution status
- POST /api/qmoi-model - Process execution actions
  ```json
  {
    "action": "execution",
    "data": {
      "type": "app_launch",
      "app": "calculator"
    }
  }
  ```

#### Validation Engine
- GET /api/qmoi-model?validation - Get validation status
- POST /api/qmoi-model - Process validation actions
  ```json
  {
    "action": "validation",
    "data": {
      "type": "code",
      "content": "function test() { return true; }"
    }
  }
  ```

#### Self-Learning Engine
- GET /api/qmoi-model?selfLearning - Get self-learning status
- POST /api/qmoi-model - Process self-learning actions
  ```json
  {
    "action": "selfLearning",
    "data": {
      "topic": "React hooks",
      "difficulty": "intermediate"
    }
  }
  ```

#### Accessibility Engine
- GET /api/qmoi-model?accessibility - Get accessibility status
- POST /api/qmoi-model - Process accessibility actions
  ```json
  {
    "action": "accessibility",
    "data": {
      "request": "describe_screen",
      "format": "voice"
    }
  }
  ```

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
- POST /api/consciousness - Update environment awareness
- POST /api/consciousness - Update user context
- POST /api/consciousness - Update task context
- POST /api/consciousness - Predict user needs

#### Memory Sync System
- GET /api/consciousness?endpoint=memory/get&memory_id=MEMORY_ID - Get specific memory
- GET /api/consciousness?endpoint=memory/user&user_id=USER_ID - Get all user memories
- GET /api/consciousness?endpoint=memory/stats - Get memory statistics
- POST /api/consciousness - Add new memory
- POST /api/consciousness - Update existing memory
- POST /api/consciousness - Delete memory
- POST /api/consciousness - Search memory by tags/keyword
- POST /api/consciousness - Consolidate memory (cleanup/optimize)

#### Orchestration System
- GET /api/consciousness?endpoint=orchestration/stats - Get orchestration statistics
- GET /api/consciousness?endpoint=system/introspect - Get complete system introspection
- POST /api/consciousness - Sync memory to devices
- POST /api/consciousness - Reset entire system

### Health APIs

- GET /api/health/system - System health check
- GET /api/health/domains - Domain health overview
- GET /api/health/production - Production readiness status
- GET /api/health/telemetry - System telemetry data

### Monitoring APIs

- GET /api/monitor/logs - System logs
- GET /api/monitor/metrics - Performance metrics
- GET /api/monitor/alerts - Active alerts
- POST /api/monitor/test - Test monitoring systems

### Automation APIs

- GET /api/auto/status - Automation status
- POST /api/auto/scan - Run production scan
- POST /api/auto/fix - Auto-fix issues
- GET /api/auto/report - Automation report

### Authentication APIs

- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/verify - Verify token
- POST /api/auth/refresh - Refresh token

### Data APIs

- GET /api/data/export - Export system data
- POST /api/data/import - Import data
- GET /api/data/backup - Create backup
- POST /api/data/restore - Restore from backup

### Reports APIs

- GET /api/reports/health - Health reports
- GET /api/reports/production - Production reports
- GET /api/reports/performance - Performance reports
- GET /api/reports/compliance - Compliance reports

### Global Operations APIs

- GET /api/global?action=stats - Get global operations statistics
- GET /api/global?action=countries - List configured countries
- GET /api/global?action=operations - List active/queued operations
- GET /api/global?action=health - Get global system health
- POST /api/global (action=start-operation|bulk-operations|compliance-check|expansion-initiate) - Manage global operations
- PUT /api/global (action=update-config|reset-country) - Update global config or reset country state
- DELETE /api/global?action=stop-operations|clear-completed - Control global operation lifecycle

### QVS (QMOI Virtual System) APIs

- GET /api/qvs?action=stats - Get QVS system statistics
- GET /api/qvs?action=health - Get QVS health snapshot
- POST /api/qvs (action=configure|start-operations|scale-up) - Manage QVS configuration and flow

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed",
  "timestamp": "2026-03-24T19:33:56.507328"
}
```

## Error Handling

Error responses include:

```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2026-03-24T19:33:56.507328"
}
```

## Rate Limiting

- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated requests

## Support

For API support, contact: support@qmoi.com










## AUTO-GENERATED ENDPOINTS

- /api/account-automation
- /api/admin/alerts
- /api/admin/audit-logs
- /api/admin/autofix/automation
- /api/admin/autofix/autoscan
- /api/admin/autofix/background-automation
- /api/admin/autofix/bootstrap
- /api/admin/autofix/config
- /api/admin/autofix/errors
- /api/admin/autofix/fix/{errorId}
- /api/admin/autofix/fix-all
- /api/admin/autofix/health
- /api/admin/autofix/healthmonitor
- /api/admin/autofix/scan
- /api/admin/autofix/stream
- /api/admin/dashboard
- /api/admin/financial/global
- /api/admin/financial/summary
- /api/admin/master/auth
- /api/admin/master/logout
- /api/admin/monitoring
- /api/admin/rate-limits
- /api/admin/users
- /api/ai
- /api/ai/scan
- /api/ai-anomaly-service
- /api/ai-health
- /api/ai-self-diagnostics
- /api/analytics/transactions
- /api/analytics/wallets
- /api/auth/biometric/capture
- /api/auth/login
- /api/auth/profile
- /api/auth/refresh
- /api/auth/register
- /api/auth/settings
- /api/auth/signin
- /api/auth/signup
- /api/auth/verify
- /api/auth/verify-email
- /api/auth/webauthn/authenticate
- /api/auth/webauthn/register
- /api/automation/status
- /api/biometric/templates
- /api/biometric/verify
- /api/cashon/balance
- /api/cashon/deposit
- /api/cashon
- /api/cashon/signals
- /api/cashon/start-trading
- /api/cashon/stop-trading
- /api/cashon/trading-status
- /api/chat/enhanced
- /api/consciousness
- /api/datasets/{id}
- /api/datasets
- /api/datasets/settings
- /api/debug/users
- /api/deploy/auto-redeploy
- /api/deploy
- /api/deployment-status
- /api/device-fingerprint
- /api/document-backup
- /api/domains/health
- /api/domains
- /api/earning
- /api/emails
- /api/emergency/config
- /api/emergency/dispatch
- /api/emergency/email
- /api/emergency/lockdown
- /api/emergency/sms
- /api/emergency/wipe
- /api/employment/megavault
- /api/employment/payment
- /api/employment/revenue
- /api/employment
- /api/enhanced-email/analytics
- /api/enhanced-email/realtime
- /api/enhanced-email/rules
- /api/enhanced-email/send
- /api/enhanced-email/templates
- /api/enhanced-link-domain
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
- /api/global-links
- /api/health/data
- /api/health
- /api/links/{id}/zero-rated
- /api/links
- /api/links/validate
- /api/master/domains/approve/{domain}
- /api/master/domains/emergency-takeover
- /api/master/domains/force-refresh
- /api/master/domains/remove/{domain}
- /api/master/domains
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
- /api/qapikey
- /api/qcity/audit-log
- /api/qcity/remote-command
- /api/qcity/selfheal-npm
- /api/qcity/status
- /api/qi-trading
- /api/qmoi/advanced-analysis
- /api/qmoi/audio
- /api/qmoi/auto-fix/download-report
- /api/qmoi/auto-fix/github-status
- /api/qmoi/auto-fix/start
- /api/qmoi/auto-fix/status
- /api/qmoi/auto-fix/stop
- /api/qmoi/auto-setup
- /api/qmoi/autodev/generate-feature
- /api/qmoi/autodev/research
- /api/qmoi/autodev/toggle
- /api/qmoi/avatars
- /api/qmoi/backup
- /api/qmoi/chat
- /api/qmoi/chat-enhanced
- /api/qmoi/files/{id}
- /api/qmoi/friendship
- /api/qmoi/language
- /api/qmoi/master-mode
- /api/qmoi/memory
- /api/qmoi/own-device-logs/export
- /api/qmoi/own-device-logs
- /api/qmoi/profile-questions
- /api/qmoi/projects
- /api/qmoi/research
- /api/qmoi/revenue/reset
- /api/qmoi/revenue
- /api/qmoi/revenue/start
- /api/qmoi/revenue/status
- /api/qmoi/revenue/stop
- /api/qmoi/revenue/target
- /api/qmoi/revenue/transactions
- /api/qmoi/revenue/transfer
- /api/qmoi/revenue-dashboard
- /api/qmoi/session
- /api/qmoi/transcribe
- /api/qmoi/upload
- /api/qmoi/user
- /api/qmoi/visuals
- /api/qmoi/voice
- /api/qmoi/voice-enroll
- /api/qmoi/voice-preview
- /api/qmoi/voice-profiles
- /api/qmoi-database
- /api/qmoi-earning-enhanced
- /api/qmoi-gitlab/deployments
- /api/qmoi-gitlab/errors
- /api/qmoi-gitlab/jobs
- /api/qmoi-gitlab/pipelines
- /api/qmoi-gitlab/trigger
- /api/qmoi-model
- /api/qmoi-tracks
- /api/qnews
- /api/qradio
- /api/qstore
- /api/qvillage/inference
- /api/qvillage/models
- /api/qvillage
- /api/qvillage/spaces
- /api/social-automation
- /api/ssh/list
- /api/ssh/read
- /api/ssh/write
- /api/tracks/{id}
- /api/tracks
- /api/tracks/settings
- /api/tracks/stream
- /api/trading/status
- /api/transactions
- /api/tts/generate
- /api/tts/stream
- /api/users/profile
- /api/version
- /api/voice/enroll
- /api/voice/verify
- /api/wallets/{walletId}
- /api/wallets
- /api/webauthn/authenticate
- /api/webauthn/register
- /api/webhooks/payments
- /api/webhooks/qvillage
- /api/whatsapp/audit
- /api/whatsapp/verify
- /api/whatsapp-bot
- /api/whatsapp-business
- /api/wifi
- /api/wifi/scan
- /api/wifi-security
- /api/youtube/download

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*
