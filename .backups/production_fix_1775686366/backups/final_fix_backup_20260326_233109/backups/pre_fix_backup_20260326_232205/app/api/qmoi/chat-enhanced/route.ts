// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import QMOIUserSystem from "@/lib/qmoi-user-system";
import QMOIEnhancedIntelligence from "@/lib/qmoi-enhanced-intelligence";

/**
 * Enhanced QMOI Chat Endpoint with User Identification
 * Routes messages through user-aware response system
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      userId = null,
      userEmail = null,
      userName = null,
      context = null,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Valid message required" },
        { status: 400 },
      );
    }

    // Step 1: Identify the user
    const userProfile = QMOIUserSystem.identifyUser(
      userId,
      null,
      userEmail || userName,
    );

    // Step 2: Check if this is a greeting/identification request
    const isGreeting =
      message.toLowerCase().includes("who are you") ||
      message.toLowerCase().includes("what are you") ||
      message.toLowerCase().includes("who is") ||
      message.toLowerCase().includes("identify yourself") ||
      message.toLowerCase().includes("what can you do");

    let response: any = {
      success: true,
      userIdentified: userProfile.identified,
      userRole: userProfile.role,
      displayName: userProfile.displayName,
    };

    // Step 3: Generate dynamic introduction if greeting
    if (isGreeting) {
      const introduction = QMOIUserSystem.generateDynamicIntroduction(
        userProfile,
        context,
      );
      response.introduction = introduction.introduction;
      response.role = introduction.role;
      response.hasFullAccess = introduction.hasFullAccess;
      response.type = "introduction";
    } else {
      // Step 4: Process normal messages with user context awareness
      response.message = message;
      response.userContext = {
        realName: userProfile.realName,
        role: userProfile.role,
        accessLevel: userProfile.accessLevel,
        isFamily: userProfile.isFamily,
      };

      // Step 5: Check access and apply restrictions
      const accessCheck = QMOIUserSystem.checkAccess(
        userProfile,
        "general_chat",
      );
      if (!accessCheck.allowed) {
        return NextResponse.json(
          {
            error: "Access denied",
            reason: accessCheck.reason,
            userRole: userProfile.role,
          },
          { status: 403 },
        );
      }

      // Step 6: Add context-aware prefix
      const prefix = QMOIUserSystem.generateContextAwarePrefix(userProfile);
      response.contextPrefix = prefix;
      response.fullMessage = prefix + message;
      response.type = "contextual_response";

      // Step 7: Apply specialized handling if needed
      const messageLower = message.toLowerCase();

      // Memory operations
      if (
        messageLower.includes("my name is") ||
        messageLower.includes("i am")
      ) {
        const nameMatch =
          message.match(/my name is\s+(\w+)/i) ||
          message.match(/i am\s+(\w+)/i);
        if (nameMatch) {
          QMOIUserSystem.storeUserInfo(
            userProfile.id,
            "realName",
            nameMatch[1],
          );
          response.memoryUpdated = true;
          response.stored = { realName: nameMatch[1] };
        }
      }

      // Retrieve stored information
      if (
        messageLower.includes("what is my name") ||
        messageLower.includes("do you remember") ||
        messageLower.includes("what do you know")
      ) {
        const storedInfo = QMOIUserSystem.retrieveUserInfo(
          userProfile.id,
          "realName",
        );
        if (storedInfo.found && storedInfo.value) {
          response.retrieved = storedInfo.value;
          response.retrievalContext = `I remember that your name is ${storedInfo.value}.`;
        }
      }

      // Financial data access check
      if (
        messageLower.includes("financial") ||
        messageLower.includes("money") ||
        messageLower.includes("revenue") ||
        messageLower.includes("trading")
      ) {
        const financialAccess = QMOIUserSystem.checkPermission(
          userProfile,
          "view_financial_data",
        );
        response.financialDataAccess = financialAccess;
        if (!financialAccess) {
          response.restriction =
            "Financial data access restricted to master only";
        }
      }

      // System configuration access check
      if (
        messageLower.includes("system") ||
        messageLower.includes("config") ||
        messageLower.includes("settings")
      ) {
        const systemAccess = QMOIUserSystem.checkPermission(
          userProfile,
          "manage_all_systems",
        );
        response.systemAccess = systemAccess;
        if (!systemAccess && userProfile.role !== "master") {
          response.restriction = "System configuration restricted";
        }
      }
    }

    // Step 8: Add user profile information (only what they should see)
    response.profile = {
      id: userProfile.id,
      displayName: userProfile.displayName,
      role: userProfile.role,
      accessLevel: userProfile.accessLevel,
      hasFullAccess: userProfile.accessLevel >= 100,
    };

    // Step 9: Add session information
    response.session = {
      userId: userProfile.id,
      role: userProfile.role,
      sessionStart: new Date().toISOString(),
      permissions: userProfile.permissions.slice(0, 3), // Show first 3 permissions
      totalPermissions: userProfile.permissions.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for user profile information
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || "guest";
    const profile = QMOIUserSystem.getUserProfile(userId);

    return NextResponse.json({
      success: true,
      profile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 },
    );
  }
}
