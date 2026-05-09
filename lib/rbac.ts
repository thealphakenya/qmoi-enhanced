/**
 * Role-Based Access Control (RBAC) System for QMOI
 * Defines user roles, permissions, and access levels
 */

export type UserRole = 'master' | 'sister' | 'user' | 'guest';

export interface Permission {
  name: string;
  description: string;
  category: 'auth' | 'admin' | 'finance' | 'content' | 'account';
}

export interface Role {
  name: UserRole;
  level: number;
  description: string;
  permissions: Permission[];
  features: string[];
}

/**
 * Role Definitions with Permission Sets
 */
export const ROLES: Record<UserRole, Role> = {
  master: {
    name: 'master',
    level: 100,
    description: 'Master user with full system access',
    permissions: [
      // Auth permissions
      { name: 'auth:signin', description: 'Sign in to system', category: 'auth' },
      { name: 'auth:signup', description: 'Register new accounts', category: 'auth' },
      { name: 'auth:manage-users', description: 'Manage all users', category: 'auth' },
      { name: 'auth:view-audit-log', description: 'View authentication audit logs', category: 'auth' },
      
      // Admin permissions
      { name: 'admin:view-dashboard', description: 'View admin dashboard', category: 'admin' },
      { name: 'admin:manage-settings', description: 'Manage system settings', category: 'admin' },
      { name: 'admin:view-logs', description: 'View system logs', category: 'admin' },
      { name: 'admin:manage-roles', description: 'Manage user roles', category: 'admin' },
      
      // Finance permissions
      { name: 'finance:view-all-accounts', description: 'View all financial accounts', category: 'finance' },
      { name: 'finance:manage-transactions', description: 'Manage all transactions', category: 'finance' },
      { name: 'finance:manage-wallets', description: 'Manage all wallets', category: 'finance' },
      
      // Content permissions
      { name: 'content:publish', description: 'Publish content globally', category: 'content' },
      { name: 'content:manage-all', description: 'Manage all content', category: 'content' },
    ],
    features: [
      'admin_dashboard',
      'user_management',
      'audit_logs',
      'financial_overview',
      'content_management',
      'system_settings',
      'biometric_management',
      'role_assignment',
    ],
  },
  sister: {
    name: 'sister',
    level: 80,
    description: 'Sister user with family-level access',
    permissions: [
      // Auth permissions
      { name: 'auth:signin', description: 'Sign in to system', category: 'auth' },
      
      // Admin permissions
      { name: 'admin:view-dashboard', description: 'View limited admin dashboard', category: 'admin' },
      
      // Finance permissions
      { name: 'finance:view-family-accounts', description: 'View family financial accounts', category: 'finance' },
      { name: 'finance:manage-own-transactions', description: 'Manage own transactions', category: 'finance' },
      
      // Content permissions
      { name: 'content:publish-family', description: 'Publish to family channels', category: 'content' },
    ],
    features: [
      'family_dashboard',
      'family_finances',
      'personal_account',
      'content_publishing',
      'biometric_auth',
    ],
  },
  user: {
    name: 'user',
    level: 10,
    description: 'Standard user with basic access',
    permissions: [
      // Auth permissions
      { name: 'auth:signin', description: 'Sign in to system', category: 'auth' },
      
      // Account permissions
      { name: 'account:view-profile', description: 'View own profile', category: 'account' },
      { name: 'account:edit-profile', description: 'Edit own profile', category: 'account' },
      { name: 'account:change-password', description: 'Change own password', category: 'account' },
      
      // Finance permissions
      { name: 'finance:view-own-accounts', description: 'View own financial accounts', category: 'finance' },
      { name: 'finance:manage-own-transactions', description: 'Manage own transactions', category: 'finance' },
    ],
    features: [
      'personal_dashboard',
      'account_management',
      'personal_finances',
      'biometric_auth',
    ],
  },
  guest: {
    name: 'guest',
    level: 1,
    description: 'Guest user with read-only access',
    permissions: [
      { name: 'auth:view-public', description: 'View public content', category: 'auth' },
    ],
    features: [
      'public_content',
    ],
  },
};

/**
 * Check if user role has specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const roleData = ROLES[role];
  if (!roleData) return false;
  return roleData.permissions.some((p) => p.name === permission);
}

/**
 * Check if user role meets minimum access level
 */
export function hasAccessLevel(role: UserRole, minimumLevel: number): boolean {
  const roleData = ROLES[role];
  if (!roleData) return false;
  return roleData.level >= minimumLevel;
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole): string[] {
  const roleData = ROLES[role];
  if (!roleData) return [];
  return roleData.permissions.map((p) => p.name);
}

/**
 * Get all features available for a role
 */
export function getFeatures(role: UserRole): string[] {
  const roleData = ROLES[role];
  if (!roleData) return [];
  return roleData.features;
}

/**
 * Determine user role based on email domain or explicit assignment
 */
export function determineUserRole(email: string, explicitRole?: UserRole): UserRole {
  if (explicitRole) return explicitRole;
  
  // Email-based role assignment
  const masterEmails = ['victor@qmoi.ai', 'master@qmoi.ai'];
  const sisterEmails = ['leah@qmoi.ai', 'sister@qmoi.ai'];
  
  if (masterEmails.includes(email)) return 'master';
  if (sisterEmails.includes(email)) return 'sister';
  
  return 'user';
}

export default {
  ROLES,
  hasPermission,
  hasAccessLevel,
  getPermissions,
  getFeatures,
  determineUserRole,
};
