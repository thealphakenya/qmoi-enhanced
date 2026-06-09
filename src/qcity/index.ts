// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:25Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Core Dashboards (consolidated into dashboards/ subdirectory)
export {
  QMOIDashboard,
  EnhancedQMOIDashboard,
  QMoiDatabaseDashboard,
  QMoiProjectDashboard,
  EarningDashboard,
  ProductionRevenueDashboard,
  QNewsDashboard,
  DashboardRegistry,
  getDashboardComponent,
  getAvailableDashboards,
  type DashboardVariant,
} from "./dashboards";
export { default as RoleBasedDashboard } from "./RoleBasedDashboard";

// Control Panels
export { default as QMoiKernelPanel } from "./QMoiKernelPanel";
export { default as QMoiMemoryPanel } from "./QMoiMemoryPanel";
export { default as QMoiToolbar } from "./QMoiToolbar";
export { default as QMoiFileEditorChat } from "./QMoiFileEditorChat";
export { default as QMoiMediaManager } from "./QMoiMediaManager";
export { default as QMoiSettingsPanel } from "./QMoiSettingsPanel";
export { default as QMoiAutoDevPanel } from "./QMoiAutoDevPanel";

// System & Automation
export { default as AccountAutomationPanel } from "./AccountAutomationPanel";
export { default as SocialAutomationPanel } from "./SocialAutomationPanel";
export { default as DevicesHub } from "./DevicesHub";
export { default as DevicePanel } from "./DevicePanel";
export { default as SystemHealthPanel } from "./SystemHealthPanel";
export { default as SelfTrainingEcosystem } from "./SelfTrainingEcosystem";
export { default as SelfHealPanel } from "./SelfHealPanel";

// Management & Tools
export { default as MetricsPanel } from "./MetricsPanel";
export { default as SchedulePanel } from "./SchedulePanel";
export { default as PluginPanel } from "./PluginPanel";
export { default as SessionPanel } from "./SessionPanel";
export { default as HelpPanel } from "./HelpPanel";
export { default as QApiKeyManager } from "./QApiKeyManager";
export { default as DocumentManagerPanel } from "./DocumentManagerPanel";
export { default as QFileManager } from "./QFileManager";
export { default as WalletManager } from "./WalletManager";

// AI & Intelligence
export { default as AIEconomySystem } from "./AIEconomySystem";
export { default as AIAgentSystem } from "./AIAgentSystem";
export { default as AutoMLEngine } from "./AutoMLEngine";
export { default as KnowledgeEngine } from "./KnowledgeEngine";
export { default as GlobalAIKnowledgeGraph } from "./GlobalAIKnowledgeGraph";
export { default as AutonomousDevelopmentPipeline } from "./AutonomousDevelopmentPipeline";

// UI & Experience
export { default as AvatarSelector } from "./AvatarSelector";
export { VoiceSelector } from "../shared/voice";
export { default as MoodTracker } from "./MoodTracker";
export { default as CommandPanel } from "./CommandPanel";
export { default as Onboarding } from "./Onboarding";

// Specialized Features
export { default as UnifiedAPI } from "./UnifiedAPI";
export { default as AutoHealingPlatform } from "./AutoHealingPlatform";
export { default as RelationshipInsightsPanel } from "./RelationshipInsightsPanel";
export { default as ResearchCenterPanel } from "./ResearchCenterPanel";
export { default as LanguageLabPanel } from "./LanguageLabPanel";
export { default as BackupRestorePanel } from "./BackupRestorePanel";
export { default as AuditLogPanel } from "./AuditLogPanel";

// State Management
export { QMoiState } from "./QMoiState";
export { QMoiStateProvider } from "./QMoiStateProvider";
export { default as QMoiStateContext } from "./QMoiStateContext";

// Legacy / Additional
export { default as QMoiAutoDevPanel } from "./QMoiAutoDevPanel";
export { default as QMOIAutoFixDashboard } from "./QMOIAutoFixDashboard";
export { default as DistributedCompute } from "./DistributedCompute";
