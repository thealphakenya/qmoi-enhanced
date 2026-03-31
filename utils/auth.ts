// Auth utilities
// Authentication helper functions

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function verifyAuth(token: string): Promise<AuthUser | null> {
  // Mock implementation
  return null;
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  // Mock implementation
  throw new Error("Not authenticated");
}

export default {
  verifyAuth,
  requireAuth,
};