/**
 * RBAC Feature Matrix
 * Defines which features are available to each user role (master, sister, user, guest)
 */

export type UserRole = "master" | "sister" | "user" | "guest";

export interface FeatureAccess {
  master: boolean;
  sister: boolean;
  user: boolean;
  guest: boolean;
}

export const roleFeatures = {
  // QMOI AI Features
  qmoiAI: {
    chat: { master: true, sister: true, user: true, guest: false },
    chat_history: { master: true, sister: true, user: true, guest: false },
    chat_export: { master: true, sister: true, user: false, guest: false },
    advanced_models: { master: true, sister: false, user: false, guest: false },
    api_integration: { master: true, sister: false, user: false, guest: false },
    model_fine_tuning: { master: true, sister: false, user: false, guest: false },
  },

  // QMOI Space Features
  qmoiSpace: {
    view_projects: { master: true, sister: true, user: true, guest: false },
    create_project: { master: true, sister: true, user: true, guest: false },
    edit_own_project: { master: true, sister: true, user: true, guest: false },
    delete_own_project: { master: true, sister: true, user: false, guest: false },
    view_datasets: { master: true, sister: true, user: true, guest: false },
    upload_dataset: { master: true, sister: true, user: false, guest: false },
    manage_friendships: { master: true, sister: true, user: true, guest: false },
    collaborative_editing: { master: true, sister: true, user: true, guest: false },
  },

  // QCity Features (Command Center)
  qcity: {
    view_dashboard: { master: true, sister: false, user: false, guest: false },
    view_devices: { master: true, sister: false, user: false, guest: false },
    manage_devices: { master: true, sister: false, user: false, guest: false },
    view_metrics: { master: true, sister: false, user: false, guest: false },
    export_metrics: { master: true, sister: false, user: false, guest: false },
    schedule_tasks: { master: true, sister: false, user: false, guest: false },
    manage_plugins: { master: true, sister: false, user: false, guest: false },
    master_controls: { master: true, sister: false, user: false, guest: false },
    view_qvillage: { master: true, sister: false, user: false, guest: false },
  },

  // QVillage Features (Community)
  qvillage: {
    browse_datasets: { master: true, sister: true, user: true, guest: false },
    purchase_dataset: { master: true, sister: true, user: true, guest: false },
    publish_dataset: { master: true, sister: false, user: false, guest: false },
    manage_datasets: { master: true, sister: false, user: false, guest: false },
    browse_models: { master: true, sister: true, user: true, guest: false },
    deploy_model: { master: true, sister: false, user: false, guest: false },
    view_community: { master: true, sister: true, user: true, guest: true },
    monetization: { master: true, sister: false, user: false, guest: false },
  },

  // QAlpha Features (Research)
  qalpha: {
    view_learning_paths: { master: true, sister: true, user: true, guest: false },
    complete_learning: { master: true, sister: true, user: true, guest: false },
    view_models: { master: true, sister: true, user: true, guest: false },
    view_research: { master: true, sister: true, user: true, guest: false },
    contribute_research: { master: true, sister: true, user: false, guest: false },
    advanced_analytics: { master: true, sister: false, user: false, guest: false },
  },

  // Universal Features
  universal: {
    theme_switching: { master: true, sister: true, user: true, guest: true },
    privacy_mask: { master: true, sister: true, user: true, guest: false },
    parallel_sessions: { master: true, sister: true, user: false, guest: false },
    biometric_auth: { master: true, sister: true, user: true, guest: false },
    session_refresh: { master: true, sister: true, user: true, guest: false },
    memory_sync: { master: true, sister: true, user: false, guest: false },
  },
};

export function hasFeatureAccess(
  feature: string,
  category: string,
  role: UserRole,
): boolean {
  const categoryFeatures = roleFeatures[category as keyof typeof roleFeatures] as
    | Record<string, FeatureAccess>
    | undefined;
  if (!categoryFeatures) return false;

  const featureAccess = categoryFeatures[feature] as FeatureAccess | undefined;
  if (!featureAccess) return false;

  return featureAccess[role] || false;
}

export function getAccessibleFeatures(
  category: string,
  role: UserRole,
): string[] {
  const categoryFeatures = roleFeatures[category as keyof typeof roleFeatures] as
    | Record<string, FeatureAccess>
    | undefined;
  if (!categoryFeatures) return [];

  return Object.entries(categoryFeatures)
    .filter(([_, access]) => access[role])
    .map(([feature]) => feature);
}

export const roleDescriptions: Record<UserRole, string> = {
  master: "Full system access with administrative controls",
  sister: "Collaborative access with family/team features",
  user: "Standard user with core feature access",
  guest: "Limited access to public content only",
};

export const roleColors: Record<UserRole, { bg: string; text: string; accent: string }> = {
  master: { bg: "bg-red-950", text: "text-red-100", accent: "text-red-400" },
  sister: { bg: "bg-purple-950", text: "text-purple-100", accent: "text-purple-400" },
  user: { bg: "bg-blue-950", text: "text-blue-100", accent: "text-blue-400" },
  guest: { bg: "bg-slate-800", text: "text-slate-100", accent: "text-slate-300" },
};
