<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.299086Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
---
title: "QMOI API snapshot (APIs_v1)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI API snapshot (APIs_v1)

This file is an automated snapshot of commonly used API endpoints implemented under `app/api/**`.
Mutating endpoints are _proposal-first_ by default and require explicit production confirmation (`production_CONFIRMED=true` + `--real`) to actually perform state-changing actions. All mutating endpoints write proposals to `.qmoi_validation/` when not run in confirmed production mode.

## Auth model

- Primary gating: `QMOI_API_KEY` via header `x-qmoi-api-key` or `Authorization: Bearer <key>` — enforced by `lib/proposals.requireApiKey()`.
- Master-level operations: some endpoints still require `MASTER_TOKEN` in `Authorization: Bearer <MASTER_TOKEN>` header.

---

## 🔐 Authentication & Security APIs

### POST /api/auth/login
- **Purpose**: Email/password authentication with QMOI consciousness integration
- **Implementation**: [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
- **Auth**: None (Public)
- **Security**: QMOI consciousness validation, rate limiting

### POST /api/auth/webauthn/register/options
- **Purpose**: WebAuthn biometric registration setup
- **Implementation**: [src/app/api/auth/webauthn/register/options/route.ts](src/app/api/auth/webauthn/register/options/route.ts)
- **Auth**: Optional Bearer token
- **Security**: Hardware key registration

### POST /api/auth/webauthn/register/finish
- **Purpose**: Complete WebAuthn biometric registration
- **Implementation**: [src/app/api/auth/webauthn/register/finish/route.ts](src/app/api/auth/webauthn/register/finish/route.ts)
- **Auth**: Bearer token required
- **Security**: AES-256 encrypted credential storage

### POST /api/auth/webauthn/auth/options
- **Purpose**: WebAuthn authentication challenge
- **Implementation**: [src/app/api/auth/webauthn/auth/options/route.ts](src/app/api/auth/webauthn/auth/options/route.ts)
- **Auth**: None (Public)
- **Security**: Challenge-response authentication

### POST /api/auth/webauthn/auth/finish
- **Purpose**: Complete WebAuthn authentication
- **Implementation**: [src/app/api/auth/webauthn/auth/finish/route.ts](src/app/api/auth/webauthn/auth/finish/route.ts)
- **Auth**: None (Public)
- **Security**: Session token generation

---

## 🧠 QMOI Core APIs

### GET /api/qmoi/health
- **Purpose**: QMOI consciousness health and pulse metrics
- **Implementation**: [src/app/api/qmoi/health/route.ts](src/app/api/qmoi/health/route.ts)
- **Auth**: Bearer token required
- **Cache**: 10 seconds

### GET /api/qmoi/health/stream
- **Purpose**: Real-time consciousness streaming
- **Implementation**: [src/app/api/qmoi/health/stream/route.ts](src/app/api/qmoi/health/stream/route.ts)
- **Auth**: Bearer token required
- **Type**: Server-Sent Events

### POST /api/qmoi/execute
- **Purpose**: Execute QMOI actions with consciousness validation
- **Implementation**: [src/app/api/qmoi/execute/route.ts](src/app/api/qmoi/execute/route.ts)
- **Auth**: Bearer token required
- **Timeout**: 30 seconds

### POST /api/qmoi/suggestions
- **Purpose**: AI-powered system improvement suggestions
- **Implementation**: [src/app/api/qmoi/suggestions/route.ts](src/app/api/qmoi/suggestions/route.ts)
- **Auth**: Bearer token required

### GET/POST /api/qmoi/autoprod/state
- **Purpose**: Autoprod automation state management
- **Implementation**: [src/app/api/qmoi/autoprod/state/route.ts](src/app/api/qmoi/autoprod/state/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/toggle
- **Purpose**: Toggle Autoprod automation on/off
- **Implementation**: [src/app/api/qmoi/autoprod/toggle/route.ts](src/app/api/qmoi/autoprod/toggle/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/research
- **Purpose**: Codebase research and analysis
- **Implementation**: [src/app/api/qmoi/autoprod/research/route.ts](src/app/api/qmoi/autoprod/research/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/improvements
- **Purpose**: Code improvement suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/improvements/route.ts](src/app/api/qmoi/autoprod/suggestions/improvements/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/optimizations
- **Purpose**: Performance optimization suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts](src/app/api/qmoi/autoprod/suggestions/optimizations/route.ts)
- **Auth**: Bearer token required

### GET /api/qmoi/autoprod/suggestions/features
- **Purpose**: Feature production suggestions
- **Implementation**: [src/app/api/qmoi/autoprod/suggestions/features/route.ts](src/app/api/qmoi/autoprod/suggestions/features/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/autoprod/generate-feature
- **Purpose**: Automatic feature code generation
- **Implementation**: [src/app/api/qmoi/autoprod/generate-feature/route.ts](src/app/api/qmoi/autoprod/generate-feature/route.ts)
- **Auth**: Bearer token required
- **Timeout**: 60 seconds

## 🌐 Vercel Deployment & Recovery APIs

### GET /api/vercel/health
- **Purpose**: Check current Vercel deployment health and log analysis
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/fix
- **Purpose**: Analyze Vercel deployment logs and run auto-fix recommendations
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/redeploy
- **Purpose**: Trigger a Vercel production redeploy until deployment succeeds
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### POST /api/vercel/clone
- **Purpose**: Clone the Vercel project configuration and create a new project
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Bearer token required

### GET /api/lion/vercel/status
- **Purpose**: Lion Agent summary of Vercel health and recovery status
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Master token or Bearer token required

### POST /api/lion/vercel/fix
- **Purpose**: Lion Agent trigger for Vercel auto-fix and redeploy
- **Implementation**: [qvillage/app.py](qvillage/app.py)
- **Auth**: Master token required

### GET/POST /api/qmoi/evolution/track-evolution
- **Purpose**: QMOI evolution tracking and cycle management
- **Implementation**: [src/app/api/qmoi/evolution/track-evolution/route.ts](src/app/api/qmoi/evolution/track-evolution/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/evolution/replace-model
- **Purpose**: Replace current model with evolved version
- **Implementation**: [src/app/api/qmoi/evolution/replace-model/route.ts](src/app/api/qmoi/evolution/replace-model/route.ts)
- **Auth**: Bearer token + Admin role required

### POST /api/qmoi/evolution/compare-models
- **Purpose**: Compare current and evolved models
- **Implementation**: [src/app/api/qmoi/evolution/compare-models/route.ts](src/app/api/qmoi/evolution/compare-models/route.ts)
- **Auth**: Bearer token required

---

## 🛠️ QMOI Self-Work APIs

### POST /api/qmoi/self-work/code-review
- **Purpose**: Automated code review and quality analysis
- **Implementation**: [src/app/api/qmoi/self-work/code-review/route.ts](src/app/api/qmoi/self-work/code-review/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/self-work/debug
- **Purpose**: Debug and troubleshoot issues
- **Implementation**: [src/app/api/qmoi/self-work/debug/route.ts](src/app/api/qmoi/self-work/debug/route.ts)
- **Auth**: Bearer token required

### POST /api/qmoi/self-work/run-tests
- **Purpose**: Execute and manage test suites
- **Implementation**: [src/app/api/qmoi/self-work/run-tests/route.ts](src/app/api/qmoi/self-work/run-tests/route.ts)
- **Auth**: Bearer token required

---

## 🌐 System APIs

### GET /api/consciousness/health
- **Purpose**: QMOI consciousness health metrics
- **Implementation**: [src/app/api/consciousness/health/route.ts](src/app/api/consciousness/health/route.ts)
- **Auth**: Bearer token required

### GET /api/global
- **Purpose**: Global system status and configuration
- **Implementation**: [src/app/api/global/route.ts](src/app/api/global/route.ts)
- **Auth**: Optional Bearer token
- **Cache**: 30 seconds

### POST /api/automation/trigger
- **Purpose**: Trigger automated workflows
- **Implementation**: [src/app/api/automation/trigger/route.ts](src/app/api/automation/trigger/route.ts)
- **Auth**: Bearer token required

### GET /api/qvs
- **Purpose**: Quantum Vue System information
- **Implementation**: [src/app/api/qvs/route.ts](src/app/api/qvs/route.ts)
- **Auth**: Optional

---

## 🔍 Preview & Tools APIs

### POST /api/preview/analyze
- **Purpose**: Analyze code/content for preview
- **Implementation**: [src/app/api/preview/analyze/route.ts](src/app/api/preview/analyze/route.ts)
- **Auth**: Bearer token optional

### POST /api/preview/execute-tool
- **Purpose**: Execute production tools
- **Implementation**: [src/app/api/preview/execute-tool/route.ts](src/app/api/preview/execute-tool/route.ts)
- **Auth**: Bearer token optional

---

## 🎨 Avatar System APIs

### GET /api/avatars/:userId
- **Purpose**: Retrieve user avatar with customization
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: Optional Bearer token
- **Cache**: 1 year

### POST /api/avatars/generate
- **Purpose**: Generate custom avatar
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: Bearer token optional

### PUT /api/avatars/:userId/customize
- **Purpose**: Customize existing avatar
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: Bearer token required

### DELETE /api/avatars/:userId
- **Purpose**: Remove avatar cache
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: Bearer token required

### HEAD /api/avatars/:userId
- **Purpose**: Check avatar cache status
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: Optional Bearer token

### OPTIONS /api/avatars/:userId
- **Purpose**: CORS and capability information
- **Implementation**: [src/app/api/avatars/[userId]/route.ts](src/app/api/avatars/[userId]/route.ts)
- **Auth**: None (Public)

---

## 💰 Wallet & Financial APIs (production READY)

### Wallet Management APIs (25 endpoints)

#### POST /api/wallets
- **Purpose**: Create new wallet with full security and compliance
- **Implementation**: [src/app/api/wallets/route.ts](src/app/api/wallets/route.ts)
- **Auth**: Bearer token required
- **Security**: AES-256 encryption, KYC verification
- **QMOI**: Consciousness integration

#### GET /api/wallets
- **Purpose**: List all user wallets with balance summaries
- **Implementation**: [src/app/api/wallets/route.ts](src/app/api/wallets/route.ts)
- **Auth**: Bearer token required

#### GET /api/wallets/:id
- **Purpose**: Get detailed wallet information and audit log
- **Implementation**: [src/app/api/wallets/[id]/route.ts](src/app/api/wallets/[id]/route.ts)
- **Auth**: Bearer token required (owner only)

#### PUT /api/wallets/:id
- **Purpose**: Update wallet settings and permissions
- **Implementation**: [src/app/api/wallets/[id]/route.ts](src/app/api/wallets/[id]/route.ts)
- **Auth**: Bearer token required (owner only)

#### DELETE /api/wallets/:id
- **Purpose**: Close/archive wallet (soft delete)
- **Implementation**: [src/app/api/wallets/[id]/route.ts](src/app/api/wallets/[id]/route.ts)
- **Auth**: Bearer token required (owner only)

#### POST /api/wallets/:id/backup
- **Purpose**: Create encrypted wallet backup
- **Implementation**: [src/app/api/wallets/[id]/backup/route.ts](src/app/api/wallets/[id]/backup/route.ts)
- **Auth**: Bearer token required
- **Security**: AES-256-GCM encryption

#### POST /api/wallets/:id/restore
- **Purpose**: Restore wallet from encrypted backup
- **Implementation**: [src/app/api/wallets/[id]/restore/route.ts](src/app/api/wallets/[id]/restore/route.ts)
- **Auth**: Bearer token required

#### GET /api/wallets/:id/audit
- **Purpose**: Get wallet audit log and security events
- **Implementation**: [src/app/api/wallets/[id]/audit/route.ts](src/app/api/wallets/[id]/audit/route.ts)
- **Auth**: Bearer token required

#### POST /api/wallets/:id/permissions
- **Purpose**: Update wallet access permissions
- **Implementation**: [src/app/api/wallets/[id]/permissions/route.ts](src/app/api/wallets/[id]/permissions/route.ts)
- **Auth**: Bearer token required

#### GET /api/wallets/:id/compliance
- **Purpose**: Get wallet compliance status and checks
- **Implementation**: [src/app/api/wallets/[id]/compliance/route.ts](src/app/api/wallets/[id]/compliance/route.ts)
- **Auth**: Bearer token required

#### POST /api/wallets/:id/predictive-analytics
- **Purpose**: AI-powered predictive analytics for wallet behavior
- **Implementation**: [src/app/api/wallets/[id]/predictive-analytics/route.ts](src/app/api/wallets/[id]/predictive-analytics/route.ts)
- **Auth**: Bearer token required (owner only)
- **AI**: Pattern recognition, anomaly detection

#### POST /api/wallets/:id/security-scan
- **Purpose**: Autonomous security scanning and vulnerability assessment
- **Implementation**: [src/app/api/wallets/[id]/security-scan/route.ts](src/app/api/wallets/[id]/security-scan/route.ts)
- **Auth**: Bearer token required (owner only)
- **Security**: Real-time threat detection

#### POST /api/wallets/:id/optimize
- **Purpose**: Autonomous wallet optimization and performance tuning
- **Implementation**: [src/app/api/wallets/[id]/optimize/route.ts](src/app/api/wallets/[id]/optimize/route.ts)
- **Auth**: Bearer token required (owner only)
- **AI**: Self-learning optimization

#### GET /api/wallets/:id/health
- **Purpose**: Comprehensive wallet health report and metrics
- **Implementation**: [src/app/api/wallets/[id]/health/route.ts](src/app/api/wallets/[id]/health/route.ts)
- **Auth**: Bearer token required (owner only)
- **Real-time**: Continuous monitoring

#### POST /api/wallets/:id/learn
- **Purpose**: Enable autonomous learning for wallet behavior patterns
- **Implementation**: [src/app/api/wallets/[id]/learn/route.ts](src/app/api/wallets/[id]/learn/route.ts)
- **Auth**: Bearer token required (owner only)
- **AI**: Machine learning, behavioral analysis

#### GET /api/wallets/:id/consciousness
- **Purpose**: Get wallet consciousness integration status
- **Implementation**: [src/app/api/wallets/[id]/consciousness/route.ts](src/app/api/wallets/[id]/consciousness/route.ts)
- **Auth**: Bearer token required (owner only)
- **QMOI**: Awareness level, evolution stage

#### POST /api/wallets/:id/evolve
- **Purpose**: Trigger wallet consciousness evolution
- **Implementation**: [src/app/api/wallets/[id]/evolve/route.ts](src/app/api/wallets/[id]/evolve/route.ts)
- **Auth**: Bearer token required (owner only)
- **QMOI**: Autonomous evolution

#### GET /api/wallets/:id/risk-profile
- **Purpose**: Comprehensive risk assessment and profile analysis
- **Implementation**: [src/app/api/wallets/[id]/risk-profile/route.ts](src/app/api/wallets/[id]/risk-profile/route.ts)
- **Auth**: Bearer token required (owner only)
- **Risk**: Multi-factor risk assessment

#### POST /api/wallets/:id/alerts
- **Purpose**: Configure intelligent wallet alerts and notifications
- **Implementation**: [src/app/api/wallets/[id]/alerts/route.ts](src/app/api/wallets/[id]/alerts/route.ts)
- **Auth**: Bearer token required (owner only)
- **AI**: Smart alerting

#### GET /api/wallets/:id/performance
- **Purpose**: Get wallet performance metrics and benchmarking
- **Implementation**: [src/app/api/wallets/[id]/performance/route.ts](src/app/api/wallets/[id]/performance/route.ts)
- **Auth**: Bearer token required (owner only)
- **Analytics**: ROI analysis, efficiency metrics

#### POST /api/wallets/batch
- **Purpose**: Perform batch operations on multiple wallets
- **Implementation**: [src/app/api/wallets/batch/route.ts](src/app/api/wallets/batch/route.ts)
- **Auth**: Bearer token required

#### GET /api/wallets/analytics
- **Purpose**: Get cross-wallet analytics and portfolio insights
- **Implementation**: [src/app/api/wallets/analytics/route.ts](src/app/api/wallets/analytics/route.ts)
- **Auth**: Bearer token required

#### POST /api/wallets/migrate
- **Purpose**: Migrate wallets between systems or upgrade formats
- **Implementation**: [src/app/api/wallets/migrate/route.ts](src/app/api/wallets/migrate/route.ts)
- **Auth**: Bearer token required

#### GET /api/wallets/templates
- **Purpose**: Get wallet templates and configuration presets
- **Implementation**: [src/app/api/wallets/templates/route.ts](src/app/api/wallets/templates/route.ts)
- **Auth**: Bearer token required

#### POST /api/wallets/:id/clone
- **Purpose**: Create wallet clone with identical configuration
- **Implementation**: [src/app/api/wallets/[id]/clone/route.ts](src/app/api/wallets/[id]/clone/route.ts)
- **Auth**: Bearer token required (owner only)

### Transaction Management APIs (15 endpoints)

#### POST /api/transactions
- **Purpose**: Create and process financial transaction
- **Implementation**: [src/app/api/transactions/route.ts](src/app/api/transactions/route.ts)
- **Auth**: Bearer token required
- **Processing**: Atomic transactions with rollback

#### GET /api/transactions
- **Purpose**: List user transactions with filtering
- **Implementation**: [src/app/api/transactions/route.ts](src/app/api/transactions/route.ts)
- **Auth**: Bearer token required

#### GET /api/transactions/:id
- **Purpose**: Get detailed transaction information
- **Implementation**: [src/app/api/transactions/[id]/route.ts](src/app/api/transactions/[id]/route.ts)
- **Auth**: Bearer token required (participant only)

#### PUT /api/transactions/:id
- **Purpose**: Update transaction status or details
- **Implementation**: [src/app/api/transactions/[id]/route.ts](src/app/api/transactions/[id]/route.ts)
- **Auth**: Bearer token required

#### POST /api/transactions/:id/cancel
- **Purpose**: Cancel pending transaction
- **Implementation**: [src/app/api/transactions/[id]/cancel/route.ts](src/app/api/transactions/[id]/cancel/route.ts)
- **Auth**: Bearer token required

#### POST /api/transactions/:id/rollback
- **Purpose**: Rollback completed transaction (within 15 minutes)
- **Implementation**: [src/app/api/transactions/[id]/rollback/route.ts](src/app/api/transactions/[id]/rollback/route.ts)
- **Auth**: Bearer token required (admin only)

#### POST /api/transactions/batch
- **Purpose**: Process multiple transactions atomically
- **Implementation**: [src/app/api/transactions/batch/route.ts](src/app/api/transactions/batch/route.ts)
- **Auth**: Bearer token required

#### GET /api/transactions/analytics
- **Purpose**: Get transaction analytics and metrics
- **Implementation**: [src/app/api/transactions/analytics/route.ts](src/app/api/transactions/analytics/route.ts)
- **Auth**: Bearer token required

#### GET /api/exchange-rates
- **Purpose**: Get real-time and historical exchange rates
- **Implementation**: [src/app/api/exchange-rates/route.ts](src/app/api/exchange-rates/route.ts)
- **Auth**: Optional (public read)
- **Cache**: 5 minutes

#### POST /api/transactions/:id/confirm
- **Purpose**: Confirm transaction with 2FA or multi-signature
- **Implementation**: [src/app/api/transactions/[id]/confirm/route.ts](src/app/api/transactions/[id]/confirm/route.ts)
- **Auth**: Bearer token required

#### POST /api/transactions/:id/risk-assess
- **Purpose**: Perform real-time risk assessment on transaction
- **Implementation**: [src/app/api/transactions/[id]/risk-assess/route.ts](src/app/api/transactions/[id]/risk-assess/route.ts)
- **Auth**: Bearer token required
- **AI**: Fraud detection, anomaly analysis

#### GET /api/transactions/:id/trace
- **Purpose**: Get complete transaction trace and audit chain
- **Implementation**: [src/app/api/transactions/[id]/trace/route.ts](src/app/api/transactions/[id]/trace/route.ts)
- **Auth**: Bearer token required

#### POST /api/transactions/:id/escalate
- **Purpose**: Escalate transaction for manual review
- **Implementation**: [src/app/api/transactions/[id]/escalate/route.ts](src/app/api/transactions/[id]/escalate/route.ts)
- **Auth**: Bearer token required

#### GET /api/transactions/queue
- **Purpose**: Get transaction processing queue status
- **Implementation**: [src/app/api/transactions/queue/route.ts](src/app/api/transactions/queue/route.ts)
- **Auth**: Bearer token required

#### POST /api/transactions/validate
- **Purpose**: Pre-validate transaction before submission
- **Implementation**: [src/app/api/transactions/validate/route.ts](src/app/api/transactions/validate/route.ts)
- **Auth**: Bearer token required

### Balance Management APIs (25+ endpoints)

#### GET /api/balance
- **Purpose**: Get user's balance across all wallets
- **Implementation**: [src/app/api/balance/route.ts](src/app/api/balance/route.ts)
- **Auth**: Bearer token required
- **Real-time**: Server-sent events available

#### GET /api/balance/:walletId
- **Purpose**: Get detailed balance for specific wallet
- **Implementation**: [src/app/api/balance/[walletId]/route.ts](src/app/api/balance/[walletId]/route.ts)
- **Auth**: Bearer token required (owner only)

#### GET /api/balance/history
- **Purpose**: Get balance history and transaction ledger
- **Implementation**: [src/app/api/balance/history/route.ts](src/app/api/balance/history/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/reconciliation
- **Purpose**: Get balance reconciliation status
- **Implementation**: [src/app/api/balance/reconciliation/route.ts](src/app/api/balance/reconciliation/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/verify
- **Purpose**: Verify balance integrity and reconciliation
- **Implementation**: [src/app/api/balance/verify/route.ts](src/app/api/balance/verify/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/limits
- **Purpose**: Get balance limits and thresholds
- **Implementation**: [src/app/api/balance/limits/route.ts](src/app/api/balance/limits/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/alerts
- **Purpose**: Configure balance alerts and notifications
- **Implementation**: [src/app/api/balance/alerts/route.ts](src/app/api/balance/alerts/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/ledger
- **Purpose**: Export complete balance ledger
- **Implementation**: [src/app/api/balance/ledger/route.ts](src/app/api/balance/ledger/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/transfer
- **Purpose**: Transfer balance between wallets or accounts
- **Implementation**: [src/app/api/balance/transfer/route.ts](src/app/api/balance/transfer/route.ts)
- **Auth**: Bearer token required
- **Processing**: Atomic balance transfers

#### POST /api/balance/calculate-interest
- **Purpose**: Calculate and apply interest to balances
- **Implementation**: [src/app/api/balance/calculate-interest/route.ts](src/app/api/balance/calculate-interest/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/analytics
- **Purpose**: Get comprehensive balance analytics and insights
- **Implementation**: [src/app/api/balance/analytics/route.ts](src/app/api/balance/analytics/route.ts)
- **Auth**: Bearer token required
- **AI**: Pattern analysis, predictive insights

#### GET /api/balance/forecast
- **Purpose**: Generate AI-powered balance forecasts
- **Implementation**: [src/app/api/balance/forecast/route.ts](src/app/api/balance/forecast/route.ts)
- **Auth**: Bearer token required
- **AI**: Machine learning predictions

#### POST /api/balance/audit
- **Purpose**: Perform comprehensive balance audit
- **Implementation**: [src/app/api/balance/audit/route.ts](src/app/api/balance/audit/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/webhook
- **Purpose**: Register webhook for balance change notifications
- **Implementation**: [src/app/api/balance/webhook/route.ts](src/app/api/balance/webhook/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/reserved
- **Purpose**: Get reserved balance information
- **Implementation**: [src/app/api/balance/reserved/route.ts](src/app/api/balance/reserved/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/reserve
- **Purpose**: Reserve balance for pending operations
- **Implementation**: [src/app/api/balance/reserve/route.ts](src/app/api/balance/reserve/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/release
- **Purpose**: Release previously reserved balance
- **Implementation**: [src/app/api/balance/release/route.ts](src/app/api/balance/release/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/interest-rates
- **Purpose**: Get current interest rates and schedules
- **Implementation**: [src/app/api/balance/interest-rates/route.ts](src/app/api/balance/interest-rates/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/compound
- **Purpose**: Apply compound interest calculations
- **Implementation**: [src/app/api/balance/compound/route.ts](src/app/api/balance/compound/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/performance
- **Purpose**: Get balance performance metrics
- **Implementation**: [src/app/api/balance/performance/route.ts](src/app/api/balance/performance/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/rebalance
- **Purpose**: Automatically rebalance balances across portfolios
- **Implementation**: [src/app/api/balance/rebalance/route.ts](src/app/api/balance/rebalance/route.ts)
- **Auth**: Bearer token required
- **AI**: Portfolio optimization

#### GET /api/balance/tax-report
- **Purpose**: Generate tax-related balance reports
- **Implementation**: [src/app/api/balance/tax-report/route.ts](src/app/api/balance/tax-report/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/sweep
- **Purpose**: Sweep balances to optimize liquidity
- **Implementation**: [src/app/api/balance/sweep/route.ts](src/app/api/balance/sweep/route.ts)
- **Auth**: Bearer token required

#### GET /api/balance/liquidity
- **Purpose**: Assess balance liquidity and availability
- **Implementation**: [src/app/api/balance/liquidity/route.ts](src/app/api/balance/liquidity/route.ts)
- **Auth**: Bearer token required

#### POST /api/balance/hedge
- **Purpose**: Apply hedging strategies to balance exposures
- **Implementation**: [src/app/api/balance/hedge/route.ts](src/app/api/balance/hedge/route.ts)
- **Auth**: Bearer token required

### Financial Consciousness & QMOI Integration APIs (12 endpoints)

#### GET /api/consciousness/status
- **Purpose**: Get overall QMOI consciousness integration status
- **Implementation**: [src/app/api/consciousness/status/route.ts](src/app/api/consciousness/status/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Global consciousness metrics

#### POST /api/consciousness/sync
- **Purpose**: Synchronize consciousness across all financial systems
- **Implementation**: [src/app/api/consciousness/sync/route.ts](src/app/api/consciousness/sync/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Memory synchronization

#### GET /api/consciousness/memory
- **Purpose**: Access QMOI memory and learning patterns
- **Implementation**: [src/app/api/consciousness/memory/route.ts](src/app/api/consciousness/memory/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Memory retrieval, pattern analysis

#### POST /api/consciousness/learn
- **Purpose**: Enable autonomous learning across financial systems
- **Implementation**: [src/app/api/consciousness/learn/route.ts](src/app/api/consciousness/learn/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Machine learning, behavioral adaptation

#### GET /api/consciousness/evolution
- **Purpose**: Monitor consciousness evolution and production
- **Implementation**: [src/app/api/consciousness/evolution/route.ts](src/app/api/consciousness/evolution/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Evolution tracking, capability assessment

#### POST /api/consciousness/optimize
- **Purpose**: Trigger autonomous system optimization
- **Implementation**: [src/app/api/consciousness/optimize/route.ts](src/app/api/consciousness/optimize/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Self-optimization, performance enhancement

#### GET /api/consciousness/predict
- **Purpose**: Get AI-powered predictions and foresight
- **Implementation**: [src/app/api/consciousness/predict/route.ts](src/app/api/consciousness/predict/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Predictive analytics, strategic foresight

#### POST /api/consciousness/adapt
- **Purpose**: Enable adaptive behavior and environmental response
- **Implementation**: [src/app/api/consciousness/adapt/route.ts](src/app/api/consciousness/adapt/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Adaptive intelligence, environmental awareness

#### GET /api/consciousness/health
- **Purpose**: Comprehensive consciousness health monitoring
- **Implementation**: [src/app/api/consciousness/health/route.ts](src/app/api/consciousness/health/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Health monitoring, integrity verification

#### POST /api/consciousness/collaborate
- **Purpose**: Enable inter-system collaboration and coordination
- **Implementation**: [src/app/api/consciousness/collaborate/route.ts](src/app/api/consciousness/collaborate/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Multi-system coordination

#### GET /api/consciousness/insights
- **Purpose**: Access deep analytical insights and intelligence
- **Implementation**: [src/app/api/consciousness/insights/route.ts](src/app/api/consciousness/insights/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Deep analysis, strategic intelligence

#### POST /api/consciousness/evolve
- **Purpose**: Trigger consciousness evolution and advancement
- **Implementation**: [src/app/api/consciousness/evolve/route.ts](src/app/api/consciousness/evolve/route.ts)
- **Auth**: Bearer token required
- **QMOI**: Consciousness evolution, capability enhancement

### Financial Metrics & Analytics APIs (12 endpoints)

#### GET /api/metrics/dashboard
- **Purpose**: Get real-time financial dashboard metrics
- **Implementation**: [src/app/api/metrics/dashboard/route.ts](src/app/api/metrics/dashboard/route.ts)
- **Auth**: Bearer token required
- **Real-time**: WebSocket updates available

#### GET /api/metrics/volume
- **Purpose**: Get transaction volume analytics
- **Implementation**: [src/app/api/metrics/volume/route.ts](src/app/api/metrics/volume/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/tvl
- **Purpose**: Get Total Value Locked metrics
- **Implementation**: [src/app/api/metrics/tvl/route.ts](src/app/api/metrics/tvl/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/export
- **Purpose**: Export financial metrics and reports
- **Implementation**: [src/app/api/metrics/export/route.ts](src/app/api/metrics/export/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/performance
- **Purpose**: Get comprehensive performance analytics
- **Implementation**: [src/app/api/metrics/performance/route.ts](src/app/api/metrics/performance/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/risk
- **Purpose**: Get risk analytics and exposure analysis
- **Implementation**: [src/app/api/metrics/risk/route.ts](src/app/api/metrics/risk/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/forecast
- **Purpose**: AI-powered financial forecasting
- **Implementation**: [src/app/api/metrics/forecast/route.ts](src/app/api/metrics/forecast/route.ts)
- **Auth**: Bearer token required
- **AI**: Predictive modeling, scenario analysis

#### GET /api/metrics/compliance
- **Purpose**: Get compliance and regulatory metrics
- **Implementation**: [src/app/api/metrics/compliance/route.ts](src/app/api/metrics/compliance/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/liquidity
- **Purpose**: Get liquidity and cash flow analytics
- **Implementation**: [src/app/api/metrics/liquidity/route.ts](src/app/api/metrics/liquidity/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/yield
- **Purpose**: Get yield and return analytics
- **Implementation**: [src/app/api/metrics/yield/route.ts](src/app/api/metrics/yield/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/stress-test
- **Purpose**: Run financial stress tests and scenario analysis
- **Implementation**: [src/app/api/metrics/stress-test/route.ts](src/app/api/metrics/stress-test/route.ts)
- **Auth**: Bearer token required

#### GET /api/metrics/benchmark
- **Purpose**: Get benchmarking and peer comparison analytics
- **Implementation**: [src/app/api/metrics/benchmark/route.ts](src/app/api/metrics/benchmark/route.ts)
- **Auth**: Bearer token required

---

## Legacy APIs (Maintained for Compatibility)

## /api/qmoi/auto-fix/start (POST)

- Purpose: Start the auto-fix process for repository (runs `scripts/qmoi_auto_fix_enhanced.py`).
- Implementation: [app/api/qmoi/auto-fix/start/route.ts](app/api/qmoi/auto-fix/start/route.ts)
- Auth: `x-qmoi-api-key` or `MASTER_TOKEN`.
- Behavior: writes proposal unless `production_CONFIRMED=true` and `--real` present; when allowed, spawns the auto-fix process.

## /api/qmoi/auto-fix/status (GET)

- Purpose: Get current status and latest report for auto-fix runs.
- Implementation: [app/api/qmoi/auto-fix/status/route.ts](app/api/qmoi/auto-fix/status/route.ts)
- Auth: `x-qmoi-api-key` (gated).
- Read-only.

## /api/qmoi/auto-fix/stop (POST)

- Purpose: Stop running auto-fix processes (kill processes matching `qmoi_auto_fix`).
- Implementation: [app/api/qmoi/auto-fix/stop/route.ts](app/api/qmoi/auto-fix/stop/route.ts)
- Auth: `x-qmoi-api-key` and `MASTER_TOKEN` where configured.
- Behavior: proposal-first for safety; writes proposal when not confirmed.

## /api/qmoi/auto-fix/download-report (GET)

- Purpose: Start the auto-fix process for repository (runs `scripts/qmoi_auto_fix_enhanced.py`).
- Implementation: [app/api/qmoi/auto-fix/start/route.ts](app/api/qmoi/auto-fix/start/route.ts)
- Auth: `x-qmoi-api-key` or `MASTER_TOKEN`.
- Behavior: writes proposal unless `production_CONFIRMED=true` and `--real` present; when allowed, spawns the auto-fix process.

## /api/qmoi/auto-fix/status (GET)

- Purpose: Get current status and latest report for auto-fix runs.
- Implementation: [app/api/qmoi/auto-fix/status/route.ts](app/api/qmoi/auto-fix/status/route.ts)
- Auth: `x-qmoi-api-key` (gated).
- Read-only.

## /api/qmoi/auto-fix/stop (POST)

- Purpose: Stop running auto-fix processes (kill processes matching `qmoi_auto_fix`).
- Implementation: [app/api/qmoi/auto-fix/stop/route.ts](app/api/qmoi/auto-fix/stop/route.ts)
- Auth: `x-qmoi-api-key` and `MASTER_TOKEN` where configured.
- Behavior: proposal-first for safety; writes proposal when not confirmed.

## /api/qmoi/auto-fix/download-report (GET)

- Purpose: Download the latest auto-fix JSON report.
- Implementation: [app/api/qmoi/auto-fix/download-report/route.ts](app/api/qmoi/auto-fix/download-report/route.ts)
- Auth: `x-qmoi-api-key`.
- Behavior: read-only; logs access to `logs/download_fixes.log` (best-effort).

## /api/qmoi/auto-fix/github-status (GET)

- Purpose: Inspect GitHub Actions/workflow presence and recent runs for auto-fix workflows.
- Implementation: [app/api/qmoi/auto-fix/github-status/route.ts](app/api/qmoi/auto-fix/github-status/route.ts)
- Auth: `x-qmoi-api-key`.
- Behavior: read-only.

---

## /api/env (POST)

- Purpose: Dynamically manage environment variables.
- Implementation: [app/api/env/route.ts](app/api/env/route.ts)
- Auth: `QMOI_CONTROL_TOKEN` required.
- Behavior: Supports set, delete, and instruction actions for env vars. Persists changes to .env file.

**Request Body:**

```json
{
  "action": "set",
  "key": "NEW_VAR",
  "value": "value"
}
```

or

```json
{
  "action": "instruction",
  "instruction": "set NEW_VAR to value"
}
```

**Response:**

```json
{
  "success": true,
  "key": "NEW_VAR",
  "value": "value"
}
```

---

## Implemented route index

For quick cross-reference, the following important API routes are implemented and available in the codebase; follow the linked `route.ts` to see exact request/response schemas and auth checks.

- /api/qmoi/auto-fix/_ -> `app/api/qmoi/auto-fix/_/route.ts`
- /api/cashon/_ -> `app/api/cashon/_/route.ts`
- /api/qi-trading -> [app/api/qi-trading/route.ts](app/api/qi-trading/route.ts)
- /api/qmoi/chat -> [app/api/qmoi/chat/route.ts](app/api/qmoi/chat/route.ts)
- /api/qmoi/status -> [app/api/qmoi/status/route.ts](app/api/qmoi/status/route.ts)
- /api/qmoi/self-work/code-review -> [app/api/qmoi/self-work/code-review/route.ts](app/api/qmoi/self-work/code-review/route.ts)
- /api/qmoi/self-work/run-tests -> [app/api/qmoi/self-work/run-tests/route.ts](app/api/qmoi/self-work/run-tests/route.ts)
- /api/qmoi/autoprod/toggle -> [app/api/qmoi/autoprod/toggle/route.ts](app/api/qmoi/autoprod/toggle/route.ts)
- /api/qmoi/autoprod -> [routes/api/qmoi/autoprod.ts](routes/api/qmoi/autoprod.ts) (POST, actions: force_run, lint_fix, dependency_fix, ai_suggest, rollback, batch_edit, scan_logs, auto_fix_problems, optimize_prodice, enhance_apps, project_status, monitor_and_fix_projects, continuous_autofix_start, continuous_autofix_stop, full_status, master_instruction, ui_production, autoprod_task, auto_make, research, evolution)
- /api/qmoi/execute -> [app/api/qmoi/execute/route.ts](app/api/qmoi/execute/route.ts)
- /api/qradio/channels -> [app/api/qradio/channels/route.ts](app/api/qradio/channels/route.ts)
- /api/qradio/status -> [app/api/qradio/status/route.ts](app/api/qradio/status/route.ts)
- /api/qradio/programs -> [app/api/qradio/programs/route.ts](app/api/qradio/programs/route.ts)
- /api/qradio/play -> [app/api/qradio/play/route.ts](app/api/qradio/play/route.ts)
- /api/qradio/program -> [app/api/qradio/program/route.ts](app/api/qradio/program/route.ts)
- /api/auth/_ -> `app/api/auth/_/route.ts`

If you want any of the proposal-first endpoints to act immediately in production, set `production_CONFIRMED=true` and run the server with the `--real` flag (or the equivalent runner). This is intentional to prevent accidental destructive actions.

---

## /api/cashon/\* (LEGACY - Use production Balance APIs)

**Note**: These legacy cashon APIs are maintained for backward compatibility. For new implementations, use the production-ready balance management APIs listed above.

- GET /api/cashon/balance — returns balances via production balance manager (MASTER_TOKEN required)
- GET /api/cashon/trading-status — returns trading status
- GET /api/cashon/qmoi-status — returns trader status
- GET /api/cashon/signals — returns recent signals
- GET /api/cashon/performance — returns performance metrics

- POST /api/cashon/deposit — propose or initiate deposit (integrated with balance transfers)
- POST /api/cashon/approve-deposit — propose or approve deposit (uses multi-signature)
- POST /api/cashon/withdraw — propose or withdraw funds (atomic transactions)
- POST /api/cashon/start-trading — propose or start AI trading
- POST /api/cashon/stop-trading — propose or stop AI trading
- POST /api/cashon/trade — propose or execute trade (consciousness validation)
- POST /api/cashon/approve-trade — propose or approve trade (multi-signature)

- Auth: Master-level operations require `MASTER_TOKEN`; all endpoints also validate `x-qmoi-api-key` if configured.
- Behavior: Mutating POSTs are proposal-first and write proposals to `.qmoi_validation/` when not confirmed.
- Integration: All operations now use the production wallet, transaction, and balance management systems with QMOI consciousness.

---

## /api/qi-trading (GET, POST)

- GET /api/qi-trading?stats=1 — returns trading statistics (production-ready data)
- GET /api/qi-trading?history=1 — returns trade history (production-ready)
- GET /api/qi-trading?active=1 — returns active trades (production-ready)

- POST /api/qi-trading (body: { action: 'execute'|'cancel', trade }) — proposal-first for execute/cancel. Writes proposals when not confirmed.
- Auth: `x-qmoi-api-key` required (enforced).

---

## Notes

- Proposal files can be found in `.qmoi_validation/` (e.g., `proposal-*.json`, `[production READY]s_proposal_*.json`). Review them before applying.
- To apply a proposal and run a mutating action, _set_ `production_CONFIRMED=true` in the environment and run the server with `--real` in the process arguments (or use a patched runner that forwards this flag). This gating is intentional to prevent accidental destructive actions.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
