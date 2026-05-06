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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = window.localStorage.getItem("qmoi_user_role") as UserRole | null;
    const storedName = window.localStorage.getItem("qmoi_user_name");
    const queryRole = readRoleFromUrl();
    const role = queryRole || storedRole || "guest";
    const profile = roleProfiles[role] || roleProfiles.guest;
    const id = window.localStorage.getItem("qmoi_user_id") || `qmoi-${role}-${Date.now()}`;

    window.localStorage.setItem("qmoi_user_role", role);
    window.localStorage.setItem("qmoi_user_id", id);
    if (storedName || queryRole) {
      window.localStorage.setItem("qmoi_user_name", storedName || profile.displayName);
    }

    setUser({
      id,
      displayName: storedName || profile.displayName,
      role: profile.role,
      permissions: profile.permissions,
      accessLevel: profile.accessLevel,
    });
  }, []);

  const hasAccess = useMemo(
    () => (permission: string) => user.role === "master" || user.permissions.includes(permission),
    [user],
  );

  const login = (role: UserRole) => {
    const profile = roleProfiles[role] || roleProfiles.guest;
    const id = `qmoi-${role}-${Date.now()}`;
    window.localStorage.setItem("qmoi_user_role", role);
    window.localStorage.setItem("qmoi_user_id", id);
    window.localStorage.setItem("qmoi_user_name", profile.displayName);
    setUser({
      id,
      displayName: profile.displayName,
      role: profile.role,
      permissions: profile.permissions,
      accessLevel: profile.accessLevel,
    });
  };

  return {
    user,
    isAuthenticated: user.role !== "guest",
    hasAccess,
    login,
  };
}
