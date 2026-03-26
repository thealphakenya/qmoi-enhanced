// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:31Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Middleware - Complete System Initialization & Access Control
 * Handles:
 * 1. Environment auto-setup on first request
 * 2. Background automation initialization
 * 3. Master route protection
 * 4. Admin API authentication
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { initializeBackgroundAutomation } from "@/lib/qmoi-bootstrap";
import { setupManager } from "@/lib/qmoi-auto-setup-manager";

// Track initialization
let initPromise: Promise<void> | null = null;
let initDone = false;
let setupDone = false;

/**
 * Ensure environment is setup
 */
async function ensureSetup() {
  if (setupDone) return;

  try {
    const status = setupManager.getStatus();

    if (!status.configured) {
      (console as any).log("[QMOI] Auto-setup required, initializing environment...");
      setupManager.initialize();
      (console as any).log("[QMOI] Environment auto-setup complete");
    } else {
      (console as any).log("[QMOI] Environment already configured");
    }

    setupDone = true;
  } catch (error) {
    (console as any).error("[QMOI] Error during auto-setup:", error);
    // Continue anyway - app can still work with defaults
  }
}

/**
 * Initialize background automation on first request
 */
async function ensureInitialized() {
  if (initDone) return;

  if (!initPromise) {
    initPromise = (async () => {
      try {
        // Ensure setup first
        await ensureSetup();

        // Only initialize in production or if explicitly enabled
        if (
          process.env.NODE_ENV === "production" ||
          process.env.QMOI_ENABLE_BACKGROUND === "true"
        ) {
          await initializeBackgroundAutomation();
          initDone = true;
        }
      } catch (error) {
        (console as any).error("Failed to initialize background automation:", error);
      }
    })();
  }

  return initPromise;
}

/**
 * Verify master authentication
 */
function verifyMasterAccess(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const adminToken = process.env.ADMIN_TOKEN;

  return token === adminToken && adminToken !== undefined;
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Initialize background automation
  await ensureInitialized();

  // Protect master admin routes (except login)
  if (pathname.startsWith("/admin/master")) {
    if (pathname === "/admin/master/login") {
      return NextResponse.next();
    }

    // Check for valid session or bearer token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!token || token !== adminToken) {
      return NextResponse.redirect(new URL("/admin/master/login", request.url));
    }
  }

  // Protect admin API routes (except auth and auto-setup)
  if (pathname.startsWith("/api/admin/")) {
    if (
      pathname === "/api/admin/master/auth" ||
      pathname === "/api/admin/master/logout"
    ) {
      return NextResponse.next();
    }

    if (!verifyMasterAccess(request)) {
      return NextResponse.json(
        { error: "Unauthorized: Master token required" },
        { status: 403 },
      );
    }
  }

  // Allow auto-setup endpoint without authentication
  if (pathname === "/api/qmoi/auto-setup") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/qmoi/:path*"],
  runtime: "nodejs",
};

// Also export initialization for direct use
export { initializeBackgroundAutomation };
