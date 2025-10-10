export const ROLES = ['guest', 'user', 'admin', 'master'] as const;
export type Role = typeof ROLES[number];

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLES.indexOf(userRole) >= ROLES.indexOf(required);
} 