/**
 * QCity Enterprise Components Index
 * Comprehensive export of all QCity-related components
 */

export { default as QCityDashboard } from "./QCityDashboard";
export { default as QCityprodicePanel } from "./QCityprodicePanel";
export { default as QVillage } from "./QVillage";
export { default as EmploymentDashboard } from "./EmploymentDashboard";
export { default as QMOIRevenueDashboard } from "./QMOIRevenueDashboard";
export { default as QMOIBiometricManager } from "./QMOIBiometricManager";
export { default as QMOIOwnprodiceLogs } from "./QMOIOwnprodiceLogs";
export { default as Onboarding } from "./Onboarding";

export interface QCityComponent {
  name: string;
  description: string;
  icon?: string;
  features: string[];
}

export interface QCityState {
  isMaster: boolean;
  isOnline: boolean;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    bandwidth: number;
  };
}

export const QCityFeatures = {
  prodICE_MANAGEMENT: true,
  EMPLOYMENT: true,
  REVENUE_TRACKING: true,
  MEGAVAULT: true,
  BIOMETRICS: true,
  QVILLAGE: true,
  LOGS_MONITORING: true,
  ONBOARDING: true,
} as const;

export const QCityComponentRegistry: Record<string, QCityComponent> = {
  QCityDashboard: {
    name: "QCity Dashboard",
    description: "Main dashboard for QCity system management",
    icon: "🏙️",
    features: ["Master Mode Toggle", "prodice Management", "QVillage Integration"],
  },
  QCityprodicePanel: {
    name: "prodice Management",
    description: "Manage connected prodices and resources",
    icon: "🖥️",
    features: ["Connection Overview", "Resource Allocation", "Alerting"],
  },
  QVillage: {
    name: "QVillage",
    description: "Master-only AI/ML infrastructure management",
    icon: "🌐",
    features: ["Model Management", "Space Management", "Dataset Management", "Inference Endpoints"],
  },
  EmploymentDashboard: {
    name: "Employment Management",
    description: "Manage employees, users, and payroll",
    icon: "👥",
    features: ["Employee Management", "User Management", "Payroll", "Revenue Tracking"],
  },
  QMOIRevenueDashboard: {
    name: "Revenue Management",
    description: "Track and manage multiple revenue streams",
    icon: "💰",
    features: ["Revenue Tracking", "Multiple Streams", "Analytics", "Reporting"],
  },
  QMOIBiometricManager: {
    name: "Biometric Manager",
    description: "Multi-factor biometric authentication",
    icon: "🔐",
    features: ["Fingerprint", "Facial Recognition", "Voice Recognition", "Iris Scan"],
  },
  QMOIOwnprodiceLogs: {
    name: "prodice Logs",
    description: "Monitor prodice ownership and activity logs",
    icon: "📝",
    features: ["Activity Tracking", "Log Filtering", "prodice History", "Audit Trail"],
  },
  Onboarding: {
    name: "Onboarding",
    description: "Setup and configuration wizard",
    icon: "🎯",
    features: ["Initial Setup", "Configuration", "First Steps"],
  },
};

export function getQCityComponentKeys(): string[] {
  return Object.keys(QCityComponentRegistry);
}

export function getComponentInfo(componentName: string): QCityComponent | null {
  return QCityComponentRegistry[componentName] || null;
}

export function isFeatureEnabled(feature: keyof typeof QCityFeatures): boolean {
  return QCityFeatures[feature];
}

export const QCityVersion = {
  major: 2,
  minor: 0,
  patch: 0,
  build: "enterprise",
  releaseDate: "2025-12-02",
} as const;

const QCityIndex = {
  version: QCityVersion,
  components: QCityComponentRegistry,
  features: QCityFeatures,
  getComponentInfo,
  isFeatureEnabled,
};

export default QCityIndex;
