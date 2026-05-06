"use client";

import { useEffect, useMemo, useState } from "react";

export type UserRole = "master" | "sister" | "user" | "guest";

export interface QmoiUser {
  id: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
  accessLevel: number;
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

export function useAuth() {
  const [user, setUser] = useState<QmoiUser>(() => ({
    id: "guest",
    displayName: "Guest",
    role: "guest",
    permissions: roleProfiles.guest.permissions,
    accessLevel: roleProfiles.guest.accessLevel,
  }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const controller = new AbortController();
    const queryRole = readRoleFromUrl();
    const storedRole = window.localStorage.getItem("qmoi_user_role") as UserRole | null;
    const storedName = window.localStorage.getItem("qmoi_user_name");
    const role = queryRole || storedRole || "guest";
    const profile = roleProfiles[role] || roleProfiles.guest;
    const id = window.localStorage.getItem("qmoi_user_id") || `qmoi-${role}-${Date.now()}`;

    const fallbackUser: QmoiUser = {
      id,
      displayName: storedName || profile.displayName,
      role: profile.role,
      permissions: profile.permissions,
      accessLevel: profile.accessLevel,
    };
    setUser(fallbackUser);

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Auth fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data?.success && data.user) {
          const serverUser = data.user;
          const resolvedRole = (serverUser.role as UserRole) || profile.role;
          const serverProfile = roleProfiles[resolvedRole] || roleProfiles.guest;
          const displayName =
            serverUser.fullName || serverUser.username || serverUser.email || serverProfile.displayName;
          const permissions =
            Array.isArray(serverUser.permissions) && serverUser.permissions.length > 0
              ? serverUser.permissions
              : serverProfile.permissions;

          const updatedUser: QmoiUser = {
            id: serverUser.id || id,
            displayName,
            role: resolvedRole,
            permissions,
            accessLevel: serverUser.accessLevel ?? serverProfile.accessLevel,
          };

          setUser(updatedUser);
          window.localStorage.setItem("qmoi_user_role", updatedUser.role);
          window.localStorage.setItem("qmoi_user_id", updatedUser.id);
          window.localStorage.setItem("qmoi_user_name", updatedUser.displayName);
        }
      } catch (_error) {
        // Use fallback local profile when auth service is unavailable
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    return () => controller.abort();
  }, []);

  const hasAccess = useMemo(
    () => (permission: string) => user.role === "master" || user.permissions.includes(permission),
    [user],
  );

  const login = (role: UserRole) => {
    const profile = roleProfiles[role] || roleProfiles.guest;
    const id = `qmoi-${role}-${Date.now()}`;
    const updatedUser: QmoiUser = {
      id,
      displayName: profile.displayName,
      role: profile.role,
      permissions: profile.permissions,
      accessLevel: profile.accessLevel,
    };

    window.localStorage.setItem("qmoi_user_role", role);
    window.localStorage.setItem("qmoi_user_id", id);
    window.localStorage.setItem("qmoi_user_name", profile.displayName);
    setUser(updatedUser);
  };

  return {
    user,
    isAuthenticated: user.role !== "guest",
    isLoading,
    hasAccess,
    login,
  };
}
