// Dashboard components barrel export
// Re-exports all dashboard variants and registry functions

export {
  DashboardRegistry,
  getDashboardComponent,
  getAvailableDashboards,
  type DashboardVariant,
} from "./DashboardRegistry";

// Individual dashboard exports for backward compatibility
export { default as QMOIDashboard } from "./QMOIDashboard";
export { default as Dashboard } from "./Dashboard";
export { default as EnhancedQMOIDashboard } from "./EnhancedQMOIDashboard";
export { default as QMoiDatabaseDashboard } from "./QMoiDatabaseDashboard";
export { default as QMoiProjectDashboard } from "./QMoiProjectDashboard";
export { default as ProductionRevenueDashboard } from "./ProductionRevenueDashboard";
export { default as EarningDashboard } from "./EarningDashboard";
export { default as QNewsDashboard } from "./QNewsDashboard";
