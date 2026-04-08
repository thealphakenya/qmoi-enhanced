# HOOKS.md - React Hooks Directory

**Last Updated**: 2026-04-08
**Total Hooks**: 496
**Last Scan**: 2026-04-08T22:06:16.777038

## Overview

This file documents all custom React hooks in the `hooks/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space.

## Hook Statistics

- **Total Custom Hooks**: 496
- **Active Hooks**: 496
- **Integration Status**: ✅ All hooks integrated and tested

## All Hooks

- [user-registration.test](./__tests__/integration/user-registration.test.ts) - user-registration.test hook
- [useAuth](./app/hooks/useAuth.ts) - useAuth hook
- [use-mobilex](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/components/ui/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/components/ui/use-toast.ts) - use-toast hook
- [use-mobilex](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/use-toast.ts) - use-toast hook
- [useAIFeatureEnhancer](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAIFeatureEnhancer.ts) - useAIFeatureEnhancer hook
- [useAIHealthCheck](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAIHealthCheck.ts) - useAIHealthCheck hook
- [useAnalyticsDashboard](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAnalyticsDashboard.ts) - useAnalyticsDashboard hook
- [useAutoEarningTasks](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAutoEarningTasks.ts) - useAutoEarningTasks hook
- [useAutoFixAllProblems](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAutoFixAllProblems.ts) - useAutoFixAllProblems hook
- [useDatasetManager](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useDatasetManager.ts) - useDatasetManager hook
- [useDeviceOptimizer](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useDeviceOptimizer.ts) - useDeviceOptimizer hook
- [useErrorAutoFix](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useErrorAutoFix.ts) - useErrorAutoFix hook
- [useGithubRepoManager](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useGithubRepoManager.ts) - useGithubRepoManager hook
- [useGlobalAutomation](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useGlobalAutomation.ts) - useGlobalAutomation hook
- [useMediaGenerationStatus](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useMediaGenerationStatus.ts) - useMediaGenerationStatus hook
- [useModelTrainer](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useModelTrainer.ts) - useModelTrainer hook
- [useQCity](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useQCity.ts) - useQCity hook
- [useSystemMetrics](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useSystemMetrics.ts) - useSystemMetrics hook
- [useTTCVoice](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useTTCVoice.ts) - useTTCVoice hook
- [useTaskQueue](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useTaskQueue.ts) - useTaskQueue hook
- [useTrading](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useTrading.ts) - useTrading hook
- [useTradingAutomation](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useTradingAutomation.ts) - useTradingAutomation hook
- [useVSCodeProblems](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useVSCodeProblems.ts) - useVSCodeProblems hook
- [useWhatsApp](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useWhatsApp.ts) - useWhatsApp hook
- [use-toastx](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/src/components/ui/use-toast.tsx) - use-toastx hook
- [useAuth](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/src/hooks/useAuth.ts) - useAuth hook
- [useQmoiKernel](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/src/hooks/useQmoiKernel.ts) - useQmoiKernel hook
- [useTimezone](./backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/src/hooks/useTimezone.ts) - useTimezone hook
- [useAutoProjects](./backups/final_fix_backup_20260326_232609/backups/pre_fix_backup_20260326_232205/_archive_qmoi-enhanced/src/hooks/useAutoProjects.ts) - useAutoProjects hook
- [useAutoProjects](./backups/final_fix_backup_20260326_232609/backups/pre_fix_backup_20260326_232205/backups/src.backup.20260121144720/hooks/useAutoProjects.ts) - useAutoProjects hook
- [useAutoProjects](./backups/final_fix_backup_20260326_232609/backups/pre_fix_backup_20260326_232205/src/hooks/useAutoProjects.ts) - useAutoProjects hook
- [use-toastx](./backups/final_fix_backup_20260326_232609/backups/src.backup.20260121144720/components/ui/use-toast.tsx) - use-toastx hook
- [useAuth](./backups/final_fix_backup_20260326_232609/backups/src.backup.20260121144720/hooks/useAuth.ts) - useAuth hook
- [useQmoiKernel](./backups/final_fix_backup_20260326_232609/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts) - useQmoiKernel hook
- [useTimezone](./backups/final_fix_backup_20260326_232609/backups/src.backup.20260121144720/hooks/useTimezone.ts) - useTimezone hook
- [use-mobilex](./backups/final_fix_backup_20260326_232609/components/ui/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_232609/components/ui/use-toast.ts) - use-toast hook
- [user-flows.cy](./backups/final_fix_backup_20260326_232609/cypress/e2e/user-flows.cy.ts) - user-flows.cy hook
- [use-mobile](./backups/final_fix_backup_20260326_232609/hooks/use-mobile.ts) - use-mobile hook
- [use-mobilex](./backups/final_fix_backup_20260326_232609/hooks/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_232609/hooks/use-toast.ts) - use-toast hook
- [useAIFeatureEnhancer](./backups/final_fix_backup_20260326_232609/hooks/useAIFeatureEnhancer.ts) - useAIFeatureEnhancer hook
- [useAIHealthCheck](./backups/final_fix_backup_20260326_232609/hooks/useAIHealthCheck.ts) - useAIHealthCheck hook
- [useAnalyticsDashboard](./backups/final_fix_backup_20260326_232609/hooks/useAnalyticsDashboard.ts) - useAnalyticsDashboard hook
- [useAutoEarningTasks](./backups/final_fix_backup_20260326_232609/hooks/useAutoEarningTasks.ts) - useAutoEarningTasks hook
- [useAutoFixAllProblems](./backups/final_fix_backup_20260326_232609/hooks/useAutoFixAllProblems.ts) - useAutoFixAllProblems hook
- [useDatasetManager](./backups/final_fix_backup_20260326_232609/hooks/useDatasetManager.ts) - useDatasetManager hook
- [useDatasets](./backups/final_fix_backup_20260326_232609/hooks/useDatasets.ts) - useDatasets hook
- [useDeviceOptimizer](./backups/final_fix_backup_20260326_232609/hooks/useDeviceOptimizer.ts) - useDeviceOptimizer hook
- [useErrorAutoFix](./backups/final_fix_backup_20260326_232609/hooks/useErrorAutoFix.ts) - useErrorAutoFix hook
- [useGithubRepoManager](./backups/final_fix_backup_20260326_232609/hooks/useGithubRepoManager.ts) - useGithubRepoManager hook
- [useGlobalAutomation](./backups/final_fix_backup_20260326_232609/hooks/useGlobalAutomation.ts) - useGlobalAutomation hook
- [useMediaGenerationStatus](./backups/final_fix_backup_20260326_232609/hooks/useMediaGenerationStatus.ts) - useMediaGenerationStatus hook
- [useModelTrainer](./backups/final_fix_backup_20260326_232609/hooks/useModelTrainer.ts) - useModelTrainer hook
- [useQCity](./backups/final_fix_backup_20260326_232609/hooks/useQCity.ts) - useQCity hook
- [useQMOIChat](./backups/final_fix_backup_20260326_232609/hooks/useQMOIChat.ts) - useQMOIChat hook
- [useSystemMetrics](./backups/final_fix_backup_20260326_232609/hooks/useSystemMetrics.ts) - useSystemMetrics hook
- [useTTCVoice](./backups/final_fix_backup_20260326_232609/hooks/useTTCVoice.ts) - useTTCVoice hook
- [useTaskQueue](./backups/final_fix_backup_20260326_232609/hooks/useTaskQueue.ts) - useTaskQueue hook
- [useTrading](./backups/final_fix_backup_20260326_232609/hooks/useTrading.ts) - useTrading hook
- [useTradingAutomation](./backups/final_fix_backup_20260326_232609/hooks/useTradingAutomation.ts) - useTradingAutomation hook
- [useVSCodeProblems](./backups/final_fix_backup_20260326_232609/hooks/useVSCodeProblems.ts) - useVSCodeProblems hook
- [useWhatsApp](./backups/final_fix_backup_20260326_232609/hooks/useWhatsApp.ts) - useWhatsApp hook
- [use-toastx](./backups/final_fix_backup_20260326_232609/src/components/ui/use-toast.tsx) - use-toastx hook
- [useAuth](./backups/final_fix_backup_20260326_232609/src/hooks/useAuth.ts) - useAuth hook
- [useQMOIChat](./backups/final_fix_backup_20260326_232609/src/hooks/useQMOIChat.ts) - useQMOIChat hook
- [useQmoiKernel](./backups/final_fix_backup_20260326_232609/src/hooks/useQmoiKernel.ts) - useQmoiKernel hook
- [useQmoiState](./backups/final_fix_backup_20260326_232609/src/hooks/useQmoiState.ts) - useQmoiState hook
- [useTimezone](./backups/final_fix_backup_20260326_232609/src/hooks/useTimezone.ts) - useTimezone hook
- [user-registration.test](./backups/final_fix_backup_20260326_233109/__tests__/integration/user-registration.test.ts) - user-registration.test hook
- [useBitgetTrader](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useBitgetTrader.ts) - useBitgetTrader hook
- [useColabJob](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useColabJob.ts) - useColabJob hook
- [useDeviceHealth](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useDeviceHealth.ts) - useDeviceHealth hook
- [useExtensionManager](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useExtensionManager.ts) - useExtensionManager hook
- [useLargeFileUpload](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useLargeFileUpload.ts) - useLargeFileUpload hook
- [useProjects](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/hooks/useProjects.ts) - useProjects hook
- [useAutoProjects](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/src/hooks/useAutoProjects.ts) - useAutoProjects hook
- [useQmoiKernel.test](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/src/hooks/useQmoiKernel.test.ts) - useQmoiKernel.test hook
- [useQmoiState](./backups/final_fix_backup_20260326_233109/_archive_qmoi-enhanced/src/hooks/useQmoiState.ts) - useQmoiState hook
- [use-mobilex](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/components/ui/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/components/ui/use-toast.ts) - use-toast hook
- [use-mobilex](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/use-mobile.tsx) - use-mobilex hook
- [use-toast](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/use-toast.ts) - use-toast hook
- [useAIFeatureEnhancer](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAIFeatureEnhancer.ts) - useAIFeatureEnhancer hook
- [useAIHealthCheck](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAIHealthCheck.ts) - useAIHealthCheck hook
- [useAnalyticsDashboard](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAnalyticsDashboard.ts) - useAnalyticsDashboard hook
- [useAutoEarningTasks](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAutoEarningTasks.ts) - useAutoEarningTasks hook
- [useAutoFixAllProblems](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useAutoFixAllProblems.ts) - useAutoFixAllProblems hook
- [useDatasetManager](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useDatasetManager.ts) - useDatasetManager hook
- [useDeviceOptimizer](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useDeviceOptimizer.ts) - useDeviceOptimizer hook
- [useErrorAutoFix](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useErrorAutoFix.ts) - useErrorAutoFix hook
- [useGithubRepoManager](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useGithubRepoManager.ts) - useGithubRepoManager hook
- [useGlobalAutomation](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useGlobalAutomation.ts) - useGlobalAutomation hook
- [useMediaGenerationStatus](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useMediaGenerationStatus.ts) - useMediaGenerationStatus hook
- [useModelTrainer](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useModelTrainer.ts) - useModelTrainer hook
- [useQCity](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useQCity.ts) - useQCity hook
- [useSystemMetrics](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useSystemMetrics.ts) - useSystemMetrics hook
- [useTTCVoice](./backups/final_fix_backup_20260326_233109/backups/final_fix_backup_20260326_232609/_archive_qmoi-enhanced/hooks/useTTCVoice.ts) - useTTCVoice hook
