"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  persistUserToStorage,
  readPersistedUser,
  clearUserFromStorage,
  persistAuthTokens,
  clearAuthTokens,
} from "../lib/auth/persistence";

export type UserRole = "master" | "sister" | "user" | "guest";

export interface QmoiUser {
  id: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
  accessLevel: number;
}

export interface UseAuthReturn {
  user: QmoiUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAccess: (permission: string) => boolean;
  login: (
    payload:
      | UserRole
      | {
          email?: string;
          username?: string;
          password?: string;
          biometricMethod?: string;
          biometricData?: any;
        }
  ) => Promise<QmoiUser>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const roleProfiles: Record<UserRole, Omit<QmoiUser, "id">> = {
  master: {
    displayName: "Master QMOI",
    role: "master",
    permissions: [
      "general_chat",
      "system_control",
      "financial_management",
      "user_management",
      "qcity_access",
      "qvillage_access",
      "qmoi_space_access",
      "pwa_install",
      "memory_access",
      "build_control",
    ],
    accessLevel: 100,
  },
  sister: {
    displayName: "Sister QMOI",
    role: "sister",
    permissions: [
      "general_chat",
      "personal_content",
      "goals_management",
      "wallet_view",
      "qmoi_space_access",
      "memory_access",
    ],
    accessLevel: 65,
  },
  user: {
    displayName: "Regular User",
    role: "user",
    permissions: [
      "general_chat",
      "help_support",
      "profile_view",
      "wallet_view",
      "qmoi_space_access",
    ],
    accessLevel: 30,
  },
  guest: {
    displayName: "Guest",
    role: "guest",
    permissions: ["general_chat", "help_support"],
    accessLevel: 10,
  },
};

function readRoleFromUrl(): UserRole | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");
  if (role === "master" || role === "sister" || role === "user" || role === "guest") {
    return role;
  }
  return null;
}

function createFallbackUser(role: UserRole, persisted?: { id?: string | null; displayName?: string | null }): QmoiUser {
  const profile = roleProfiles[role] || roleProfiles.guest;
  return {
    id: persisted?.id || `qmoi-${role}-${Date.now()}`,
    displayName: persisted?.displayName || profile.displayName,
    role: profile.role,
    permissions: profile.permissions,
    accessLevel: profile.accessLevel,
  };
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<QmoiUser>(() => createFallbackUser("guest"));
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthSession = useCallback(async () => {
    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        cache: "no-store",
      });
      return refreshResponse.ok;
    } catch {
      return false;
    }
  }, []);

  const loadUser = useCallback(async () => {
    if (typeof window === "undefined") return;

    const queryRole = readRoleFromUrl();
    const persisted = readPersistedUser();
    const storedRole = persisted?.role as UserRole | null;
    const role = queryRole || storedRole || "guest";

    setUser(createFallbackUser(role, persisted ?? undefined));
    setIsLoading(true);

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data?.success && data.user) return data.user;
      } catch {
        return null;
      }
      return null;
    };

    try {
      let serverUser = await fetchUser();
      if (!serverUser) {
        const refreshed = await refreshAuthSession();
        if (refreshed) {
          serverUser = await fetchUser();
        }
      }

      if (serverUser) {
        const resolvedRole = (serverUser.role as UserRole) || role;
        const resolvedProfile = roleProfiles[resolvedRole] || roleProfiles.guest;
        const displayName =
          serverUser.fullName || serverUser.username || serverUser.email || resolvedProfile.displayName;
        const permissions =
          Array.isArray(serverUser.permissions) && serverUser.permissions.length > 0
            ? serverUser.permissions
            : resolvedProfile.permissions;

        const updatedUser: QmoiUser = {
          id: serverUser.id || persisted?.id || `qmoi-${resolvedRole}-${Date.now()}`,
          displayName,
          role: resolvedRole,
          permissions,
          accessLevel: serverUser.accessLevel ?? resolvedProfile.accessLevel,
        };

        setUser(updatedUser);
        persistUserToStorage({ id: updatedUser.id, role: updatedUser.role, displayName: updatedUser.displayName });
      } else {
        clearUserFromStorage();
        clearAuthTokens();
        setUser(createFallbackUser("guest"));
      }
    } catch (_error) {
      // Use fallback local profile when auth service is unavailable
    } finally {
      setIsLoading(false);
    }
  }, [refreshAuthSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const onAuthChanged = () => {
      loadUser();
    };
    const onStorage = (ev: StorageEvent) => {
      if (ev.key && (ev.key.includes("qmoi_user") || ev.key === "qmoi_user_role" || ev.key === "qmoi_user_id")) {
        loadUser();
      }
    };
    try {
      window.addEventListener("qmoi:auth:changed", onAuthChanged as EventListener);
      window.addEventListener("storage", onStorage as EventListener);
    } catch (e) {
      console.warn("Failed to attach auth listeners", e);
    }
    return () => {
      try {
        window.removeEventListener("qmoi:auth:changed", onAuthChanged as EventListener);
        window.removeEventListener("storage", onStorage as EventListener);
      } catch (e) {
        console.warn("Failed to remove auth listeners", e);
      }
    };
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (_error) {
      // Ignore logout errors
    }

    clearUserFromStorage();
    clearAuthTokens();
    setUser(createFallbackUser("guest"));
    setIsLoading(false);
  }, []);

  const hasAccess = useMemo(
    () => (permission: string) => user.role === "master" || user.permissions.includes(permission),
    [user],
  );

  const login = useCallback(
    async (
      payload:
        | UserRole
        | {
            email?: string;
            username?: string;
            password?: string;
            biometricMethod?: string;
            biometricData?: any;
          }
    ) => {
      if (typeof window === "undefined") {
        throw new Error("Login must be called in the browser");
      }

      const requestBody: Record<string, any> = {};
      if (typeof payload === "string") {
        requestBody.role = payload;
      } else {
        Object.assign(requestBody, payload);
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Login failed");
        }

        const result = await response.json();
        const serverUser = result?.user;
        if (!serverUser) {
          throw new Error("Login succeeded but no user data returned");
        }

        const resolvedRole = (serverUser.role as UserRole) || "guest";
        const resolvedProfile = roleProfiles[resolvedRole] || roleProfiles.guest;
        const displayName =
          serverUser.fullName || serverUser.username || serverUser.email || resolvedProfile.displayName;
        const permissions =
          Array.isArray(serverUser.permissions) && serverUser.permissions.length > 0
            ? serverUser.permissions
            : resolvedProfile.permissions;

        const updatedUser: QmoiUser = {
          id: serverUser.id || `qmoi-${resolvedRole}-${Date.now()}`,
          displayName,
          role: resolvedRole,
          permissions,
          accessLevel: serverUser.accessLevel ?? resolvedProfile.accessLevel,
        };

        setUser(updatedUser);
        persistUserToStorage({ id: updatedUser.id, role: updatedUser.role, displayName: updatedUser.displayName });
        window.dispatchEvent(new Event("qmoi:auth:changed"));
        return updatedUser;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const isAuthenticated = useMemo(() => user.role !== "guest" && !isLoading, [user, isLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    hasAccess,
    login,
    refreshUser,
    logout,
  };
}
