/**
 * Role-Aware Styling and Response Helpers
 * Provides role-contextual UI and API responses
 */

import { UserRole } from "./roleFeatures";

export interface RoleContext {
  role: UserRole;
  displayName: string;
  accessLevel: number;
  permissions: string[];
}

/**
 * Get role-specific CSS classes for consistent theme styling across apps
 */
export function getRoleStyles(role: UserRole): {
  headerClass: string;
  accentClass: string;
  borderClass: string;
  badgeClass: string;
} {
  const roleStyleMap: Record<
    UserRole,
    ReturnType<typeof getRoleStyles>
  > = {
    master: {
      headerClass: "from-red-900 via-slate-900 to-red-950",
      accentClass: "text-red-400",
      borderClass: "border-red-600/40",
      badgeClass: "bg-red-600/20 text-red-200",
    },
    sister: {
      headerClass: "from-purple-900 via-slate-900 to-purple-950",
      accentClass: "text-purple-400",
      borderClass: "border-purple-600/40",
      badgeClass: "bg-purple-600/20 text-purple-200",
    },
    user: {
      headerClass: "from-blue-900 via-slate-900 to-blue-950",
      accentClass: "text-blue-400",
      borderClass: "border-blue-600/40",
      badgeClass: "bg-blue-600/20 text-blue-200",
    },
    guest: {
      headerClass: "from-slate-800 via-slate-900 to-slate-900",
      accentClass: "text-slate-300",
      borderClass: "border-slate-600/40",
      badgeClass: "bg-slate-700/30 text-slate-200",
    },
  };
  return roleStyleMap[role];
}

/**
 * Get role-specific welcome/intro messages
 */
export function getRoleGreeting(role: UserRole, displayName: string): string {
  const greetings: Record<UserRole, string> = {
    master: `Welcome, ${displayName}. Full system access granted.`,
    sister: `Hello, ${displayName}. Collaborative features are ready.`,
    user: `Welcome, ${displayName}. Standard access enabled.`,
    guest: `Welcome, ${displayName}. You're browsing as a guest.`,
  };
  return greetings[role];
}

/**
 * Get role-specific feature restrictions message
 */
export function getFeatureRestrictionMessage(
  role: UserRole,
  feature: string,
  requiredRole: UserRole,
): string {
  const messages: Record<UserRole, (f: string, r: UserRole) => string> = {
    master: () => "This feature is not available.",
    sister: (f, r) =>
      `The ${f} feature requires ${r} role access. Upgrade your account to use it.`,
    user: (f, r) =>
      `The ${f} feature is restricted to ${r} users. Please contact support for access.`,
    guest: (f, r) =>
      `The ${f} feature requires authentication as a ${r} user. Please sign in first.`,
  };
  return messages[role](feature, requiredRole);
}

/**
 * Get role-specific response styling for API endpoints
 */
export function formatRoleAwareResponse(
  data: any,
  role: UserRole,
): {
  success: boolean;
  data: any;
  message: string;
  roleContext: { role: UserRole; accessLevel: string };
} {
  return {
    success: true,
    data,
    message: `Response formatted for ${role} access level`,
    roleContext: {
      role,
      accessLevel:
        role === "master"
          ? "Full"
          : role === "sister"
            ? "Collaborative"
            : role === "user"
              ? "Standard"
              : "Limited",
    },
  };
}

/**
 * Filter response data based on user role
 */
export function filterDataByRole(
  data: any[],
  role: UserRole,
  sensitivity: { master?: boolean; sister?: boolean; user?: boolean; guest?: boolean },
): any[] {
  return data.filter((item) => {
    if (role === "master") return true;
    if (role === "sister" && (sensitivity.sister || sensitivity.master)) return true;
    if (role === "user" && (sensitivity.user || sensitivity.sister || sensitivity.master)) return true;
    if (role === "guest" && sensitivity.guest) return true;
    return false;
  });
}

/**
 * Get role-specific button styling
 */
export function getRoleButtonStyle(
  role: UserRole,
  type: "primary" | "secondary" | "danger" = "primary",
): string {
  const baseClass = "rounded-xl px-4 py-3 text-sm font-semibold transition";
  const roleMap: Record<UserRole, Record<string, string>> = {
    master:
      type === "primary"
        ? `${baseClass} bg-red-600 text-white hover:bg-red-500`
        : type === "danger"
          ? `${baseClass} bg-red-700 text-white hover:bg-red-600`
          : `${baseClass} border border-red-600/40 text-red-200 hover:bg-red-600/10`,
    sister:
      type === "primary"
        ? `${baseClass} bg-purple-600 text-white hover:bg-purple-500`
        : type === "danger"
          ? `${baseClass} bg-purple-700 text-white hover:bg-purple-600`
          : `${baseClass} border border-purple-600/40 text-purple-200 hover:bg-purple-600/10`,
    user:
      type === "primary"
        ? `${baseClass} bg-blue-600 text-white hover:bg-blue-500`
        : type === "danger"
          ? `${baseClass} bg-blue-700 text-white hover:bg-blue-600`
          : `${baseClass} border border-blue-600/40 text-blue-200 hover:bg-blue-600/10`,
    guest:
      type === "primary"
        ? `${baseClass} bg-slate-600 text-white hover:bg-slate-500`
        : type === "danger"
          ? `${baseClass} bg-slate-700 text-white hover:bg-slate-600`
          : `${baseClass} border border-slate-600/40 text-slate-300 hover:bg-slate-600/10`,
  };
  return roleMap[role][type] || roleMap[role]["primary"];
}
