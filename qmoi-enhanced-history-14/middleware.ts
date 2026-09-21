/**
 * QMOI Middleware - Complete System Initialization & Access Control
 * Handles:
 * 1. Environment auto-setup on first request
 * 2. Background automation initialization
 * 3. Master route protection
 * 4. Master API authentication
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
      console.log("[QMOI] Auto-setup required, initializing environment...");
      setupManager.initialize();
      console.log("[QMOI] Environment auto-setup complete");
    } else {
      console.log("[QMOI] Environment already configured");
    }

    setupDone = true;
  } catch (error) {
    console.error("[QMOI] Error during auto-setup:", error);
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
        console.error("Failed to initialize background automation:", error);
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

  // Protect master master routes (except login)
  if (pathname.startsWith("/master/master")) {
    if (pathname === "/master/master/login") {
      return NextResponse.next();
    }

    // Check for valid session or bearer token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!token || token !== adminToken) {
      return NextResponse.redirect(new URL("/master/master/login", request.url));
    }
  }

  // Protect master API routes (except auth and auto-setup)
  if (pathname.startsWith("/api/master/")) {
    if (
      pathname === "/api/master/master/auth" ||
      pathname === "/api/master/master/logout"
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
  matcher: ["/master/:path*", "/api/master/:path*", "/api/qmoi/:path*"],
  runtime: "nodejs",
};

// Also export initialization for direct use
export { initializeBackgroundAutomation };
