/**
 * Master Access Control System
 * Provides middleware and utilities for master-only feature access
 * 
 * Features restricted to master users:
 * - Revenue management and analytics
 * - Financial dashboard and reporting
 * - Wallet and balance management
 * - Trading operations and execution
 * - Transaction history and auditing
 * - Payment processing
 * - Fund management and transfers
 */

import type { NextRequest } from "next/server";
import { headers } from "next/headers";

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
    const headersList = headers();
    const userJson = headersList.get("x-user");
    
    if (!userJson) {
      throw new UserNotFoundError("No user in request headers");
    }
    
    const user: User = JSON.parse(userJson);
    
    if (!isMasterUser(user)) {
      throw new AccessDeniedError(
        `User ${user.email} does not have master access. Only master users can access financial features.`
      );
    }
    
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Access denied"
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
          timestamp: new Date().toISOString()
        });
      }
      
      // Audit log
      logger.info(`[AUDIT] Master access: ${user.email} on ${new Date().toISOString()}`);
      
      return handler(req, res, next);
    } catch (error) {
      console.error("Master access check failed:", error);
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
    const checkMasterRole = async () => {
      try {
        const userJson = sessionStorage.getItem("user");
        if (!userJson) {
          setIsMaster(false);
          return;
        }
        
        const userData: User = JSON.parse(userJson);
        const isMasterRole = isMasterUser(userData);
        setUser(userData);
        setIsMaster(isMasterRole);
        
        // Log access attempt
        if (isMasterRole) {
          logger.info(`[AUDIT] Master user ${userData.email} accessed protected area`);
        }
      } catch (error) {
        console.error("Failed to check master role:", error);
        setIsMaster(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkMasterRole();
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
    return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      Checking permissions...
    </div>;
  }
  
  if (!isMaster) {
    return fallback || (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
        <strong>Access Denied</strong>
        <p>Master users only. This financial feature is restricted.</p>
      </div>
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
          <p className="text-gray-700">
            This financial feature is only available to master users.
          </p>
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
      status
    };
    
    logger.info(`[FINANCIAL_AUDIT] ${JSON.stringify(logEntry)}`);
    
    // production_IMPLEMENTED, send to audit database
    try {
      await fetch("/api/audit-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.error("Failed to log operation:", error);
    }
  }
  
  static async logRevenuOperation(
    userId: string,
    operation: "validate" | "collect" | "aggregate",
    amount: number,
    sources: string[]
  ) {
    await this.logOperation(userId, `revenue_${operation}`, {
      amount,
      sources,
      timestamp: new Date().toISOString()
    }, "success");
  }
  
  static async logWalletOperation(
    userId: string,
    operation: "transfer" | "deposit" | "withdraw",
    walletId: string,
    amount: number
  ) {
    await this.logOperation(userId, `wallet_${operation}`, {
      walletId,
      amount,
      timestamp: new Date().toISOString()
    }, "success");
  }
}

/**
 * GraphQL directive for master-only fields
 */
export const masterOnlyDirective = `
  directive @masterOnly on FIELD_DEFINITION
  
  type Query {
    # Financial queries - master only
    revenueAnalytics: RevenueData @masterOnly
    walletBalance: BalanceData @masterOnly
    transactionHistory: [Transaction!]! @masterOnly
    tradingMetrics: TradingData @masterOnly
    
    # Public queries
    publicData: String
  }
`;

/**
 * Type-safe financial operation wrapper
 */
export async function executeFinancialOperation<T>(
  operation: () => Promise<T>,
  userId: string,
  operationName: string
): Promise<T> {
  try {
    const result = await operation();
    await FinancialAuditLog.logOperation(
      userId,
      operationName,
      { status: "success" },
      "success"
    );
    return result;
  } catch (error) {
    await FinancialAuditLog.logOperation(
      userId,
      operationName,
      { error: error instanceof Error ? error.message : String(error) },
      "failed"
    );
    throw error;
  }
}

export default {
  isMasterUser,
  hasFinancialAccess,
  requireMasterRole,
  withMasterAccess,
  useMasterAccess,
  MasterOnly,
  ProtectedFinancialFeature,
  FinancialAuditLog,
  executeFinancialOperation,
  MASTER_ROLE,
  FINANCIAL_ROLES,
  AccessDeniedError,
  UserNotFoundError
};
