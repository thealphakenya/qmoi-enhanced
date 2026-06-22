import ErrorBoundary from '@/components/ErrorBoundary';
import React, { createContext, useContext, useState, useEffect } from "react";
import BiometricAuth from "@/components/auth/BiometricAuth";
import { persistUserToStorage } from "@/app/lib/auth";
import { logAuthEvent } from "@/app/lib/auth";


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Key,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Fingerprint,
} from "lucide-react";
interface User {
  id: string;
  username: string;
  role: "admin" | "user" | "guest";
  permissions: string[];
  lastLogin?: Date;
  biometricEnabled: boolean;
  accountStatus: "active" | "suspended" | "locked";
  trustScore: number;
}
interface AccessControlContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  authenticate: (userId: string, method: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  updateUserPermissions: (
    userId: string,
    permissions: string[],
  ) => Promise<void>;
}
const AccessControlContext = createContext<AccessControlContextType | null>(
  null,
);
export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error("useAccessControl must be used within an AccessControlProvider");
  }
  return context;
};
interface AccessControlProviderProps {
  children: React.ReactNode;
}
export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "admin-1",
      username: "admin",
      role: "admin",
      permissions: ["read", "write", "delete", "admin", "system"],
      biometricEnabled: true,
      accountStatus: "active",
      trustScore: 0.95,
    },
    {
      id: "user-1",
      username: "user",
      role: "user",
      permissions: ["read", "write"],
      biometricEnabled: false,
      accountStatus: "active",
      trustScore: 0.78,
    },
  ]);
  const authenticate = async (
    userId: string,
    method: string,
  ): Promise<boolean> => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.accountStatus !== "active") {
      return false;
    }
    // Update last login
    user.lastLogin = new Date();
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Log authentication event
    logger.info(`User ${user.username} authenticated via ${method}`);
    return true;
  };
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  const checkPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return (
      currentUser.permissions.includes(permission) ||
      currentUser.permissions.includes("admin") ||
      currentUser.permissions.includes("system")
    );
  };
  const updateUserPermissions = async (
    userId: string,
    permissions: string[],
  ): Promise<void> => {
    if (!checkPermission("admin")) {
      throw new Error("Insufficient permissions");
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, permissions } : user,
      ),
    );
  };
  const contextValue: AccessControlContextType = {
    currentUser,
    isAuthenticated,
    users,
    authenticate,
    logout,
    checkPermission,
    updateUserPermissions,
  };
  return (
    <AccessControlContext.Provider value={contextValue}>
      {children}
    </AccessControlContext.Provider>
  );
};
interface UserAccessControlProps {
  onUserAuthenticated?: (user: User) => void;
}
export const UserAccessControl: React.FC<UserAccessControlProps> = ({
  onUserAuthenticated,
}) => {
  const {
    currentUser,
    users,
    isAuthenticated,
    authenticate,
    logout,
    checkPermission,
    updateUserPermissions,
  } = useAccessControl();
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const { toast } = useToast();
  const handleBiometricSuccess = async (userId: string, confidence: number) => {
    const success = await authenticate(userId, "biometric");
    if (success && currentUser) {
      // Persist identity for cross-app awareness and log to memory
      persistUserToStorage({ id: currentUser.id, role: currentUser.role, displayName: currentUser.username });
      logAuthEvent({ userId: currentUser.id, role: currentUser.role, displayName: currentUser.username, event: 'biometric_auth', details: { confidence } });
      // Broadcast a cross-window auth change event so other parts of the app can refresh
      try {
        window.dispatchEvent(new CustomEvent('qmoi:auth:changed', { detail: { id: currentUser.id, role: currentUser.role } }));
      } catch (e) {}
      onUserAuthenticated?.(currentUser);
      toast({
        title: "Authentication Successful",
        description: `Welcome back, ${currentUser.username}!`,
      });
    }
    setShowBiometricAuth(false);
  };
  const handleBiometricFailure = (reason: string) => {
    toast({
      title: "Authentication Failed",
      description: reason,
      variant: "destructive",
    });
  };
  const handlePermissionUpdate = async () => {
    if (!selectedUser) return;
    try {
      await updateUserPermissions(selectedUser.id, newPermissions);
      toast({
        title: "Permissions Updated",
        description: `Permissions updated for ${selectedUser.username}`,
      });
      setSelectedUser(null);
      setNewPermissions([]);
    } catch (error) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update user permissions",
        variant: "destructive",
      });
    }
  };
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      case "guest":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "locked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (showBiometricAuth) {
    return (
      <BiometricAuth
        onAuthenticated={handleBiometricSuccess}
        onFailed={handleBiometricFailure}
        requiredConfidence={0.8}
      />
    );
  }
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Current User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated && currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{currentUser.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleColor(currentUser.role)}>
                      {currentUser.role}
                    </Badge>
                    <Badge
                      className={getStatusColor(currentUser.accountStatus)}
                    >
                      {currentUser.accountStatus}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Trust Score: {(currentUser.trustScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={logout} variant="outline">
                <Unlock className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Not authenticated</p>
              <Button onClick={() => setShowBiometricAuth(true)}>
                <Lock className="w-4 h-4 mr-2" />
                Authenticate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* User Management (Admin Only) */}
      {isAuthenticated && checkPermission("admin") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user permissions and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="space-y-4">
                <div className="grid gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            <Badge
                              className={getStatusColor(user.accountStatus)}
                            >
                              {user.accountStatus}
                            </Badge>
                            {user.biometricEnabled && (
                              <Badge variant="outline">
                                <Fingerprint className="w-3 h-3 mr-1" />
                                Biometric
                              </Badge>
                            )}
                          </div>
                          {user.lastLogin && (
                            <p className="text-xs text-gray-500 mt-1">
                              Last login: {user.lastLogin.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewPermissions([...user.permissions]);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="permissions" className="space-y-4">
                {selectedUser && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="permissions">
                        Permissions for {selectedUser.username}
                      </Label>
                      <div className="mt-2 space-y-2">
                        {["read", "write", "delete", "admin", "system"].map(
                          (permission) => (
                            <label
                              key={permission}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={newPermissions.includes(permission)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewPermissions([
                                      ...newPermissions,
                                      permission,
                                    ]);
                                  } else {
                                    setNewPermissions(
                                      newPermissions.filter(
                                        (p) => p !== permission,
                                      ),
                                    );
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm capitalize">
                                {permission}
                              </span>
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handlePermissionUpdate}>
                        Update Permissions
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(null);
                          setNewPermissions([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      {/* Access Control Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Access Control Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.accountStatus === "active").length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.biometricEnabled).length}
              </div>
              <div className="text-sm text-gray-600">Biometric Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <div className="text-sm text-gray-600">Administrators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (users.reduce((acc, u) => acc + u.trustScore, 0) /
                    users.length) *
                    100,
                )}
              </div>
              <div className="text-sm text-gray-600">Avg Trust Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default UserAccessControl;
