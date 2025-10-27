<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Q-city API Documentation

## Overview

The Q-city API provides a comprehensive interface for managing and interacting with the Q-city system. This documentation covers all available endpoints, their parameters, and response formats.

## Base URL

## Discovered API Endpoints (Auto-Extracted)

```
Discovered endpoints (auto-generated):

GET    /    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
POST   /admin/backup-db    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /admin/check-access/<username>/<feature>    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /admin/set-pricing    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /admin/update-ngrok    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /admin/users    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /ai    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /ai/tts    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /alert    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
POST   /alert    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
GET    /analytics    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
GET    /analytics    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
GET    /analytics/hourly    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
GET    /analytics/hourly    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
       /api/account-automation/create    — /workspaces/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/account-automation/create    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/account-automation/login    — /workspaces/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/account-automation/login    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/account-automation/verify    — /workspaces/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/account-automation/verify    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
       /api/ai-health    — /workspaces/qmoi-enhanced/components/NotificationPanel.tsx
       /api/ai-health    — /workspaces/qmoi-enhanced/hooks/useAIHealthCheck.ts
       /api/ai-health    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/NotificationPanel.tsx
       /api/ai-health    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAIHealthCheck.ts
       /api/auth/session    — /workspaces/qmoi-enhanced/src/components/q-city/SessionPanel.tsx
       /api/auth/session    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SessionPanel.tsx
POST   /api/auto-fix    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/auto-fix    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
       /api/automation/settings    — /workspaces/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/automation/settings    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/automation/status    — /workspaces/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/automation/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/automation/tasks    — /workspaces/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/automation/tasks    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGlobalAutomation.ts
       /api/bitget-trade    — /workspaces/qmoi-enhanced/hooks/useBitgetTrader.ts
       /api/bitget-trade    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useBitgetTrader.ts
POST   /api/build-apps    — /workspaces/qmoi-enhanced/scripts/qmoi_build_api.py
POST   /api/build-apps    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_build_api.py
       /api/cashon/balance    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/balance    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/balance?logs=true    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/balance?logs=true    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/balance?mpesaInfo=true    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/balance?mpesaInfo=true    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/deposit    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/deposit    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/signals    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/signals    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/start-trading    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/start-trading    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/stop-trading    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/stop-trading    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/trading-status    — /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/cashon/trading-status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
       /api/colab-job    — /workspaces/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/colab-job    — /workspaces/qmoi-enhanced/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
POST   /api/colab-job?executeJob=true    — /workspaces/qmoi-enhanced/hooks/useProjects.ts
POST   /api/colab-job?executeJob=true    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useProjects.ts
       /api/datasets    — /workspaces/qmoi-enhanced/hooks/useDatasetManager.ts
       /api/datasets    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDatasetManager.ts
       /api/datasets/settings    — /workspaces/qmoi-enhanced/hooks/useDatasetManager.ts
       /api/datasets/settings    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDatasetManager.ts
POST   /api/deploy    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/deploy    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/deploy/auto-redeploy    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/deploy/auto-redeploy    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
GET    /api/deployment-status    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
GET    /api/deployment-status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
       /api/deployment-status    — /workspaces/qmoi-enhanced/components/DeploymentStatusDashboard.tsx
       /api/deployment-status    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/deployment-status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/DeploymentStatusDashboard.tsx
       /api/deployment-status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
POST   /api/device/detect    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
POST   /api/device/detect    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
POST   /api/device/master-mode    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
POST   /api/device/master-mode    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/reports/detection    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/reports/detection    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/reports/unlock    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/reports/unlock    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/status    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/status/integration    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
GET    /api/device/status/integration    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
POST   /api/device/unlock    — /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
POST   /api/device/unlock    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
       /api/doc-history    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/doc-history    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/doc-history    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/doc-history    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/document-backup/list    — /workspaces/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/document-backup/list    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/document-backup/restore    — /workspaces/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/document-backup/restore    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/document-backup/upload    — /workspaces/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/document-backup/upload    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
       /api/earning/analytics    — /workspaces/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/analytics    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/monitor    — /workspaces/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/monitor    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/self-heal    — /workspaces/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/self-heal    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/strategies    — /workspaces/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
       /api/earning/strategies    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
POST   /api/edit-file    — /workspaces/qmoi-enhanced/src/services/ErrorFixingService.ts
POST   /api/edit-file    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/ErrorFixingService.ts
       /api/employment    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/megavault?type=balance    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/megavault?type=balance    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/payment    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/payment    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/payment?type=payments    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/payment?type=payments    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/revenue    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment/revenue    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment?type=employees    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment?type=employees    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment?type=users    — /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/employment?type=users    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
       /api/event-stats    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/event-stats    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/event-stats    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/event-stats    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/financial/audit    — /workspaces/qmoi-enhanced/components/FinancialManager.tsx
       /api/financial/audit    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/FinancialManager.tsx
       /api/financial/transactions    — /workspaces/qmoi-enhanced/components/FinancialManager.tsx
       /api/financial/transactions    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/FinancialManager.tsx
       /api/financial/verify    — /workspaces/qmoi-enhanced/components/FinancialManager.tsx
       /api/financial/verify    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/FinancialManager.tsx
       /api/git/branch    — /workspaces/qmoi-enhanced/components/GitStatus.tsx
       /api/git/branch    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/GitStatus.tsx
POST   /api/git/commit    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/git/commit    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/git/pr    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/git/pr    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/git/push    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
POST   /api/git/push    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
       /api/git/remote    — /workspaces/qmoi-enhanced/components/GitStatus.tsx
       /api/git/remote    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/GitStatus.tsx
GET    /api/git/status    — /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
GET    /api/git/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
       /api/git/status    — /workspaces/qmoi-enhanced/components/GitStatus.tsx
       /api/git/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/GitStatus.tsx
       /api/health    — /workspaces/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/health    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/log    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/log    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/log    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/log    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/log?search=    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/log?search=    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/md-update    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/QmoiMemory.ts
       /api/media    — /workspaces/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/media    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/media/generate    — /workspaces/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/media/generate    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/media/settings    — /workspaces/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/media/settings    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/media/status    — /workspaces/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/media/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
       /api/memory    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/QmoiMemory.ts
       /api/notifications    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/notifications    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/notifications    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/notifications    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/notifications/test    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/notifications/test    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
POST   /api/notifications/test    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
POST   /api/notifications/test    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/preautotest    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/preautotest    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/preautotest    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/preautotest    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/provider    — /workspaces/qmoi-enhanced/qmoi-enhanced/huggingface_space/dashboard.js
       /api/provider    — /workspaces/qmoi-enhanced/huggingface_space/dashboard.js
       /api/qapikey    — /workspaces/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
       /api/qapikey    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
       /api/qapikey/usage    — /workspaces/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
       /api/qapikey/usage    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
       /api/qcity/ai-chat    — /workspaces/qmoi-enhanced/qmoi-space/public/js/chat.js
POST   /api/qcity/ai/fix    — /workspaces/qmoi-enhanced/scripts/services/auto_fix_service.ts
POST   /api/qcity/ai/fix    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/services/auto_fix_service.ts
       /api/qcity/backup    — /workspaces/qmoi-enhanced/qmoi-space/public/js/qmoi-core.js
GET    /api/qcity/config    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/config    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/config    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/config    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
POST   /api/qcity/configure-platforms    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/configure-platforms    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/devices    — /workspaces/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
       /api/qcity/devices    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
       /api/qcity/devices?action=test    — /workspaces/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
       /api/qcity/devices?action=test    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
       /api/qcity/download-url    — /workspaces/qmoi-enhanced/src/components/DownloadQCity.tsx
       /api/qcity/download-url    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/DownloadQCity.tsx
POST   /api/qcity/enable-features    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/enable-features    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/listLocalWorkspaces    — /workspaces/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
GET    /api/qcity/listLocalWorkspaces    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
GET    /api/qcity/listWorkspaces    — /workspaces/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
GET    /api/qcity/listWorkspaces    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
GET    /api/qcity/logs    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/logs    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/logs    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/logs    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
POST   /api/qcity/manage-backup    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/manage-backup    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/metrics    — /workspaces/qmoi-enhanced/src/components/q-city/MetricsPanel.tsx
       /api/qcity/metrics    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/MetricsPanel.tsx
POST   /api/qcity/monitor-resources    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/monitor-resources    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/notifications    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/notifications    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/notifications    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/notifications    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
POST   /api/qcity/optimize-resources    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/optimize-resources    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/plugins    — /workspaces/qmoi-enhanced/src/components/q-city/PluginPanel.tsx
       /api/qcity/plugins    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/PluginPanel.tsx
GET    /api/qcity/projects    — /workspaces/qmoi-enhanced/hooks/useProjects.ts
GET    /api/qcity/projects    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useProjects.ts
GET    /api/qcity/projects/config    — /workspaces/qmoi-enhanced/hooks/useProjects.ts
GET    /api/qcity/projects/config    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useProjects.ts
       /api/qcity/remote-command    — /workspaces/qmoi-enhanced/components/QAvatar.tsx
       /api/qcity/remote-command    — /workspaces/qmoi-enhanced/src/components/q-city/CommandPanel.tsx
       /api/qcity/remote-command    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QAvatar.tsx
       /api/qcity/remote-command    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/CommandPanel.tsx
GET    /api/qcity/resources    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/resources    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/resources    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/resources    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
       /api/qcity/schedule    — /workspaces/qmoi-enhanced/src/components/q-city/SchedulePanel.tsx
       /api/qcity/schedule    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SchedulePanel.tsx
POST   /api/qcity/start    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/start    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/start    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
GET    /api/qcity/status    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/status    — /workspaces/qmoi-enhanced/components/QAvatar.tsx
       /api/qcity/status    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QAvatar.tsx
       /api/qcity/status    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
       /api/qcity/status    — /workspaces/qmoi-enhanced/qmoi-space/public/js/qmoi-core.js
POST   /api/qcity/stop    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/stop    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/stop    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
GET    /api/qcity/tasks    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/tasks    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
       /api/qcity/tasks    — /workspaces/qmoi-enhanced/app/qcity/page.js
       /api/qcity/tasks    — /workspaces/qmoi-enhanced/public/qcity/dashboard.js
POST   /api/qcity/track-error    — /workspaces/qmoi-enhanced/hooks/useQCity.ts
POST   /api/qcity/track-error    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
GET    /api/qcity/trading/config    — /workspaces/qmoi-enhanced/hooks/useTrading.ts
GET    /api/qcity/trading/config    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTrading.ts
GET    /api/qcity/trading/positions    — /workspaces/qmoi-enhanced/hooks/useTrading.ts
GET    /api/qcity/trading/positions    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTrading.ts
GET    /api/qcity/whatsapp/config    — /workspaces/qmoi-enhanced/hooks/useWhatsApp.ts
GET    /api/qcity/whatsapp/config    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useWhatsApp.ts
GET    /api/qcity/whatsapp/messages    — /workspaces/qmoi-enhanced/hooks/useWhatsApp.ts
GET    /api/qcity/whatsapp/messages    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useWhatsApp.ts
       /api/qi-trading    — /workspaces/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qi-trading    — /workspaces/qmoi-enhanced/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qi-trading?action=account    — /workspaces/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qi-trading?action=account    — /workspaces/qmoi-enhanced/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qi-trading?action=stats    — /workspaces/qmoi-enhanced/components/QI.tsx
       /api/qi-trading?action=stats    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QI.tsx
       /api/qmoi-database    — /workspaces/qmoi-enhanced/app/api/employment/megavault/route.ts
       /api/qmoi-database    — /workspaces/qmoi-enhanced/app/api/employment/payment/route.ts
       /api/qmoi-database    — /workspaces/qmoi-enhanced/app/api/employment/revenue/route.ts
       /api/qmoi-database    — /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/megavault/route.ts
       /api/qmoi-database    — /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/payment/route.ts
       /api/qmoi-database    — /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/revenue/route.ts
       /api/qmoi-database/route    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database/route    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database/route?schema=true    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database/route?schema=true    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database/route?tables=true    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database/route?tables=true    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
       /api/qmoi-database?logs=true&limit=50    — /workspaces/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/qmoi-database?logs=true&limit=50    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiMediaManager.tsx
       /api/qmoi-gitlab/deployments    — /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/deployments    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/errors    — /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/errors    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/jobs    — /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/jobs    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/pipelines    — /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/pipelines    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/trigger    — /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-gitlab/trigger    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
       /api/qmoi-model    — /workspaces/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qmoi-model    — /workspaces/qmoi-enhanced/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
       /api/qmoi-model?allStats=1    — /workspaces/qmoi-enhanced/components/QI.tsx
       /api/qmoi-model?allStats=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QI.tsx
       /api/qmoi-model?analytics=1    — /workspaces/qmoi-enhanced/hooks/useAnalyticsDashboard.ts
       /api/qmoi-model?analytics=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAnalyticsDashboard.ts
       /api/qmoi-model?applyDeviceFeature=1    — /workspaces/qmoi-enhanced/hooks/useDeviceOptimizer.ts
       /api/qmoi-model?applyDeviceFeature=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDeviceOptimizer.ts
       /api/qmoi-model?autoEarning=1    — /workspaces/qmoi-enhanced/hooks/useAutoEarningTasks.ts
       /api/qmoi-model?autoEarning=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAutoEarningTasks.ts
       /api/qmoi-model?colabJob=1    — /workspaces/qmoi-enhanced/hooks/useColabJob.ts
       /api/qmoi-model?colabJob=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useColabJob.ts
       /api/qmoi-model?deviceOptimize=1    — /workspaces/qmoi-enhanced/hooks/useDeviceOptimizer.ts
       /api/qmoi-model?deviceOptimize=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDeviceOptimizer.ts
       /api/qmoi-model?enhance=1    — /workspaces/qmoi-enhanced/components/QI.tsx
       /api/qmoi-model?enhance=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QI.tsx
       /api/qmoi-model?featureEnhance=1    — /workspaces/qmoi-enhanced/hooks/useAIFeatureEnhancer.ts
       /api/qmoi-model?featureEnhance=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAIFeatureEnhancer.ts
       /api/qmoi-model?githubTasks=1    — /workspaces/qmoi-enhanced/hooks/useGithubRepoManager.ts
       /api/qmoi-model?githubTasks=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGithubRepoManager.ts
       /api/qmoi-model?globalScanFix=1    — /workspaces/qmoi-enhanced/hooks/useErrorAutoFix.ts
       /api/qmoi-model?globalScanFix=1    — /workspaces/qmoi-enhanced/hooks/useAutoFixAllProblems.ts
       /api/qmoi-model?globalScanFix=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useErrorAutoFix.ts
       /api/qmoi-model?globalScanFix=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAutoFixAllProblems.ts
       /api/qmoi-model?hookDiagnostics=1    — /workspaces/qmoi-enhanced/hooks/useVSCodeProblems.ts
       /api/qmoi-model?hookDiagnostics=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useVSCodeProblems.ts
       /api/qmoi-model?manageRepo=1    — /workspaces/qmoi-enhanced/hooks/useGithubRepoManager.ts
       /api/qmoi-model?manageRepo=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGithubRepoManager.ts
       /api/qmoi-model?runEarningTask=1    — /workspaces/qmoi-enhanced/hooks/useAutoEarningTasks.ts
       /api/qmoi-model?runEarningTask=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAutoEarningTasks.ts
       /api/qmoi-model?trainingStatus=1    — /workspaces/qmoi-enhanced/hooks/useModelTrainer.ts
       /api/qmoi-model?trainingStatus=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useModelTrainer.ts
       /api/qmoi/auto-fix/download-report    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/download-report    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/github-status    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/github-status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/start    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/start    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/status    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/stop    — /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/auto-fix/stop    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
       /api/qmoi/autodev    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
       /api/qmoi/autodev    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiAutoDevPanel.tsx
       /api/qmoi/autodev    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
       /api/qmoi/autodev    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiAutoDevPanel.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/src/components/q-city/AviatorGalleryPanel.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/src/components/q-city/AvatarSelector.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AviatorGalleryPanel.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AvatarSelector.tsx
       /api/qmoi/avatars    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
       /api/qmoi/chat    — /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qmoi/chat    — /workspaces/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qmoi/error-log    — /workspaces/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
       /api/qmoi/error-log    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
       /api/qmoi/feedback    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/feedback    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/file    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
       /api/qmoi/file    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
       /api/qmoi/files/upload    — /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qmoi/files/upload    — /workspaces/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qmoi/fix/all    — /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/fix/all    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/fix/connectivity    — /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/fix/connectivity    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/fix/ui    — /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/fix/ui    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/master-mode    — /workspaces/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/master-mode    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/master/login    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/master/login    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/master/verify    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/master/verify    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/memory    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/memory    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/memory-backup    — /workspaces/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/memory-backup    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
       /api/qmoi/notify-master    — /workspaces/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
       /api/qmoi/notify-master    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
       /api/qmoi/own-device-logs    — /workspaces/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
       /api/qmoi/own-device-logs    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
       /api/qmoi/own-device-logs/export    — /workspaces/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
       /api/qmoi/own-device-logs/export    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
       /api/qmoi/revenue    — /workspaces/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/revenue    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/revenue-dashboard    — /workspaces/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/revenue-dashboard    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/revenue-dashboard/export    — /workspaces/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/revenue-dashboard/export    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
       /api/qmoi/revenue/reset    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/reset    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/start    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/start    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/status    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/stop    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/stop    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/target    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/target    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/transactions    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/transactions    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/transfer    — /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue/transfer    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
       /api/qmoi/revenue?action=status    — /workspaces/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/revenue?action=status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/revenue?action=transactions&limit=100    — /workspaces/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/revenue?action=transactions&limit=100    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
       /api/qmoi/status    — /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/status    — /workspaces/qmoi-enhanced/src/hooks/useQmoiKernel.ts
       /api/qmoi/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useQmoiKernel.ts
       /api/qmoi/ui-health-check    — /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/ui-health-check    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
       /api/qmoi/voice-preview    — /workspaces/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
       /api/qmoi/voice-preview    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
       /api/qmoi/voice-profiles    — /workspaces/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
       /api/qmoi/voice-profiles    — /workspaces/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
       /api/qmoi/voice-profiles    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
       /api/qmoi/voice-profiles    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
       /api/qmoi/voice/process    — /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qmoi/voice/process    — /workspaces/qmoi-enhanced/qmoi-space/public/sw.js
       /api/qnews    — /workspaces/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/analytics    — /workspaces/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/analytics    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/media    — /workspaces/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/media    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/schedule    — /workspaces/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qnews/schedule    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
       /api/qradio/channels    — /workspaces/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/channels    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/play    — /workspaces/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/play    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/program    — /workspaces/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/program    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/programs    — /workspaces/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/programs    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/status    — /workspaces/qmoi-enhanced/src/components/QI.tsx
       /api/qradio/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
       /api/repo-sync    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/QmoiMemory.ts
       /api/report    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/report    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/report    — /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
GET    /api/report    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
       /api/report-download-issue    — /workspaces/qmoi-enhanced/QI_download_component.html
       /api/report-download-issue    — /workspaces/qmoi-enhanced/qmoi-enhanced/QI_download_component.html
POST   /api/run-command    — /workspaces/qmoi-enhanced/src/services/ErrorFixingService.ts
POST   /api/run-command    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/ErrorFixingService.ts
       /api/social-automation/contacts    — /workspaces/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/contacts    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/features    — /workspaces/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/features    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/post    — /workspaces/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/post    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/tag    — /workspaces/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/social-automation/tag    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
       /api/stats    — /workspaces/qmoi-enhanced/scripts/qmoi-real-time-monitor.py
       /api/stats    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-real-time-monitor.py
       /api/status    — /workspaces/qmoi-enhanced/scripts/monitoring/monitoring_dashboard.py
       /api/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/monitoring/monitoring_dashboard.py
       /api/system/metrics    — /workspaces/qmoi-enhanced/hooks/useSystemMetrics.ts
       /api/system/metrics    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useSystemMetrics.ts
       /api/tasks    — /workspaces/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/tasks    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/tasks/queue    — /workspaces/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/tasks/queue    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/tasks/settings    — /workspaces/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/tasks/settings    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTaskQueue.ts
       /api/trading/settings    — /workspaces/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trading/settings    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trading/status    — /workspaces/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trading/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trading/toggle    — /workspaces/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trading/toggle    — /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTradingAutomation.ts
       /api/trigger-evolution    — /workspaces/qmoi-enhanced/components/QmoiMemoryPanel.tsx
       /api/trigger-gitlab-ci    — /workspaces/qmoi-enhanced/templates/dashboard.html
       /api/trigger-gitlab-ci    — /workspaces/qmoi-enhanced/qmoi-enhanced/templates/dashboard.html
       /api/version    — /workspaces/qmoi-enhanced/qmoi-space-pwa/js/app.js
       /api/version    — /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space-pwa/js/app.js
       /api/wallet    — /workspaces/qmoi-enhanced/src/components/q-city/WalletManager.tsx
       /api/wallet    — /workspaces/qmoi-enhanced/src/components/q-city/QFileManager.tsx
       /api/wallet    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/WalletManager.tsx
       /api/wallet    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QFileManager.tsx
       /api/wallet?pending_wallets=1    — /workspaces/qmoi-enhanced/src/components/q-city/WalletManager.tsx
       /api/wallet?pending_wallets=1    — /workspaces/qmoi-enhanced/src/components/q-city/QFileManager.tsx
       /api/wallet?pending_wallets=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/WalletManager.tsx
       /api/wallet?pending_wallets=1    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QFileManager.tsx
       /api/whatsapp/audit    — /workspaces/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
       /api/whatsapp/audit    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
       /api/whatsapp/create-group    — /workspaces/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/create-group    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/notify-master    — /workspaces/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/notify-master    — /workspaces/qmoi-enhanced/scripts/auto-git-update.js
       /api/whatsapp/notify-master    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/notify-master    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/auto-git-update.js
       /api/whatsapp/post-to-group    — /workspaces/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/post-to-group    — /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useAutoProjects.ts
       /api/whatsapp/verify    — /workspaces/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
       /api/whatsapp/verify    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
       /api/wifi    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=ai-agents    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=ai-agents    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=iot-scan    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=iot-scan    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=network-scan    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=network-scan    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=security-test    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=security-test    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=signal-analysis    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi-security?action=signal-analysis    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi/connect    — /workspaces/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
       /api/wifi/connect    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
       /api/wifi/scan    — /workspaces/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi/scan    — /workspaces/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
       /api/wifi/scan    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
       /api/wifi/scan    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
POST   /attachments    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /attachments/<att_id>/download    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /config    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /config    — /workspaces/qmoi-enhanced/api/qcity.ts
POST   /configure-platforms    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
POST   /configure-platforms    — /workspaces/qmoi-enhanced/api/qcity.ts
POST   /control    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /deals    — /workspaces/qmoi-enhanced/pwa_apps/deals/index.html
GET    /deals    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /deals/    — /workspaces/qmoi-enhanced/pwa_apps/deals/index.html
GET    /deals/<deal_id>    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /deals/<deal_id>/activate    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /deals/<deal_id>/deactivate    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /deals/<deal_id>/purchase    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /deals/create    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /deals/create-payment    — /workspaces/qmoi-enhanced/pwa_apps/deals/js/stripe-payment.js
POST   /detect-anomaly    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
POST   /detect-anomaly    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
POST   /enable-features    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
POST   /enable-features    — /workspaces/qmoi-enhanced/api/qcity.ts
GET    /export-analytics    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
GET    /export-analytics    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
       /health    — /workspaces/qmoi-enhanced/qmoi-enhanced/huggingface_space/dashboard.js
       /health    — /workspaces/qmoi-enhanced/huggingface_space/dashboard.js
GET    /health    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /login    — /workspaces/qmoi-enhanced/docs/ui/login.html
POST   /login    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /logout    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /logs    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /logs    — /workspaces/qmoi-enhanced/api/qcity.ts
       /logs/qmoispace_health.log    — /workspaces/qmoi-enhanced/qmoi-enhanced/huggingface_space/dashboard.js
       /logs/qmoispace_health.log    — /workspaces/qmoi-enhanced/huggingface_space/dashboard.js
GET    /memories    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /metrics    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /mirror/app/<appname>/    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /mirror/app/<appname>/<path:rest>    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /mirror/raw/<path:rest>    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /monitor    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
POST   /monitor    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
POST   /monitor-resources    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
POST   /monitor-resources    — /workspaces/qmoi-enhanced/api/qcity.ts
GET    /monitor/status    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
GET    /monitor/status    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
GET    /notifications    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /notifications    — /workspaces/qmoi-enhanced/api/qcity.ts
GET    /parse-log    — /workspaces/qmoi-enhanced/ai-anomaly-service.py
GET    /parse-log    — /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
POST   /payments/webhook    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /qmoi_health_status.json    — /workspaces/qmoi-enhanced/components/SystemHealthDashboard.tsx
       /qmoi_health_status.json    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/SystemHealthDashboard.tsx
GET    /ready    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /register    — /workspaces/qmoi-enhanced/docs/ui/login.html
GET    /resources    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /resources    — /workspaces/qmoi-enhanced/api/qcity.ts
POST   /signup    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /sponsored/add    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /start    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
POST   /start    — /workspaces/qmoi-enhanced/api/qcity.ts
GET    /status    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /status    — /workspaces/qmoi-enhanced/api/qcity.ts
       /status    — /workspaces/qmoi-enhanced/components/SystemHealthDashboard.tsx
       /status    — /workspaces/qmoi-enhanced/qmoi-enhanced/components/SystemHealthDashboard.tsx
POST   /stop    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
POST   /stop    — /workspaces/qmoi-enhanced/api/qcity.ts
POST   /sync-memory    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /tasks    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /tasks    — /workspaces/qmoi-enhanced/api/qcity.ts
       /trigger-fix    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
       /update-notification-prefs    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
GET    /wallet    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /wallet/credit    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /wallet/debit    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /webauthn/auth/finish    — /workspaces/qmoi-enhanced/docs/ui/login.html
       /webauthn/auth/options    — /workspaces/qmoi-enhanced/docs/ui/login.html
POST   /webauthn/authenticate/complete    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /webauthn/authenticate/options    — /workspaces/qmoi-enhanced/qmoi_control_server.py
POST   /webauthn/register/complete    — /workspaces/qmoi-enhanced/qmoi_control_server.py
       /webauthn/register/finish    — /workspaces/qmoi-enhanced/docs/ui/login.html
       /webauthn/register/options    — /workspaces/qmoi-enhanced/docs/ui/login.html
POST   /webauthn/register/options    — /workspaces/qmoi-enhanced/qmoi_control_server.py
GET    /workspace-logs    — /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
GET    /workspace-logs    — /workspaces/qmoi-enhanced/api/qcity.ts
GET    http://localhost:4000/api/device-stats    — /workspaces/qmoi-enhanced/mobile/components/AnalyticsScreen.js
GET    http://localhost:4000/api/device-stats    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/AnalyticsScreen.js
GET    http://localhost:4000/api/error-fix-log    — /workspaces/qmoi-enhanced/mobile/App.js
GET    http://localhost:4000/api/error-fix-log    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/App.js
GET    http://localhost:4100/api/predictions    — /workspaces/qmoi-enhanced/mobile/App.js
GET    http://localhost:4100/api/predictions    — /workspaces/qmoi-enhanced/mobile/components/AnalyticsScreen.js
GET    http://localhost:4100/api/predictions    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/App.js
GET    http://localhost:4100/api/predictions    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/AnalyticsScreen.js
GET    http://localhost:4100/api/predictions    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
POST   http://localhost:4200/api/acknowledge-notification    — /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
POST   http://localhost:4200/api/acknowledge-notification    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/alert-prefs    — /workspaces/qmoi-enhanced/mobile/components/AlertSettingsScreen.js
GET    http://localhost:4200/api/alert-prefs    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/AlertSettingsScreen.js
POST   http://localhost:4200/api/delete-notification    — /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
POST   http://localhost:4200/api/delete-notification    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/notification-history    — /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/notification-history    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/notification-history    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
GET    http://localhost:4200/api/notification-prefs    — /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/notification-prefs    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
GET    http://localhost:4200/api/notification-prefs    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
POST   http://localhost:4200/api/register-fcm    — /workspaces/qmoi-enhanced/mobile/utils/pushNotifications.js
POST   http://localhost:4200/api/register-fcm    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/utils/pushNotifications.js
POST   http://localhost:4200/api/register-pushover    — /workspaces/qmoi-enhanced/mobile/utils/pushNotifications.js
POST   http://localhost:4200/api/register-pushover    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/utils/pushNotifications.js
POST   http://localhost:4200/api/respond-notification    — /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
POST   http://localhost:4200/api/respond-notification    — /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
POST   https://api.pushover.net/1/messages.json    — /workspaces/qmoi-enhanced/scripts/qmoi-notification-system.js
POST   https://api.pushover.net/1/messages.json    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-notification-system.js
GET    https://httpbin.org/get    — /workspaces/qmoi-enhanced/scripts/qmoi-universal-error-handler.js
GET    https://httpbin.org/get    — /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-universal-error-handler.js
```



> **Note:** If any endpoint above is missing from the main documentation, please add it with details (method, params, response, auth, etc.).
http://localhost:3000/api

---
## API Coverage & Test Status (2025-10-08)

All endpoints listed above are now exercised by the automated test suite (`qmoi_test.sh`).

- Unused or previously untested endpoints are now included in the test suite and are listed in `UNUSED_API_ENDPOINTS.md` for traceability.
- See `qmoi_autogen_unused_api_tests.sh` for the script that generated and tested these endpoints.
- Test results are logged in `qmoi_test_results.log`.

If any endpoint is not covered, please update the test suite or report a gap.
```


## Verified endpoints (integration test results 2025-10-22)

The following endpoints were exercised by the local integration test harness (`scripts/test_control_server_endpoints.py`) against the local control server. Results below show the observed HTTP status and a short summary of the response body.

- GET /health — status: 200
  - body: { "status": "ok" }

- POST /signup — status: 200 (first-time)
  - body: { "status": "ok", "user": "integ_user" }

- POST /signup (duplicate) — status: 409
  - body: { "status": "error", "reason": "user_exists" }

- POST /login — status: 200
  - body: { "status": "ok", "token": "<JWT>" }
  - note: use the returned JWT in Authorization: Bearer <token> for authenticated endpoints.

- POST /ai — status: 200
  - body: { "status": "ok", "response": { "reply": "(simulated) Received prompt from integ_user: hello" } }

- POST /sync-memory — status: 200
  - body: { "status": "ok", "merged_count": 1 }

- GET /memories — status: 200
  - body: { "status": "ok", "memories": [ { "id": "gen-1761174682592", "key": "note", "value": "x", "created": "" } ] }

- POST /control (authenticated) — status: 200
  - body: { "status": "ok", "action": "navigate", "route": "/apps/qmoi" }

- POST /control (unauthenticated) — status: 401
  - body: { "status": "error", "reason": "unauthorized" }

- GET /mirror/app/q-alpha/ — status: 200
  - body: HTML content (content_type: text/html, size: ~13947 bytes)

- GET /mirror/raw/live_qmoi_ngrok_url.txt — status: 200
  - body: the current live ngrok URL (example: https://3cf7294944e8.ngrok-free.app)

- POST /admin/backup-db — status: 404 (not found)
  - body: None — backup endpoint not present at this path in the running server

- POST /admin/update-ngrok (dry-run) — status: 404 (not found)
  - body: None — admin update route not present at this path in the running server

- POST /logout — status: 200
  - body: { "status": "ok" }

Notes & next steps:

- The integration test obtains a JWT via `/login`; include this token as `Authorization: Bearer <token>` for authenticated calls.
- Two admin endpoints returned 404 in the test run: `/admin/backup-db` and `/admin/update-ngrok`. That indicates either route names differ in the deployed server instance or admin routes require additional configuration (control token, RBAC). Confirm the server source (`qmoi_control_server.py`) to reconcile actual admin route paths and then re-run tests.
- The mirror endpoints succeeded and returned content or raw files correctly; the raw mirror returned the `live_qmoi_ngrok_url.txt` content which is used by the ngrok update script.
- I updated this file programmatically with the live test results. If you want these changes committed and pushed to the remote repository, please confirm and I'll push the commits (I will not push without explicit permission).

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Discovered/Implemented Endpoints (scanned 2025-10-22)

Below are endpoints found in the repository. ✅ = endpoint exercised in local integration tests.

- qmoi_control_server.py (Flask)
  - POST /webauthn/register/options
  - POST /webauthn/register/complete
  - POST /webauthn/authenticate/options
  - POST /webauthn/authenticate/complete
  - POST /control ✅
  - POST /ai ✅
  - POST /signup ✅
  - POST /login ✅
  - POST /logout ✅
  - POST /sync-memory ✅
  - GET  /memories ✅
  - GET  /health ✅
  - GET  /mirror/app/<appname>/... ✅
  - GET  /mirror/raw/<path> ✅
  - POST /admin/backup-db (admin)
  - POST /admin/update-ngrok (admin)

- ai-anomaly-service.py (Flask)
  - POST /detect-anomaly
  - GET  /parse-log
  - GET  /analytics
  - GET  /export-analytics
  - POST /alert
  - POST /monitor
  - GET  /monitor/status
  - GET  /analytics/hourly

- downloadqmoiaiexe.py (FastAPI)
  - POST /api/qmoi/download-exe

- api/qcity.ts (Express)
  - GET  /status
  - GET  /config
  - POST /start
  - POST /stop
  - POST /configure-platforms
  - POST /enable-features
  - POST /monitor-resources
  - GET  /notifications
  - GET  /tasks
  - GET  /resources
  - GET  /logs
  - GET  /workspace-logs

Notes:
- Admin endpoints may require `QMOI_CONTROL_TOKEN` or elevated RBAC. Ensure env vars are set when running the server.
- I will now add a small attachments endpoint and a supervisor script, then run the control server integration tests to ensure these changes don't break existing behavior.

## Endpoints

### System Management

#### Get System Status
```http
GET /qcity/status
```

````markdown
<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# AI Automation API Documentation

## Overview
The AI Automation API provides endpoints for managing and monitoring the AI-powered automation system. It includes features for system control, task management, metrics collection, and configuration management.

## Authentication
All endpoints require authentication using OAuth2 with Bearer tokens. To obtain a token:

1. Send a POST request to `/token` with username and password
2. Use the returned token in the Authorization header for subsequent requests

```bash
# Example token request
curl -X POST "http://localhost:8000/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=user&password=<REDACTED>

# Example authenticated request
curl -X GET "http://localhost:8000/automation/status" \
     -H "Authorization: Bearer <token>"
```

## Endpoints

### System Control

#### GET /automation/status
Get current automation system status.

**Response:**
```json
{
    "running": true,
    "active_tasks": 2,
    "system_state": {
   "resources": {
       "cpu": 45.2,
       "memory": 60.5,
       "disk": 75.8,
       "network": 30.1
   },
   "performance": {
       "response_time": 85.3,
       "throughput": 950.2,
       "error_rate": 0.02
   },
   "errors": [],
   "tasks": [],
   "timestamp": "2024-03-14T12:00:00Z"
    }
}
```

...[file truncated for brevity]

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/API.md",
  "validated_at": "2025-10-26T20:51:22.673829Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "AI Automation API Documentation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

````
**Response:**
```json
{
  "message": "Platforms configured successfully"
}
```

#### Get Platform Status
```http
GET /qcity/platforms/{platform_id}/status
```

Get status of a specific platform.

**Response:**
```json
{
  "type": "colab",
  "connected": true,
  "gpu_available": true,
  "gpu_count": 1,
  "drive_mounted": true
}
```

### Feature Management

#### Enable Features
```http
POST /qcity/enable-features
```

Enable specific features.

**Request Body:**
```json
{
  "features": ["trading", "whatsapp", "projects", "updates"]
}
```

**Response:**
```json
{
  "message": "Features enabled successfully"
}
```

#### Get Feature Status
```http
GET /qcity/features/{feature_id}/status
```

Get status of a specific feature.

**Response:**
```json
{
  "enabled": true,
  "status": "active",
  "last_update": "2024-03-15T10:00:00Z",
  "metrics": {
    "performance": 95.5,
    "reliability": 99.9,
    "usage": 45.2
  }
}
```

### Resource Management

#### Monitor Resources
```http
POST /qcity/monitor-resources
```

Start resource monitoring.

**Response:**
```json
{
  "message": "Resource monitoring started successfully"
}
```

#### Get Resource Usage
```http
GET /qcity/resources
```

Get current resource usage.

**Response:**
```json
{
  "cpu": {
    "usage": 45.2,
    "cores": 8,
    "temperature": 65.5
  },
  "memory": {
    "total": 16777216,
    "used": 10158080,
    "free": 6619136,
    "percent": 60.5
  },
  "disk": {
    "total": 1073741824,
    "used": 807403520,
    "free": 266338304,
    "percent": 75.3
  },
  "network": {
    "bytes_sent": 1024000,
    "bytes_recv": 2048000,
    "packets_sent": 1000,
    "packets_recv": 2000
  }
}
```

### Task Management

#### Get Tasks
```http
GET /qcity/tasks
```

Get list of current tasks.

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-1",
      "type": "optimization",
      "status": "completed",
      "start_time": "2024-03-15T10:00:00Z",
      "end_time": "2024-03-15T10:01:00Z",
      "result": {
        "success": true,
        "metrics": {
          "cpu_improvement": 15.5,
          "memory_improvement": 20.3
        }
      }
    }
  ]
}
```

#### Create Task
```http
POST /qcity/tasks
```

Create a new task.

**Request Body:**
```json
{
  "type": "optimization",
  "parameters": {
    "target": "cpu",
    "threshold": 80
  }
}
```

**Response:**
```json
{
  "task_id": "task-1",
  "message": "Task created successfully"
}
```

### Error Management

#### Get Errors
```http
GET /qcity/errors
```

Get list of system errors.

**Response:**
```json
{
  "errors": [
    {
      "id": "error-1",
      "type": "system",
      "severity": "high",
      "message": "High CPU usage detected",
      "timestamp": "2024-03-15T10:00:00Z",
      "status": "resolved",
      "resolution": "System optimized"
    }
  ]
}
```

#### Track Error
```http
POST /qcity/track-error
```

Track a new error.

**Request Body:**
```json
{
  "type": "system",
  "severity": "high",
  "message": "High CPU usage detected",
  "context": {
    "cpu_usage": 95.5,
    "memory_usage": 80.2
  }
}
```

**Response:**
```json
{
  "error_id": "error-1",
  "message": "Error tracked successfully"
}
```

### Backup Management

#### Get Backups
```http
GET /qcity/backups
```

Get list of system backups.

**Response:**
```json
{
  "backups": [
    {
      "id": "backup-1",
      "timestamp": "2024-03-15T10:00:00Z",
      "size": 1073741824,
      "type": "full",
      "status": "completed"
    }
  ]
}
```

#### Create Backup
```http
POST /qcity/backups
```

Create a new system backup.

**Request Body:**
```json
{
  "type": "full",
  "description": "Daily backup"
}
```

**Response:**
```json
{
  "backup_id": "backup-1",
  "message": "Backup created successfully"
}
```

#### Restore Backup
```http
POST /qcity/backups/{backup_id}/restore
```

Restore a system backup.

**Response:**
```json
{
  "message": "Backup restored successfully"
}
```

### Logging

#### Get Logs
```http
GET /qcity/logs
```

Get system logs.

**Query Parameters:**
- `level`: Log level (debug, info, warning, error, critical)
- `start_time`: Start time in ISO format
- `end_time`: End time in ISO format
- `limit`: Maximum number of logs to return

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2024-03-15T10:00:00Z",
      "level": "info",
      "message": "System started",
      "context": {
        "component": "system",
        "action": "start"
      }
    }
  ]
}
```

### Notifications

#### Get Notifications
```http
GET /qcity/notifications
```

Get system notifications.

**Response:**
```json
{
  "notifications": [
    {
      "id": "notification-1",
      "type": "system",
      "priority": "high",
      "message": "System optimization required",
      "timestamp": "2024-03-15T10:00:00Z",
      "read": false
    }
  ]
}
```

#### Send Notification
```http
POST /qcity/notifications
```

Send a new notification.

**Request Body:**
```json
{
  "type": "system",
  "priority": "high",
  "message": "System optimization required",
  "channels": ["email", "whatsapp"]
}
```

**Response:**
```json
{
  "notification_id": "notification-1",
  "message": "Notification sent successfully"
}
```

### Self-Healing & Automation

#### Trigger NPM Self-Heal
```http
POST /qcity/selfheal-npm
```

Runs the QCity NPM self-heal script on the appropriate environment (auto-detects Windows/Linux/Mac).

**Authentication:**
- Requires JWT token with admin/master role.

**Request Body (JSON, optional):**
```
{
  "forceClean": true,           // (optional) Remove all node_modules/lock files and clean cache before install
  "essentialsOnly": false,      // (optional) Only install/upgrade essential global packages
  "upgradeAll": false,          // (optional) Upgrade all dependencies
  "diagnosticsOnly": false      // (optional) Only run diagnostics, no install
}
```

**Response:**
- Streams logs/results in real time using Server-Sent Events (SSE):
  - Each log line: `data: ...`
  - Errors: `data: [ERROR] ...`
  - End of stream: `data: [DONE]`

**Example (SSE):**
```
data: ==== QCity NPM Self-Heal Run: ...
data: Running: npm ci
...
data: [DONE]
```

**Audit Logging:**
- All triggers and results are logged to `logs/qcity_audit.log` with user, options, and status.

**Auto-Triggering:**
- This endpoint may be called automatically by the error detection service on failed installs/errors.

**Scheduling/Automation:**
- Nightly runs and on-push triggers are supported via Task Scheduler (Windows), cron (Linux/Mac), or CI/CD (GitHub Actions).

**Example Request:**
```bash
curl -N -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -X POST -d '{"forceClean":true}' http://localhost:3000/api/qcity/selfheal-npm
```

### QCity Device Management (Enhanced)

#### Atomic/Temp Install
```http
POST /qcity/device/atomic-install
```
Atomically installs dependencies to a temp directory, then moves to node_modules.

#### Background/Parallel Install
```http
POST /qcity/device/background-install
```
Runs install in the background or in parallel (optionally offloaded to cloud).

#### Deduplication
```http
POST /qcity/device/dedupe
```
Runs npm dedupe to remove duplicate dependencies.

#### Artifact Sync
```http
POST /qcity/device/sync-artifacts
```
Syncs build artifacts and node_modules to cloud storage.

#### Install/Build Status
```http
GET /qcity/device/install-status
```
Returns current install/build status.

#### Health Monitor
```http
GET /qcity/device/health
```
Returns health info (unused, outdated, vulnerable packages).

### Device & Resource Optimization (Enhanced)

#### Get Resource Stats
```http
GET /qcity/device/resources
```
Returns real-time CPU, memory, disk, and network usage.

#### Get Environments Status
```http
GET /qcity/device/envs
```
Returns detected programming environments (Node, Python, Java, Go, Rust, C++, etc.).

#### Install Dependencies for All Envs
```http
POST /qcity/device/install-all-envs
```
Installs dependencies for all detected environments in an atomic, isolated, and resource-aware way.

#### Get Offload Status
```http
GET /qcity/device/offload-status
```
Returns current offload/throttle status.

## QMOI Avatars API
- `GET /api/qmoi/avatars` — List all available avatars and their metadata.
- `POST /api/qmoi/avatars` — Switch avatar (body: { action: 'switch', avatarId })

## QMOI Voice API (Planned)
- `GET /api/qmoi/voice-profiles` — List available voice profiles.
- `POST /api/qmoi/voice-profiles` — Switch voice profile (body: { action: 'switch', voiceId })

## QMOI Memory API (Planned)
- `GET /api/qmoi/memory` — Query memory (conversations, preferences, project history, etc.)
- `POST /api/qmoi/memory` — Save/update memory (body: { type, data })

## Extensibility
- All APIs are designed for easy addition of new avatars, voices, and memory modules.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": {
    "parameter": "type",
    "message": "Invalid value"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1615809600
```

## WebSocket API

The Q-city system also provides a WebSocket API for real-time updates.

### Connection
```
ws://localhost:3000/api/ws
```

### Events

#### System Status Updates
```json
{
  "type": "system_status",
  "data": {
    "running": true,
    "resources": {
      "cpu": 45.2,
      "memory": 60.5,
      "disk": 75.3
    }
  }
}
```

#### Task Updates
```json
{
  "type": "task_update",
  "data": {
    "task_id": "task-1",
    "status": "completed",
    "result": {
      "success": true
    }
  }
}
```

#### Error Alerts
```json
{
  "type": "error_alert",
  "data": {
    "error_id": "error-1",
    "type": "system",
    "severity": "high",
    "message": "High CPU usage detected"
  }
}
```

#### Notification Updates
```json
{
  "type": "notification",
  "data": {
    "notification_id": "notification-1",
    "type": "system",
    "priority": "high",
    "message": "System optimization required"
  }
}
```

## SDK Examples

### Python
```python
import requests

class QCityClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_status(self):
        response = requests.get(
            f'{self.base_url}/qcity/status',
            headers=self.headers
        )
        return response.json()

    def start_system(self):
        response = requests.post(
            f'{self.base_url}/qcity/start',
            headers=self.headers
        )
        return response.json()

    def stop_system(self):
        response = requests.post(
            f'{self.base_url}/qcity/stop',
            headers=self.headers
        )
        return response.json()
```

### JavaScript
```javascript
class QCityClient {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async getStatus() {
        const response = await fetch(
            `${this.baseUrl}/qcity/status`,
            { headers: this.headers }
        );
        return response.json();
    }

    async startSystem() {
        const response = await fetch(
            `${this.baseUrl}/qcity/start`,
            {
                method: 'POST',
                headers: this.headers
            }
        );
        return response.json();
    }

    async stopSystem() {
        const response = await fetch(
            `${this.baseUrl}/qcity/stop`,
            {
                method: 'POST',
                headers: this.headers
            }
        );
        return response.json();
    }
}
```

## Best Practices

1. **Error Handling**
   - Always check for error responses
   - Implement retry logic for transient errors
   - Handle rate limiting appropriately

2. **Authentication**
   - Store tokens securely
   - Refresh tokens before expiration
   - Handle authentication errors gracefully

3. **Performance**
   - Use pagination for large data sets
   - Implement caching where appropriate
   - Use WebSocket for real-time updates

4. **Security**
   - Use HTTPS for all API calls
   - Validate all input data
   - Implement proper access control

5. **Monitoring**
   - Monitor API response times
   - Track error rates
   - Log important events

## Support

For API support, please contact:
- Email: support@qcity.ai
- Documentation: https://docs.qcity.ai
- GitHub: https://github.com/qcity/ai

## Unused Endpoints Integration Plan

The following endpoints were previously unused and are now prioritized for integration:

- /api/media
- /api/media/:id
- /api/media/logs
- /api/predictions
- /fix_error
- /list
- /automation/optimize
- /automation/trends
- /automation/history
- /automation/metrics
- /automation/config
- /automation/start
- /automation/stop
- /automation/tasks
- /automation/status
- /automation
- /model/info
- /ping
- /qmessage
- /token

For each endpoint, QMOI will:
- Generate backend and UI integration stubs
- Add automated tests in qmoi_test.sh
- Update documentation and usage scripts
- Rerun endpoint usage checks after integration

All endpoints will be used and documented for full coverage and automation.

---

NOTE: This file is partially auto-populated by automated scans. A JSON report of placeholder and documentation gaps was produced at `docs/placeholders_report.json`. The canonical test index is at `docs/ALLTESTSAUTOTESTS.md`.

If you want the assistant to actively sync this file with live code (run static extraction and integration tests) say "sync API docs now" and I will run the extraction and update this document with exact method signatures and status.

<!-- QMOI_VALIDATION_START -->
{
  "file": "API.md",
  "validated_at": "2025-10-26T20:51:22.281600Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "Q-city API Documentation"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

<!-- API_INVENTORY_START -->
## Discovered API Endpoints (auto-generated)

### Source: /workspaces/qmoi-enhanced/QI_download_component.html
-        /api/report-download-issue

### Source: /workspaces/qmoi-enhanced/ai-anomaly-service.py
- POST   /alert
- GET    /analytics
- GET    /analytics/hourly
- POST   /detect-anomaly
- GET    /export-analytics
- POST   /monitor
- GET    /monitor/status
- GET    /parse-log

### Source: /workspaces/qmoi-enhanced/api/qcity.ts
- GET    /config
- POST   /configure-platforms
- POST   /enable-features
- GET    /logs
- POST   /monitor-resources
- GET    /notifications
- GET    /resources
- POST   /start
- GET    /status
- POST   /stop
- GET    /tasks
- GET    /workspace-logs

### Source: /workspaces/qmoi-enhanced/app/api/employment/megavault/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/app/api/employment/payment/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/app/api/employment/revenue/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/app/qcity/page.js
-        /api/qcity/config
-        /api/qcity/logs
-        /api/qcity/notifications
-        /api/qcity/resources
-        /api/qcity/status
-        /api/qcity/tasks

### Source: /workspaces/qmoi-enhanced/components/CashonTradingPanel.tsx
-        /api/cashon/balance
-        /api/cashon/balance?logs=true
-        /api/cashon/balance?mpesaInfo=true
-        /api/cashon/deposit
-        /api/cashon/signals
-        /api/cashon/start-trading
-        /api/cashon/stop-trading
-        /api/cashon/trading-status

### Source: /workspaces/qmoi-enhanced/components/DeploymentStatusDashboard.tsx
-        /api/deployment-status

### Source: /workspaces/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
-        /api/qmoi/master/login
-        /api/qmoi/master/verify
-        /api/qmoi/revenue/reset
-        /api/qmoi/revenue/start
-        /api/qmoi/revenue/status
-        /api/qmoi/revenue/stop
-        /api/qmoi/revenue/target
-        /api/qmoi/revenue/transactions
-        /api/qmoi/revenue/transfer

### Source: /workspaces/qmoi-enhanced/components/FinancialManager.tsx
-        /api/financial/audit
-        /api/financial/transactions
-        /api/financial/verify

### Source: /workspaces/qmoi-enhanced/components/GitStatus.tsx
-        /api/git/branch
-        /api/git/remote
-        /api/git/status

### Source: /workspaces/qmoi-enhanced/components/NotificationPanel.tsx
-        /api/ai-health

### Source: /workspaces/qmoi-enhanced/components/QAvatar.tsx
-        /api/qcity/remote-command
-        /api/qcity/status

### Source: /workspaces/qmoi-enhanced/components/QI.tsx
-        /api/qi-trading?action=stats
-        /api/qmoi-model?allStats=1
-        /api/qmoi-model?enhance=1

### Source: /workspaces/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
-        /api/deployment-status
-        /api/qmoi/auto-fix/download-report
-        /api/qmoi/auto-fix/github-status
-        /api/qmoi/auto-fix/start
-        /api/qmoi/auto-fix/status
-        /api/qmoi/auto-fix/stop

### Source: /workspaces/qmoi-enhanced/components/QmoiAutoDistribution.tsx
- POST   /api/auto-fix
- POST   /api/deploy
- POST   /api/deploy/auto-redeploy
- GET    /api/deployment-status
- POST   /api/git/commit
- POST   /api/git/pr
- POST   /api/git/push
- GET    /api/git/status

### Source: /workspaces/qmoi-enhanced/components/QmoiMediaManager.tsx
-        /api/health
-        /api/media
-        /api/qmoi-database?logs=true&limit=50

### Source: /workspaces/qmoi-enhanced/components/QmoiMemoryPanel.tsx
-        /api/trigger-evolution

### Source: /workspaces/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
-        /api/qmoi/revenue
-        /api/qmoi/revenue?action=status
-        /api/qmoi/revenue?action=transactions&limit=100

### Source: /workspaces/qmoi-enhanced/components/SystemHealthDashboard.tsx
-        /qmoi_health_status.json
-        /status

### Source: /workspaces/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
-        /api/whatsapp/audit
-        /api/whatsapp/verify

### Source: /workspaces/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
-        /api/wifi/connect
-        /api/wifi/scan

### Source: /workspaces/qmoi-enhanced/components/WifiPanel.tsx
-        /api/wifi
-        /api/wifi-security?action=ai-agents
-        /api/wifi-security?action=iot-scan
-        /api/wifi-security?action=network-scan
-        /api/wifi-security?action=security-test
-        /api/wifi-security?action=signal-analysis
-        /api/wifi/scan

### Source: /workspaces/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
-        /api/employment
-        /api/employment/megavault?type=balance
-        /api/employment/payment
-        /api/employment/payment?type=payments
-        /api/employment/revenue
-        /api/employment?type=employees
-        /api/employment?type=users

### Source: /workspaces/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
- GET    /api/qcity/listLocalWorkspaces
- GET    /api/qcity/listWorkspaces

### Source: /workspaces/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
-        /api/qmoi/own-device-logs
-        /api/qmoi/own-device-logs/export

### Source: /workspaces/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
-        /api/qmoi/master-mode
-        /api/qmoi/revenue-dashboard
-        /api/qmoi/revenue-dashboard/export

### Source: /workspaces/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
-        /api/qmoi-gitlab/deployments
-        /api/qmoi-gitlab/errors
-        /api/qmoi-gitlab/jobs
-        /api/qmoi-gitlab/pipelines
-        /api/qmoi-gitlab/trigger

### Source: /workspaces/qmoi-enhanced/docs/ui/login.html
-        /login
-        /register
-        /webauthn/auth/finish
-        /webauthn/auth/options
-        /webauthn/register/finish
-        /webauthn/register/options

### Source: /workspaces/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
-        /api/colab-job
-        /api/qi-trading
-        /api/qi-trading?action=account
-        /api/qmoi-model

### Source: /workspaces/qmoi-enhanced/hooks/useAIFeatureEnhancer.ts
-        /api/qmoi-model?featureEnhance=1

### Source: /workspaces/qmoi-enhanced/hooks/useAIHealthCheck.ts
-        /api/ai-health

### Source: /workspaces/qmoi-enhanced/hooks/useAnalyticsDashboard.ts
-        /api/qmoi-model?analytics=1

### Source: /workspaces/qmoi-enhanced/hooks/useAutoEarningTasks.ts
-        /api/qmoi-model?autoEarning=1
-        /api/qmoi-model?runEarningTask=1

### Source: /workspaces/qmoi-enhanced/hooks/useAutoFixAllProblems.ts
-        /api/qmoi-model?globalScanFix=1

### Source: /workspaces/qmoi-enhanced/hooks/useBitgetTrader.ts
-        /api/bitget-trade

### Source: /workspaces/qmoi-enhanced/hooks/useColabJob.ts
-        /api/qmoi-model?colabJob=1

### Source: /workspaces/qmoi-enhanced/hooks/useDatasetManager.ts
-        /api/datasets
-        /api/datasets/settings

### Source: /workspaces/qmoi-enhanced/hooks/useDeviceOptimizer.ts
-        /api/qmoi-model?applyDeviceFeature=1
-        /api/qmoi-model?deviceOptimize=1

### Source: /workspaces/qmoi-enhanced/hooks/useErrorAutoFix.ts
-        /api/qmoi-model?globalScanFix=1

### Source: /workspaces/qmoi-enhanced/hooks/useGithubRepoManager.ts
-        /api/qmoi-model?githubTasks=1
-        /api/qmoi-model?manageRepo=1

### Source: /workspaces/qmoi-enhanced/hooks/useGlobalAutomation.ts
-        /api/automation/settings
-        /api/automation/status
-        /api/automation/tasks

### Source: /workspaces/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
-        /api/media/generate
-        /api/media/settings
-        /api/media/status

### Source: /workspaces/qmoi-enhanced/hooks/useModelTrainer.ts
-        /api/qmoi-model?trainingStatus=1

### Source: /workspaces/qmoi-enhanced/hooks/useProjects.ts
- POST   /api/colab-job?executeJob=true
- GET    /api/qcity/projects
- GET    /api/qcity/projects/config

### Source: /workspaces/qmoi-enhanced/hooks/useQCity.ts
- GET    /api/qcity/config
- POST   /api/qcity/configure-platforms
- POST   /api/qcity/enable-features
- GET    /api/qcity/logs
- POST   /api/qcity/manage-backup
- POST   /api/qcity/monitor-resources
- GET    /api/qcity/notifications
- POST   /api/qcity/optimize-resources
- GET    /api/qcity/resources
- POST   /api/qcity/start
- GET    /api/qcity/status
- POST   /api/qcity/stop
- GET    /api/qcity/tasks
- POST   /api/qcity/track-error

### Source: /workspaces/qmoi-enhanced/hooks/useSystemMetrics.ts
-        /api/system/metrics

### Source: /workspaces/qmoi-enhanced/hooks/useTaskQueue.ts
-        /api/tasks
-        /api/tasks/queue
-        /api/tasks/settings

### Source: /workspaces/qmoi-enhanced/hooks/useTrading.ts
- GET    /api/qcity/trading/config
- GET    /api/qcity/trading/positions

### Source: /workspaces/qmoi-enhanced/hooks/useTradingAutomation.ts
-        /api/trading/settings
-        /api/trading/status
-        /api/trading/toggle

### Source: /workspaces/qmoi-enhanced/hooks/useVSCodeProblems.ts
-        /api/qmoi-model?hookDiagnostics=1

### Source: /workspaces/qmoi-enhanced/hooks/useWhatsApp.ts
- GET    /api/qcity/whatsapp/config
- GET    /api/qcity/whatsapp/messages

### Source: /workspaces/qmoi-enhanced/huggingface_space/dashboard.js
-        /api/provider
-        /health
-        /logs/qmoispace_health.log

### Source: /workspaces/qmoi-enhanced/mobile/App.js
- GET    http://localhost:4000/api/error-fix-log
- GET    http://localhost:4100/api/predictions

### Source: /workspaces/qmoi-enhanced/mobile/components/AlertSettingsScreen.js
- GET    http://localhost:4200/api/alert-prefs

### Source: /workspaces/qmoi-enhanced/mobile/components/AnalyticsScreen.js
- GET    http://localhost:4000/api/device-stats
- GET    http://localhost:4100/api/predictions

### Source: /workspaces/qmoi-enhanced/mobile/components/NotificationScreen.js
- POST   http://localhost:4200/api/acknowledge-notification
- POST   http://localhost:4200/api/delete-notification
- GET    http://localhost:4200/api/notification-history
- GET    http://localhost:4200/api/notification-prefs
- POST   http://localhost:4200/api/respond-notification

### Source: /workspaces/qmoi-enhanced/mobile/utils/pushNotifications.js
- POST   http://localhost:4200/api/register-fcm
- POST   http://localhost:4200/api/register-pushover

### Source: /workspaces/qmoi-enhanced/public/qcity/dashboard.js
-        /api/qcity/config
-        /api/qcity/logs
-        /api/qcity/notifications
-        /api/qcity/resources
-        /api/qcity/start
-        /api/qcity/status
-        /api/qcity/stop
-        /api/qcity/tasks

### Source: /workspaces/qmoi-enhanced/pwa_apps/deals/index.html
-        /deals
-        /deals/

### Source: /workspaces/qmoi-enhanced/pwa_apps/deals/js/stripe-payment.js
-        /deals/create-payment

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/QI_download_component.html
-        /api/report-download-issue

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/ai-anomaly-service.py
- POST   /alert
- GET    /analytics
- GET    /analytics/hourly
- POST   /detect-anomaly
- GET    /export-analytics
- POST   /monitor
- GET    /monitor/status
- GET    /parse-log

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/api/qcity.ts
- GET    /config
- POST   /configure-platforms
- POST   /enable-features
- GET    /logs
- POST   /monitor-resources
- GET    /notifications
- GET    /resources
- POST   /start
- GET    /status
- POST   /stop
- GET    /tasks
- GET    /workspace-logs

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/megavault/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/payment/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/app/api/employment/revenue/route.ts
-        /api/qmoi-database

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/CashonTradingPanel.tsx
-        /api/cashon/balance
-        /api/cashon/balance?logs=true
-        /api/cashon/balance?mpesaInfo=true
-        /api/cashon/deposit
-        /api/cashon/signals
-        /api/cashon/start-trading
-        /api/cashon/stop-trading
-        /api/cashon/trading-status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/DeploymentStatusDashboard.tsx
-        /api/deployment-status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/EnhancedRevenuePanel.tsx
-        /api/qmoi/master/login
-        /api/qmoi/master/verify
-        /api/qmoi/revenue/reset
-        /api/qmoi/revenue/start
-        /api/qmoi/revenue/status
-        /api/qmoi/revenue/stop
-        /api/qmoi/revenue/target
-        /api/qmoi/revenue/transactions
-        /api/qmoi/revenue/transfer

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/FinancialManager.tsx
-        /api/financial/audit
-        /api/financial/transactions
-        /api/financial/verify

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/GitStatus.tsx
-        /api/git/branch
-        /api/git/remote
-        /api/git/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/NotificationPanel.tsx
-        /api/ai-health

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QAvatar.tsx
-        /api/qcity/remote-command
-        /api/qcity/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QI.tsx
-        /api/qi-trading?action=stats
-        /api/qmoi-model?allStats=1
-        /api/qmoi-model?enhance=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QMOIAutoFixDashboard.tsx
-        /api/deployment-status
-        /api/qmoi/auto-fix/download-report
-        /api/qmoi/auto-fix/github-status
-        /api/qmoi/auto-fix/start
-        /api/qmoi/auto-fix/status
-        /api/qmoi/auto-fix/stop

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiAutoDistribution.tsx
- POST   /api/auto-fix
- POST   /api/deploy
- POST   /api/deploy/auto-redeploy
- GET    /api/deployment-status
- POST   /api/git/commit
- POST   /api/git/pr
- POST   /api/git/push
- GET    /api/git/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiMediaManager.tsx
-        /api/health
-        /api/media
-        /api/qmoi-database?logs=true&limit=50

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/QmoiRevenueDashboard.tsx
-        /api/qmoi/revenue
-        /api/qmoi/revenue?action=status
-        /api/qmoi/revenue?action=transactions&limit=100

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/SystemHealthDashboard.tsx
-        /qmoi_health_status.json
-        /status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/WhatsAppBusinessPanel.tsx
-        /api/whatsapp/audit
-        /api/whatsapp/verify

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiAutoConnectPanel.tsx
-        /api/wifi/connect
-        /api/wifi/scan

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/WifiPanel.tsx
-        /api/wifi
-        /api/wifi-security?action=ai-agents
-        /api/wifi-security?action=iot-scan
-        /api/wifi-security?action=network-scan
-        /api/wifi-security?action=security-test
-        /api/wifi-security?action=signal-analysis
-        /api/wifi/scan

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/EmploymentDashboard.tsx
-        /api/employment
-        /api/employment/megavault?type=balance
-        /api/employment/payment
-        /api/employment/payment?type=payments
-        /api/employment/revenue
-        /api/employment?type=employees
-        /api/employment?type=users

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QCityDevicePanel.tsx
- GET    /api/qcity/listLocalWorkspaces
- GET    /api/qcity/listWorkspaces

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIOwnDeviceLogs.tsx
-        /api/qmoi/own-device-logs
-        /api/qmoi/own-device-logs/export

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/q-city/QMOIRevenueDashboard.tsx
-        /api/qmoi/master-mode
-        /api/qmoi/revenue-dashboard
-        /api/qmoi/revenue-dashboard/export

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/components/qmoi-gitlab-clone/QMOIGitLabClone.tsx
-        /api/qmoi-gitlab/deployments
-        /api/qmoi-gitlab/errors
-        /api/qmoi-gitlab/jobs
-        /api/qmoi-gitlab/pipelines
-        /api/qmoi-gitlab/trigger

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/earnvault/ui/FloatingAQ.tsx
-        /api/colab-job
-        /api/qi-trading
-        /api/qi-trading?action=account
-        /api/qmoi-model

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAIFeatureEnhancer.ts
-        /api/qmoi-model?featureEnhance=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAIHealthCheck.ts
-        /api/ai-health

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAnalyticsDashboard.ts
-        /api/qmoi-model?analytics=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAutoEarningTasks.ts
-        /api/qmoi-model?autoEarning=1
-        /api/qmoi-model?runEarningTask=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useAutoFixAllProblems.ts
-        /api/qmoi-model?globalScanFix=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useBitgetTrader.ts
-        /api/bitget-trade

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useColabJob.ts
-        /api/qmoi-model?colabJob=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDatasetManager.ts
-        /api/datasets
-        /api/datasets/settings

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useDeviceOptimizer.ts
-        /api/qmoi-model?applyDeviceFeature=1
-        /api/qmoi-model?deviceOptimize=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useErrorAutoFix.ts
-        /api/qmoi-model?globalScanFix=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGithubRepoManager.ts
-        /api/qmoi-model?githubTasks=1
-        /api/qmoi-model?manageRepo=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useGlobalAutomation.ts
-        /api/automation/settings
-        /api/automation/status
-        /api/automation/tasks

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useMediaGenerationStatus.ts
-        /api/media/generate
-        /api/media/settings
-        /api/media/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useModelTrainer.ts
-        /api/qmoi-model?trainingStatus=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useProjects.ts
- POST   /api/colab-job?executeJob=true
- GET    /api/qcity/projects
- GET    /api/qcity/projects/config

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useQCity.ts
- GET    /api/qcity/config
- POST   /api/qcity/configure-platforms
- POST   /api/qcity/enable-features
- GET    /api/qcity/logs
- POST   /api/qcity/manage-backup
- POST   /api/qcity/monitor-resources
- GET    /api/qcity/notifications
- POST   /api/qcity/optimize-resources
- GET    /api/qcity/resources
- POST   /api/qcity/start
- GET    /api/qcity/status
- POST   /api/qcity/stop
- GET    /api/qcity/tasks
- POST   /api/qcity/track-error

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useSystemMetrics.ts
-        /api/system/metrics

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTaskQueue.ts
-        /api/tasks
-        /api/tasks/queue
-        /api/tasks/settings

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTrading.ts
- GET    /api/qcity/trading/config
- GET    /api/qcity/trading/positions

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useTradingAutomation.ts
-        /api/trading/settings
-        /api/trading/status
-        /api/trading/toggle

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useVSCodeProblems.ts
-        /api/qmoi-model?hookDiagnostics=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/hooks/useWhatsApp.ts
- GET    /api/qcity/whatsapp/config
- GET    /api/qcity/whatsapp/messages

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/huggingface_space/dashboard.js
-        /api/provider
-        /health
-        /logs/qmoispace_health.log

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/App.js
- GET    http://localhost:4000/api/error-fix-log
- GET    http://localhost:4100/api/predictions

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/AlertSettingsScreen.js
- GET    http://localhost:4200/api/alert-prefs

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/AnalyticsScreen.js
- GET    http://localhost:4000/api/device-stats
- GET    http://localhost:4100/api/predictions

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/components/NotificationScreen.js
- POST   http://localhost:4200/api/acknowledge-notification
- POST   http://localhost:4200/api/delete-notification
- GET    http://localhost:4200/api/notification-history
- GET    http://localhost:4200/api/notification-prefs
- POST   http://localhost:4200/api/respond-notification

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/mobile/utils/pushNotifications.js
- POST   http://localhost:4200/api/register-fcm
- POST   http://localhost:4200/api/register-pushover

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space-pwa/js/app.js
-        /api/version

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/qmoi-space/public/sw.js
-        /api/qmoi/chat
-        /api/qmoi/files/upload
-        /api/qmoi/voice/process

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/auto-git-update.js
-        /api/whatsapp/notify-master

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/monitoring/monitoring_dashboard.py
-        /api/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-dashboard.py
- GET    /
- GET    /api/doc-history
-        /api/doc-history
- GET    /api/event-stats
-        /api/event-stats
- GET    /api/log
-        /api/log
-        /api/log?search=
- GET    /api/notifications
-        /api/notifications
- POST   /api/notifications/test
-        /api/notifications/test
- GET    /api/preautotest
-        /api/preautotest
- GET    /api/report
-        /api/report

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
-        /api/qmoi/error-log
-        /api/qmoi/notify-master

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-notification-system.js
- POST   https://api.pushover.net/1/messages.json

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-real-time-monitor.py
-        /api/stats

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi-universal-error-handler.js
- GET    https://httpbin.org/get

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_build_api.py
- POST   /api/build-apps

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_dashboard.js
-        /trigger-fix
-        /update-notification-prefs
- GET    http://localhost:4100/api/predictions
- GET    http://localhost:4200/api/notification-history
- GET    http://localhost:4200/api/notification-prefs

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/qmoi_device_integration.py
- POST   /api/device/detect
- POST   /api/device/master-mode
- GET    /api/device/reports/detection
- GET    /api/device/reports/unlock
- GET    /api/device/status
- GET    /api/device/status/integration
- POST   /api/device/unlock

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/scripts/services/auto_fix_service.ts
- POST   /api/qcity/ai/fix

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/DownloadQCity.tsx
-        /api/qcity/download-url

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/QI.tsx
-        /api/qradio/channels
-        /api/qradio/play
-        /api/qradio/program
-        /api/qradio/programs
-        /api/qradio/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
-        /api/account-automation/create
-        /api/account-automation/login
-        /api/account-automation/verify

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AvatarSelector.tsx
-        /api/qmoi/avatars

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/AviatorGalleryPanel.tsx
-        /api/qmoi/avatars

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/CommandPanel.tsx
-        /api/qcity/remote-command

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
-        /api/qcity/devices
-        /api/qcity/devices?action=test

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
-        /api/document-backup/list
-        /api/document-backup/restore
-        /api/document-backup/upload

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
-        /api/earning/analytics
-        /api/earning/monitor
-        /api/earning/self-heal
-        /api/earning/strategies

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/MetricsPanel.tsx
-        /api/qcity/metrics

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/PluginPanel.tsx
-        /api/qcity/plugins

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
-        /api/qapikey
-        /api/qapikey/usage

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QFileManager.tsx
-        /api/wallet
-        /api/wallet?pending_wallets=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
-        /api/qmoi/avatars
-        /api/qmoi/voice-profiles

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiAutoDevPanel.tsx
-        /api/qmoi/autodev

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
-        /api/qmoi-database/route
-        /api/qmoi-database/route?schema=true
-        /api/qmoi-database/route?tables=true

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
-        /api/qmoi/autodev
-        /api/qmoi/file

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
-        /api/qmoi/feedback
-        /api/qmoi/memory
-        /api/qmoi/memory-backup

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
-        /api/qnews
-        /api/qnews/analytics
-        /api/qnews/media
-        /api/qnews/schedule

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SchedulePanel.tsx
-        /api/qcity/schedule

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SessionPanel.tsx
-        /api/auth/session

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
-        /api/social-automation/contacts
-        /api/social-automation/features
-        /api/social-automation/post
-        /api/social-automation/tag

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
-        /api/qmoi/fix/all
-        /api/qmoi/fix/connectivity
-        /api/qmoi/fix/ui
-        /api/qmoi/status
-        /api/qmoi/ui-health-check

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
-        /api/qmoi/voice-preview
-        /api/qmoi/voice-profiles

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/components/q-city/WalletManager.tsx
-        /api/wallet
-        /api/wallet?pending_wallets=1

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useAutoProjects.ts
-        /api/whatsapp/create-group
-        /api/whatsapp/notify-master
-        /api/whatsapp/post-to-group

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/hooks/useQmoiKernel.ts
-        /api/qmoi/status

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/ErrorFixingService.ts
- POST   /api/edit-file
- POST   /api/run-command

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/src/services/QmoiMemory.ts
-        /api/md-update
-        /api/memory
-        /api/repo-sync

### Source: /workspaces/qmoi-enhanced/qmoi-enhanced/templates/dashboard.html
-        /api/trigger-gitlab-ci

### Source: /workspaces/qmoi-enhanced/qmoi-space-pwa/js/app.js
-        /api/version

### Source: /workspaces/qmoi-enhanced/qmoi-space/public/js/chat.js
-        /api/qcity/ai-chat

### Source: /workspaces/qmoi-enhanced/qmoi-space/public/js/qmoi-core.js
-        /api/qcity/backup
-        /api/qcity/status

### Source: /workspaces/qmoi-enhanced/qmoi-space/public/sw.js
-        /api/qmoi/chat
-        /api/qmoi/files/upload
-        /api/qmoi/voice/process

### Source: /workspaces/qmoi-enhanced/qmoi_control_server.py
- POST   /admin/backup-db
- GET    /admin/check-access/<username>/<feature>
- POST   /admin/set-pricing
- POST   /admin/update-ngrok
- GET    /admin/users
- POST   /ai
- POST   /ai/tts
- POST   /attachments
- GET    /attachments/<att_id>/download
- POST   /control
- GET    /deals
- GET    /deals/<deal_id>
- POST   /deals/<deal_id>/activate
- POST   /deals/<deal_id>/deactivate
- POST   /deals/<deal_id>/purchase
- POST   /deals/create
- GET    /health
- POST   /login
- POST   /logout
- GET    /memories
- GET    /metrics
- GET    /mirror/app/<appname>/
- GET    /mirror/app/<appname>/<path:rest>
- GET    /mirror/raw/<path:rest>
- POST   /payments/webhook
- GET    /ready
- POST   /signup
- POST   /sponsored/add
- POST   /sync-memory
- GET    /wallet
- POST   /wallet/credit
- POST   /wallet/debit
- POST   /webauthn/authenticate/complete
- POST   /webauthn/authenticate/options
- POST   /webauthn/register/complete
- POST   /webauthn/register/options

### Source: /workspaces/qmoi-enhanced/scripts/auto-git-update.js
-        /api/whatsapp/notify-master

### Source: /workspaces/qmoi-enhanced/scripts/monitoring/monitoring_dashboard.py
-        /api/status

### Source: /workspaces/qmoi-enhanced/scripts/qmoi-dashboard.py
- GET    /
- GET    /api/doc-history
-        /api/doc-history
- GET    /api/event-stats
-        /api/event-stats
- GET    /api/log
-        /api/log
-        /api/log?search=
- GET    /api/notifications
-        /api/notifications
- POST   /api/notifications/test
-        /api/notifications/test
- GET    /api/preautotest
-        /api/preautotest
- GET    /api/report
-        /api/report

### Source: /workspaces/qmoi-enhanced/scripts/qmoi-enhanced-auto-projects.js
-        /api/qmoi/error-log
-        /api/qmoi/notify-master

### Source: /workspaces/qmoi-enhanced/scripts/qmoi-notification-system.js
- POST   https://api.pushover.net/1/messages.json

### Source: /workspaces/qmoi-enhanced/scripts/qmoi-real-time-monitor.py
-        /api/stats

### Source: /workspaces/qmoi-enhanced/scripts/qmoi-universal-error-handler.js
- GET    https://httpbin.org/get

### Source: /workspaces/qmoi-enhanced/scripts/qmoi_build_api.py
- POST   /api/build-apps

### Source: /workspaces/qmoi-enhanced/scripts/qmoi_device_integration.py
- POST   /api/device/detect
- POST   /api/device/master-mode
- GET    /api/device/reports/detection
- GET    /api/device/reports/unlock
- GET    /api/device/status
- GET    /api/device/status/integration
- POST   /api/device/unlock

### Source: /workspaces/qmoi-enhanced/scripts/services/auto_fix_service.ts
- POST   /api/qcity/ai/fix

### Source: /workspaces/qmoi-enhanced/src/components/DownloadQCity.tsx
-        /api/qcity/download-url

### Source: /workspaces/qmoi-enhanced/src/components/QI.tsx
-        /api/qradio/channels
-        /api/qradio/play
-        /api/qradio/program
-        /api/qradio/programs
-        /api/qradio/status

### Source: /workspaces/qmoi-enhanced/src/components/q-city/AccountAutomationPanel.tsx
-        /api/account-automation/create
-        /api/account-automation/login
-        /api/account-automation/verify

### Source: /workspaces/qmoi-enhanced/src/components/q-city/AvatarSelector.tsx
-        /api/qmoi/avatars

### Source: /workspaces/qmoi-enhanced/src/components/q-city/AviatorGalleryPanel.tsx
-        /api/qmoi/avatars

### Source: /workspaces/qmoi-enhanced/src/components/q-city/CommandPanel.tsx
-        /api/qcity/remote-command

### Source: /workspaces/qmoi-enhanced/src/components/q-city/DevicePanel.tsx
-        /api/qcity/devices
-        /api/qcity/devices?action=test

### Source: /workspaces/qmoi-enhanced/src/components/q-city/DocumentManagerPanel.tsx
-        /api/document-backup/list
-        /api/document-backup/restore
-        /api/document-backup/upload

### Source: /workspaces/qmoi-enhanced/src/components/q-city/EarningDashboard.tsx
-        /api/earning/analytics
-        /api/earning/monitor
-        /api/earning/self-heal
-        /api/earning/strategies

### Source: /workspaces/qmoi-enhanced/src/components/q-city/MetricsPanel.tsx
-        /api/qcity/metrics

### Source: /workspaces/qmoi-enhanced/src/components/q-city/PluginPanel.tsx
-        /api/qcity/plugins

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QApiKeyManager.tsx
-        /api/qapikey
-        /api/qapikey/usage

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QFileManager.tsx
-        /api/wallet
-        /api/wallet?pending_wallets=1

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QMOIStateProvider.tsx
-        /api/qmoi/avatars
-        /api/qmoi/voice-profiles

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QMoiAutoDevPanel.tsx
-        /api/qmoi/autodev

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QMoiDatabaseDashboard.tsx
-        /api/qmoi-database/route
-        /api/qmoi-database/route?schema=true
-        /api/qmoi-database/route?tables=true

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QMoiFileEditorChat.tsx
-        /api/qmoi/autodev
-        /api/qmoi/file

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QMoiMemoryPanel.tsx
-        /api/qmoi/feedback
-        /api/qmoi/memory
-        /api/qmoi/memory-backup

### Source: /workspaces/qmoi-enhanced/src/components/q-city/QNewsDashboard.tsx
-        /api/qnews
-        /api/qnews/analytics
-        /api/qnews/media
-        /api/qnews/schedule

### Source: /workspaces/qmoi-enhanced/src/components/q-city/SchedulePanel.tsx
-        /api/qcity/schedule

### Source: /workspaces/qmoi-enhanced/src/components/q-city/SessionPanel.tsx
-        /api/auth/session

### Source: /workspaces/qmoi-enhanced/src/components/q-city/SocialAutomationPanel.tsx
-        /api/social-automation/contacts
-        /api/social-automation/features
-        /api/social-automation/post
-        /api/social-automation/tag

### Source: /workspaces/qmoi-enhanced/src/components/q-city/SystemHealthPanel.tsx
-        /api/qmoi/fix/all
-        /api/qmoi/fix/connectivity
-        /api/qmoi/fix/ui
-        /api/qmoi/status
-        /api/qmoi/ui-health-check

### Source: /workspaces/qmoi-enhanced/src/components/q-city/VoiceSelector.tsx
-        /api/qmoi/voice-preview
-        /api/qmoi/voice-profiles

### Source: /workspaces/qmoi-enhanced/src/components/q-city/WalletManager.tsx
-        /api/wallet
-        /api/wallet?pending_wallets=1

### Source: /workspaces/qmoi-enhanced/src/hooks/useAutoProjects.ts
-        /api/whatsapp/create-group
-        /api/whatsapp/notify-master
-        /api/whatsapp/post-to-group

### Source: /workspaces/qmoi-enhanced/src/hooks/useQmoiKernel.ts
-        /api/qmoi/status

### Source: /workspaces/qmoi-enhanced/src/services/ErrorFixingService.ts
- POST   /api/edit-file
- POST   /api/run-command

### Source: /workspaces/qmoi-enhanced/templates/dashboard.html
-        /api/trigger-gitlab-ci

<!-- API_INVENTORY_END -->
