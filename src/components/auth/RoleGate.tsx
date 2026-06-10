"use client";

import React from "react";
import { hasFeatureAccess, UserRole } from "@/lib/rbac/roleFeatures";
import { getFeatureRestrictionMessage } from "@/lib/rbac/roleStyles";

interface RoleGateProps {
  feature: string;
  category: string;
  role: UserRole;
  requiredRole?: UserRole;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  showRestrictionMessage?: boolean;
}

/**
 * RoleGate Component
 * Conditionally renders content based on user role and feature access
 */
export function RoleGate({
  feature,
  category,
  role,
  requiredRole = "user",
  children,
  fallback,
  showRestrictionMessage = false,
}: RoleGateProps): React.ReactElement {
  const hasAccess = hasFeatureAccess(feature, category, role);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showRestrictionMessage) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4 text-center text-sm text-slate-300">
        <p>{getFeatureRestrictionMessage(role, feature, requiredRole)}</p>
      </div>
    );
  }

  return <></>;
}

interface RoleBasedContentProps {
  role: UserRole;
  master?: React.ReactNode;
  sister?: React.ReactNode;
  user?: React.ReactNode;
  guest?: React.ReactNode;
  default?: React.ReactNode;
}

/**
 * RoleBasedContent Component
 * Renders different content based on user role
 */
export function RoleBasedContent({
  role,
  master,
  sister,
  user,
  guest,
  default: defaultContent,
}: RoleBasedContentProps): React.ReactElement {
  const content =
    role === "master"
      ? master
      : role === "sister"
        ? sister
        : role === "user"
          ? user
          : role === "guest"
            ? guest
            : defaultContent;

  return <>{content}</>;
}

interface RoleRestrictedProps {
  role: UserRole;
  minRole: UserRole;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

const roleHierarchy: Record<UserRole, number> = {
  master: 4,
  sister: 3,
  user: 2,
  guest: 1,
};

/**
 * RoleRestricted Component
 * Only renders if user role meets or exceeds minimum role
 */
export function RoleRestricted({
  role,
  minRole,
  children,
  fallback,
}: RoleRestrictedProps): React.ReactElement {
  const userLevel = roleHierarchy[role];
  const requiredLevel = roleHierarchy[minRole];

  if (userLevel >= requiredLevel) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
}
