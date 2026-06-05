"use client";

import React from "react";
import { readPersistedUser } from "../../app/lib/auth/persistence";
import type { NextRequest } from "next/server";
import { log as logger } from "@/lib/logger";

declare const logger: any;

// Master-only role constant
export const MASTER_ROLE = "master";
export const FINANCIAL_ROLES = [MASTER_ROLE];

/**
 * Custom error classes
 */
export class AccessDeniedError extends Error {
  constructor(message = "Master role required for this operation") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

export class UserNotFoundError extends Error {
  constructor(message = "User not found or session expired") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

/**
 * User role interface
 */
export interface User {
  id: string;
  role: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
}

/**
 * Check if user has master role
 */
export function isMasterUser(user: User | null | undefined): user is User {
  return user?.role === MASTER_ROLE;
}

/**
 * Check if user has financial access (master only)
 */
export function hasFinancialAccess(user: User | null | undefined): boolean {
  return user ? FINANCIAL_ROLES.includes(user.role) : false;
}

/**
 * Middleware to require master role
 */
export async function requireMasterRole(request: NextRequest) {
  try {
    const userJson = request.headers.get("x-user");

    if (!userJson) {
      throw new UserNotFoundError("No user in request headers");
    }

    const user = JSON.parse(userJson) as User;

    if (!isMasterUser(user)) {
      const email = (user as User).email || "unknown";
      throw new AccessDeniedError(
        `User ${email} does not have master access. Only master users can access financial features.`
      );
    }

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Access denied",
    };
  }
}

/**
 * Decorator factory for protective Express/API handlers
 */
export function withMasterAccess(handler: Function) {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user || req.session?.user;

      if (!isMasterUser(user as User)) {
        return res.status(403).json({
          error: "Access Denied",
          message: "Master role required for financial operations",
          timestamp: new Date().toISOString(),
        });
      }

      logger?.info?.(`[AUDIT] Master access: ${user.email} on ${new Date().toISOString()}`);

      return handler(req, res, next);
    } catch (error) {
      logger?.error?.("Master access check failed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * React hook for master user check
 */
export function useMasterAccess() {
  const [isMaster, setIsMaster] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const checkMasterRole = () => {
      try {
        const persisted = readPersistedUser();

        if (!persisted?.role) {
          setUser(null);
          setIsMaster(false);
          return;
        }

        const userData: User = {
          id: persisted.id || "",
          role: persisted.role,
          email: persisted.displayName || "unknown@qmoi.local",
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        const isMasterRole = isMasterUser(userData);
        setUser(userData);
        setIsMaster(isMasterRole);

        if (isMasterRole) {
          logger?.info?.(`[AUDIT] Master user ${userData.email} accessed protected area`);
        }
      } catch (error) {
        logger?.error?.("Failed to check master role:", error);
        setUser(null);
        setIsMaster(false);
      } finally {
        setLoading(false);
      }
    };

    checkMasterRole();
    const handleAuthChanged = () => checkMasterRole();

    window.addEventListener("qmoi:auth:changed", handleAuthChanged);
    return () => {
      window.removeEventListener("qmoi:auth:changed", handleAuthChanged);
    };
  }, []);

  return { isMaster, loading, user };
}

/**
 * React component for master-only content
 */
export const MasterOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { isMaster, loading } = useMasterAccess();

  if (loading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">Checking permissions...</div>
    );
  }

  if (!isMaster) {
    return (
      fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Access Denied</strong>
          <p>Master users only. This financial feature is restricted.</p>
        </div>
      )
    );
  }

  return <>{children}</>;
};

/**
 * Protected financial feature wrapper
 */
export function ProtectedFinancialFeature<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  return function ProtectedComponent(props: T) {
    const { isMaster, loading } = useMasterAccess();

    if (loading) return <div>Loading...</div>;

    if (!isMaster) {
      return (
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-700">This financial feature is only available to master users.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Financial operation audit logger
 */
export class FinancialAuditLog {
  static async logOperation(
    userId: string,
    operation: string,
    details: Record<string, unknown>,
    status: "success" | "failed" | "pending" = "pending"
  ) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      userId,
      operation,
      details,
      status,
    };

    logger?.info?.(`[FINANCIAL AUDIT]`, logEntry);
  }
}
