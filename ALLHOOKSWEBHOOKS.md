<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-29T01:01:10.362184Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# ALLHOOKSWEBHOOKS.md - Complete Hooks & Webhooks Reference

**Last Updated**: 2026-03-29T01:00:55.807100
**Status**: ✅ Complete Inventory

## 📋 Complete System Overview

This document provides the complete reference for all hooks and webhooks in the QMOI system.

## 🎣 React Hooks (33 total)

### By Category


#### AI & ML Hooks (3)

- `useAIFeatureEnhancer` - [useAIFeatureEnhancer.ts](hooks/useAIFeatureEnhancer.ts)
- `useAIHealthCheck` - [useAIHealthCheck.ts](hooks/useAIHealthCheck.ts)
- `useModelTrainer` - [useModelTrainer.ts](hooks/useModelTrainer.ts)

#### Automation Hooks (6)

- `useAutoEarningTasks` - [useAutoEarningTasks.ts](hooks/useAutoEarningTasks.ts)
- `useAutoFixAllProblems` - [useAutoFixAllProblems.ts](hooks/useAutoFixAllProblems.ts)
- `useErrorAutoFix` - [useErrorAutoFix.ts](hooks/useErrorAutoFix.ts)
- `useGlobalAutomation` - [useGlobalAutomation.ts](hooks/useGlobalAutomation.ts)
- `useQMOIAutoInteraction` - [useQMOIAutoInteraction.ts](hooks/useQMOIAutoInteraction.ts)
- `useVSCodeProblems` - [useVSCodeProblems.ts](hooks/useVSCodeProblems.ts)

#### Device & System Hooks (3)

- `useDeviceHealth` - [useDeviceHealth.ts](hooks/useDeviceHealth.ts)
- `useDeviceOptimizer` - [useDeviceOptimizer.ts](hooks/useDeviceOptimizer.ts)
- `useSystemMetrics` - [useSystemMetrics.ts](hooks/useSystemMetrics.ts)

#### Platform Integration Hooks (2)

- `useQCity` - [useQCity.ts](hooks/useQCity.ts)
- `useQVillage` - [useQVillage.ts](hooks/useQVillage.ts)

#### QMOI Integration Hooks (1)

- `useQMOIChat` - [useQMOIChat.ts](hooks/useQMOIChat.ts)

#### Trading Hooks (3)

- `useBitgetTrader` - [useBitgetTrader.ts](hooks/useBitgetTrader.ts)
- `useTrading` - [useTrading.ts](hooks/useTrading.ts)
- `useTradingAutomation` - [useTradingAutomation.ts](hooks/useTradingAutomation.ts)

#### Utility Hooks (15)

- `use-mobile` - [use-mobile.ts](hooks/use-mobile.ts)
- `use-mobilex` - [use-mobile.tsx](hooks/use-mobile.tsx)
- `use-toast` - [use-toast.ts](hooks/use-toast.ts)
- `useAnalyticsDashboard` - [useAnalyticsDashboard.ts](hooks/useAnalyticsDashboard.ts)
- `useColabJob` - [useColabJob.ts](hooks/useColabJob.ts)
- `useDatasetManager` - [useDatasetManager.ts](hooks/useDatasetManager.ts)
- `useDatasets` - [useDatasets.ts](hooks/useDatasets.ts)
- `useExtensionManager` - [useExtensionManager.ts](hooks/useExtensionManager.ts)
- `useGithubRepoManager` - [useGithubRepoManager.ts](hooks/useGithubRepoManager.ts)
- `useLargeFileUpload` - [useLargeFileUpload.ts](hooks/useLargeFileUpload.ts)
- `useMediaGenerationStatus` - [useMediaGenerationStatus.ts](hooks/useMediaGenerationStatus.ts)
- `useProjects` - [useProjects.ts](hooks/useProjects.ts)
- `useTTCVoice` - [useTTCVoice.ts](hooks/useTTCVoice.ts)
- `useTaskQueue` - [useTaskQueue.ts](hooks/useTaskQueue.ts)
- `useWhatsApp` - [useWhatsApp.ts](hooks/useWhatsApp.ts)


## 🔗 Webhooks

### Payment Webhooks
- **Endpoint**: `/api/webhooks/payments`
- **Signature Verification**: X-Hub-Signature-256
- **Providers**: Stripe, PayPal, Pesapal
- **Events**: success, failed, refunded, dispute

### GitHub Webhooks  
- **Endpoint**: `/api/webhooks/github`
- **Events**: push, pull_request, issues, release
- **Authentication**: GitHub signature verification

### QVillage Webhooks
- **Endpoint**: `/api/webhooks/qvillage`
- **Events**: paper, entry, discussion, sync, enhancement, alert
- **Format**: JSON

## 📊 Summary

| Type | Count | Status |
|------|-------|--------|
| React Hooks | 33 | ✅ Active |
| Webhook Endpoints | 3 | ✅ Active |
| Event Types | 15+ | ✅ Configured |

## 🔧 Configuration

### Hook Configuration
```typescript
// Hooks are configured in hooks/index.ts
// All hooks exported for application-wide use
```

### Webhook Configuration
```typescript
// Webhook handlers in services/adapters/payments/webhooks.ts
// Event processing in services/webhooks/
```

## 📚 Documentation

- **React Hooks**: See [HOOKS.md](HOOKS.md)
- **Webhooks**: See [WEBHOOKS.md](WEBHOOKS.md)
- **API Reference**: See [API.md](API.md)

---
*Auto-maintained by QMOI's continuous system updates.*
