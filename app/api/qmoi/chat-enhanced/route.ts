import { NextRequest, NextResponse } from "next/server";
import { processQmoiQuery } from "@/lib/qmoi-chat-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type QMOIUserProfile = {
  id: string;
  displayName: string;
  role: "master" | "admin" | "user" | "guest";
  accessLevel: number;
  permissions: string[];
  isFamily: boolean;
  realName?: string | null;
};

const userMemory = new Map<string, Record<string, unknown>>();

function identifyUser(
  userId?: string | null,
  userEmail?: string | null,
  userName?: string | null,
): QMOIUserProfile {
  const normalizedId = String(userId || userEmail || userName || "guest").trim();
  const isMaster = /\b(master|admin|root|qmoi)\b/i.test(normalizedId);
  const displayName = userName || userEmail?.split("@")[0] || (isMaster ? "Master" : "Guest");
  const role: QMOIUserProfile["role"] = isMaster ? "master" : /@admin\.|admin\b/i.test(normalizedId) ? "admin" : "user";
  const accessLevel = role === "master" ? 100 : role === "admin" ? 75 : 25;
  const permissions = ["general_chat"];
  if (role === "admin") permissions.push("view_financial_data", "manage_all_systems");
  if (role === "master") permissions.push("view_financial_data", "manage_all_systems", "admin");

  return {
    id: normalizedId || `user-${Date.now()}`,
    displayName,
    role,
    accessLevel,
    permissions,
    isFamily: false,
    realName: userName || null,
  };
}

function generateDynamicIntroduction(
  profile: QMOIUserProfile,
) {
  const hasFullAccess = profile.accessLevel >= 100;
  return {
    introduction: `Hello ${profile.displayName}! I am QMOI, your intelligent assistant. I can help with conversation, automation, memory, and system insights at your current access level.`,
    role: profile.role,
    hasFullAccess,
  };
}

function checkAccess(profile: QMOIUserProfile, permission: string) {
  const allowed = profile.permissions.includes(permission) || profile.role === "master";
  return {
    allowed,
    reason: allowed ? null : `Access denied for ${permission}`,
  };
}

function generateContextAwarePrefix(profile: QMOIUserProfile) {
  return profile.role === "master"
    ? "As your master assistant, I will respond with high priority, full access, and advanced context. "
    : profile.role === "admin"
    ? "As your admin companion, I will respond with secure context and controlled access. "
    : "As your helpful QMOI assistant, I will respond with empathy, clarity, and actionable guidance. ";
}

function storeUserInfo(userId: string, key: string, value: unknown) {
  const existing = userMemory.get(userId) || {};
  userMemory.set(userId, { ...existing, [key]: value });
}

function retrieveUserInfo(userId: string, key: string) {
  const stored = userMemory.get(userId) || {};
  if (key in stored) {
    return { found: true, value: stored[key] };
  }
  return { found: false, value: null };
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch (_error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    message,
    userId = null,
    userEmail = null,
    userName = null,
    context = {},
  } = body || {};

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Valid message required" },
      { status: 400 },
    );
  }

  const profile = identifyUser(userId, userEmail, userName);
  const isGreeting = /\b(who are you|what are you|identify yourself|what can you do|who is)\b/i.test(message);

  if (isGreeting) {
    const introduction = generateDynamicIntroduction(profile);
    return NextResponse.json({
      success: true,
      userIdentified: profile.role !== "guest",
      userRole: profile.role,
      displayName: profile.displayName,
      introduction: introduction.introduction,
      role: introduction.role,
      hasFullAccess: introduction.hasFullAccess,
      type: "introduction",
      profile,
      session: {
        userId: profile.id,
        role: profile.role,
        sessionStart: new Date().toISOString(),
      },
    });
  }

  if (/\b(my name is|i am)\b/i.test(message)) {
    const nameMatch = message.match(/my name is\s+(\w+)/i) || message.match(/i am\s+(\w+)/i);
    if (nameMatch) {
      storeUserInfo(profile.id, "realName", nameMatch[1]);
    }
  }

  let retrievalContext: string | null = null;
  if (/\b(what is my name|do you remember|what do you know)\b/i.test(message)) {
    const storedInfo = retrieveUserInfo(profile.id, "realName");
    if (storedInfo.found && storedInfo.value) {
      retrievalContext = `I remember that your name is ${storedInfo.value}.`;
    }
  }

  if (/\b(financial|money|revenue|trading)\b/i.test(message)) {
    const financialAccess = checkAccess(profile, "view_financial_data");
    if (!financialAccess.allowed) {
      return NextResponse.json(
        {
          error: "Access denied",
          reason: financialAccess.reason,
          userRole: profile.role,
          profile,
        },
        { status: 403 },
      );
    }
  }

  if (/\b(system|config|settings)\b/i.test(message)) {
    const systemAccess = checkAccess(profile, "manage_all_systems");
    if (!systemAccess.allowed && profile.role !== "master") {
      return NextResponse.json(
        {
          error: "Access denied",
          reason: systemAccess.reason,
          userRole: profile.role,
          profile,
        },
        { status: 403 },
      );
    }
  }

  const prefix = generateContextAwarePrefix(profile);
  const fullMessage = `${prefix}${message}`;
  const response = processQmoiQuery(fullMessage, profile.id, { profile, ...context });

  return NextResponse.json({
    success: true,
    type: "contextual_response",
    userIdentified: profile.role !== "guest",
    userRole: profile.role,
    displayName: profile.displayName,
    userContext: {
      realName: profile.realName || null,
      role: profile.role,
      accessLevel: profile.accessLevel,
      isFamily: profile.isFamily,
    },
    contextPrefix: prefix,
    fullMessage,
    message: response.message,
    response: response.response,
    metadata: response.metadata,
    advanced: response.advanced,
    profile,
    retrievalContext,
    session: {
      userId: profile.id,
      role: profile.role,
      sessionStart: new Date().toISOString(),
      permissions: profile.permissions.slice(0, 3),
      totalPermissions: profile.permissions.length,
    },
  });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") || "guest";
  const profile = identifyUser(userId, null, null);

  return NextResponse.json({
    success: true,
    profile,
    timestamp: new Date().toISOString(),
  });
}
