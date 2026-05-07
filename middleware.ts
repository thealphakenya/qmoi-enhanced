import { NextRequest, NextResponse } from "next/server";

const logger = {
  info: logger.info.bind(console, "[middleware]"),
  warn: console.warn.bind(console, "[middleware]"),
  error: console.error.bind(console, "[middleware]"),
};

const setupManager = {
  getStatus() {
    return { configured: true };
  },
  initialize() {
    logger.info("[QMOI] setupManager.initialize called");
  },
};

let initPromise: Promise<void> | null = null;
let initDone = false;
let setupDone = false;

function ensureSetup(): void {
  if (setupDone) return;

  try {
    const status = setupManager.getStatus();

    if (!status.configured) {
      logger.info("[QMOI] Auto-setup required, initializing environment");
      setupManager.initialize();
      logger.info("[QMOI] Environment auto-setup complete");
    } else {
      logger.info("[QMOI] Environment already configured");
    }

    setupDone = true;
  } catch (error) {
    logger.error("[QMOI] Error during auto-setup:", error);
    // Continue anyway - app can still work with defaults
  }
}

async function initializeBackgroundAutomation(): Promise<void> {
  logger.info("[QMOI] Initializing background automation...");
}

function ensureInitialized(): Promise<void> | void {
  if (initDone) return;

  if (!initPromise) {
    initPromise = (async () => {
      try {
        ensureSetup();

        if (process.env.QMOI_ENABLE_BACKGROUND === "true") {
          await initializeBackgroundAutomation();
          initDone = true;
        }
      } catch (error) {
        logger.error("Failed to initialize background automation:", error);
      }
    })();
  }

  return initPromise;
}

function verifyMasterAccess(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const adminToken = process.env.ADMIN_TOKEN;

  return !!token && adminToken !== undefined && token === adminToken;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  await ensureInitialized();

  if (pathname.startsWith("/admin/master")) {
    if (pathname === "/admin/master/login") {
      return NextResponse.next();
    }

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!token || token !== adminToken) {
      return NextResponse.redirect(new URL("/admin/master/login", request.url));
    }
  }

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

  if (pathname === "/api/qmoi/auto-setup") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/qmoi/:path*"],
  runtime: "nodejs",
};

export { initializeBackgroundAutomation };
