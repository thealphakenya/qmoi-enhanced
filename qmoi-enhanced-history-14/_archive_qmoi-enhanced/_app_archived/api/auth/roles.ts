export const ROLES = ["guest", "user", "master", "master"] as const;
export type Role = (typeof ROLES)[number];

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLES.indexOf(userRole) >= ROLES.indexOf(required);
}
