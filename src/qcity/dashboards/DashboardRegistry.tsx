"use client";

import React from "react";
import QMOIDashboard from "./QMOIDashboard";
import Dashboard from "./Dashboard";
import EnhancedQMOIDashboard from "./EnhancedQMOIDashboard";
import QMoiDatabaseDashboard from "./QMoiDatabaseDashboard";
import QMoiProjectDashboard from "./QMoiProjectDashboard";
import ProductionRevenueDashboard from "./ProductionRevenueDashboard";
import EarningDashboard from "./EarningDashboard";
import QNewsDashboard from "./QNewsDashboard";

/**
 * Dashboard variant types
 * Each variant represents a different view or data focus
 */
export type DashboardVariant =
  | "qmoi"
  | "default"
  | "enhanced"
  | "database"
  | "project"
  | "revenue"
  | "earnings"
  | "news";

/**
 * Props for DashboardRegistry component
 */
interface DashboardRegistryProps {
  /** Dashboard variant to display (defaults to 'default') */
  variant?: DashboardVariant;
  /** Additional props to pass to the dashboard component */
  [key: string]: any;
}

/**
 * Dashboard registry mapping variant names to components
 */
const dashboardRegistry: Record<DashboardVariant, React.ComponentType<any>> = {
  qmoi: QMOIDashboard,
  default: Dashboard,
  enhanced: EnhancedQMOIDashboard,
  database: QMoiDatabaseDashboard,
  project: QMoiProjectDashboard,
  revenue: ProductionRevenueDashboard,
  earnings: EarningDashboard,
  news: QNewsDashboard,
};

/**
 * DashboardRegistry Component
 * Provides unified access to all dashboard variants with dynamic selection
 *
 * @example
 * // Use with variant selection
 * <DashboardRegistry variant="enhanced" />
 *
 * @example
 * // Pass additional props to dashboard
 * <DashboardRegistry variant="database" isMaster={true} />
 */
export function DashboardRegistry({
  variant = "default",
  ...props
}: DashboardRegistryProps) {
  const DashboardComponent = dashboardRegistry[variant] || Dashboard;
  return <DashboardComponent {...props} />;
}

/**
 * Get a specific dashboard component by variant
 * Useful for direct imports when not using the registry wrapper
 *
 * @param variant - Dashboard variant name
 * @returns The dashboard component for the variant
 *
 * @example
 * const EnhancedDash = getDashboardComponent('enhanced');
 * <EnhancedDash />
 */
export function getDashboardComponent(
  variant: DashboardVariant
): React.ComponentType<any> {
  return dashboardRegistry[variant] || Dashboard;
}

/**
 * Get all available dashboard variants
 * @returns Array of available variant names
 */
export function getAvailableDashboards(): DashboardVariant[] {
  return Object.keys(dashboardRegistry) as DashboardVariant[];
}

export default DashboardRegistry;
