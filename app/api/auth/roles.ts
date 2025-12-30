/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
export const ROLES = ["guest", "user", "admin", "master"] as const;
export type Role = (typeof ROLES)[number];

export function hasRole(userRole: Role, required: Role): boolean {
  return ROLES.indexOf(userRole) >= ROLES.indexOf(required);
}
