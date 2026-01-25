/**
 * QMOI Middleware - Combined Automation & Master Access Control
 * Handles:
 * 1. Background automation initialization
 * 2. Master route protection
 * 3. Admin API authentication
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { initializeBackgroundAutomation } from "@/lib/qmoi-bootstrap";

// Track initialization
let initPromise: Promise<void> | null = null;
let initDone = false;

/**
 * Initialize background automation on first request
 */
async function ensureInitialized() {
  if (initDone) return;

  if (!initPromise) {
    initPromise = (async () => {
      try {
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

  // Protect admin API routes (except auth)
  if (pathname.startsWith("/api/admin/")) {
    if (pathname === "/api/admin/master/auth") {
      return NextResponse.next();
    }

    if (!verifyMasterAccess(request)) {
      return NextResponse.json(
        { error: "Unauthorized: Master token required" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

/**
 * Configure middleware to run on specific paths
 */
export const config = {
  matcher: [
    // Run on all paths except static files and next internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

// Also export initialization for direct use
export { initializeBackgroundAutomation };
