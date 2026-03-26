<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.416526Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ALLHOOKSWEBHOOKS.md

This document comprehensively catalogs all hooks and webhooks in the QMOI system, including React hooks, Git hooks, webhooks, automation hooks, and integration points. It serves as the central reference for setup, monitoring, and enhancement of all hook/webhook systems.

## Table of Contents
1. [React Hooks](#react-hooks)
2. [Git Hooks](#git-hooks)
3. [Webhooks](#webhooks)
4. [Automation Hooks](#automation-hooks)
5. [Setup and Configuration](#setup-and-configuration)
6. [Monitoring and Enhancement](#monitoring-and-enhancement)
7. [Integration Points](#integration-points)

## React Hooks

The following React hooks are located in the `hooks/` directory and provide various functionalities across QMOI applications:

### Core UI Hooks
- `use-mobile.ts` / `use-mobile.tsx` - Mobile device detection and responsive behavior
- `use-toast.ts` - Toast notification management

### AI and Feature Enhancement Hooks
- `useAIFeatureEnhancer.ts` - AI-powered feature enhancements
- `useAIHealthCheck.ts` - AI system health monitoring
- `useAnalyticsDashboard.ts` - Analytics dashboard functionality
- `useAutoEarningTasks.ts` - Automated earning task management
- `useAutoFixAllProblems.ts` - Automatic problem resolution
- `useBitgetTrader.ts` - Bitget trading integration
- `useColabJob.ts` - Google Colab job management
- `useDatasetManager.ts` - Dataset management operations
- `useDatasets.ts` - Dataset handling
- `useDeviceHealth.ts` - Device health monitoring
- `useDeviceOptimizer.ts` - Device optimization features
- `useErrorAutoFix.ts` - Automatic error fixing
- `useExtensionManager.ts` - Extension management
- `useGithubRepoManager.ts` - GitHub repository management
- `useGlobalAutomation.ts` - Global automation features
- `useLargeFileUpload.ts` - Large file upload handling
- `useMediaGenerationStatus.ts` - Media generation status tracking
- `useModelTrainer.ts` - Model training operations
- `useProjects.ts` - Project management
- `useQCity.ts` - QCity integration
- `useQMOIAutoInteraction.ts` - QMOI auto-interaction features
- `useQMOIChat.ts` - QMOI chat functionality
- `useQVillage.ts` - QVillage integration
- `useSystemMetrics.ts` - System metrics collection
- `useTTCVoice.ts` - TTC voice features
- `useTaskQueue.ts` - Task queue management
- `useTrading.ts` - Trading operations
- `useTradingAutomation.ts` - Automated trading
- `useVSCodeProblems.ts` - VS Code problems integration
- `useWhatsApp.ts` - WhatsApp integration

## Git Hooks

Git hooks are located in `.git/hooks/` and include standard data hooks:

### data Hooks (Inactive)
- `applypatch-msg.data`
- `commit-msg.data`
- `fsmonitor-watchman.data`
- `post-update.data`
- `pre-applypatch.data`
- `pre-commit.data`
- `pre-merge-commit.data`
- `pre-push.data`
- `pre-rebase.data`
- `pre-receive.data`
- `prepare-commit-msg.data`
- `push-to-checkout.data`
- `sendemail-validate.data`
- `update.data`

### required Active Hooks
For production deployment, consider activating:
- `pre-commit` - Run linting and tests
- `pre-push` - Run full test suite
- `commit-msg` - Validate commit message format

## Webhooks

### GitHub Webhooks
- **Endpoint**: `/api/github/webhook`
- **Purpose**: Receive GitHub events for CI/CD automation
- **Validation**: Uses X-Hub-Signature-256 header verification
- **Events**: Push, pull request, issue events
- **Documentation**: See `QMOIGITHUBAPP.md`

### QVillage Webhooks
- **Endpoint**: `/api/webhooks/qvillage`
- **Purpose**: Handle QVillage events (papers, entries, discussions, sync, enhancements, alerts)
- **Features**: Event processing with retry/backoff, subscriptions
- **Monetization**: Higher rate limits for paid tiers
- **File**: `app/api/webhooks/qvillage/route.ts`

### Communication Webhooks
- **Slack Webhook**: `QMOI_SLACK_WEBHOOK` - For deployment and monitoring alerts
- **Discord Webhook**: `QMOI_DISCORD_WEBHOOK` - For community notifications
- **Telegram Webhook**: Integration via `QMOI_TELEGRAM_TOKEN` and `QMOI_TELEGRAM_CHAT`
- **WhatsApp Webhook**: Via Twilio (`QMOI_TWILIO_SID`, `QMOI_TWILIO_TOKEN`, `QMOI_TWILIO_WHATSAPP`)

### Payment Webhooks
- **Stripe Webhook**: For payment confirmations and subscription updates
- **M-Pesa Webhook**: For mobile money transactions in supported regions
- **Purpose**: Update user pricing and transaction records

### Monitoring Webhooks
- **Health Check Webhooks**: For system health monitoring
- **Alert Webhooks**: Automated alerting for system issues

## Automation Hooks

### LION Validation Hooks
- **Location**: `docs/LIONOPERATINGSYSTEM.md`
- **Purpose**: Runtime validation and self-healing
- **Features**: WhatsApp webhook verification, signature checks, message flow tests
- **Integration**: Used across all QMOI systems for automated validation

### Orchestrator Webhooks
- **Location**: `docs/LION_ORCHESTRATOR_ENHANCEMENTS.md`
- **Features**: Event ingestion, task creation from external events
- **Configuration**: `notify_webhook`, `notify_max_attempts`

## Setup and Configuration

### Environment Variables
```bash
# Webhook Secrets
QMOI_SLACK_WEBHOOK=https://hooks.slack.com/services/...
QMOI_DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
QMOI_TELEGRAM_TOKEN=...
QMOI_TELEGRAM_CHAT=...
QMOI_TWILIO_SID=...
QMOI_TWILIO_TOKEN=...
QMOI_TWILIO_WHATSAPP=...

# GitHub Webhook
GITHUB_WEBHOOK_SECRET=your_secret_here

# Payment Webhooks
STRIPE_WEBHOOK_SECRET=whsec_...
M_PESA_WEBHOOK_SECRET=...
```

### Git Hook Setup
```bash
# Copy data hooks to active
cp .git/hooks/pre-commit.data .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Add validation logic to hooks
```

### Webhook Security
- Always validate signatures (HMAC-SHA256)
- Use HTTPS endpoints only
- Implement rate limiting
- Log all webhook events for audit

## Monitoring and Enhancement

### Automated Monitoring
- All hooks and webhooks are monitored for health and usage
- Failed webhook deliveries trigger alerts
- Performance metrics collected for optimization

### Enhancement Features
- Auto-setup for new webhooks
- Retry mechanisms with exponential backoff
- Event queuing for reliable processing
- Real-time status dashboards

### QMOI Integration
- All hooks/webhooks integrated with QMOI consciousness and memory sync
- Automated updates and enhancements
- Global sync across all platforms

## Integration Points

### Files Referenced
- `HOOKS.md` - React hooks documentation
- `WEBHOOKS.md` - Webhook best practices
- `docs/qvillage_features.md` - QVillage webhook features
- `docs/LIONOPERATINGSYSTEM.md` - Validation hooks
- `docs/LION_ORCHESTRATOR_ENHANCEMENTS.md` - Orchestrator webhooks
- `QMOIEMPLOYAUTOPAY.md` - Payment webhook integration
- `ALLMDFILESREFS.md` - Master file references

### API Endpoints
- `/api/github/webhook` - GitHub events
- `/api/webhooks/qvillage` - QVillage events
- `/api/webhooks/payment` - Payment confirmations
- `/api/webhooks/health` - Health monitoring

### Automation Scripts
- `scripts/hook_manager.py` - Hook management automation
- `scripts/webhook_monitor.py` - Webhook health monitoring
- `scripts/auto_setup_hooks.py` - Automated hook setup

---

**Last Updated**: 2026-03-24
**Auto-Update**: This file is automatically updated by QMOI systems
**Coverage**: 100% of all hooks and webhooks in the system
## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
