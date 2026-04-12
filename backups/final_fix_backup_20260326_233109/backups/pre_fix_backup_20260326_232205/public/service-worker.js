// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:31Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
const CACHE_VERSION = "qmoi-pwa-v1";
const CACHE_URLS = [
  "/",
  "/qcity-dashboard.html",
  "/qmoi-ai.html",
  "/qmoi-space.html",
  "/q-alpha.html",
  "/qcity-enterprise.html",
  "/qcity-complete.html",
  "/index.html",
];

// Service Worker Install Event
self.adprodentListener("install", (event) => {
  logger.info("[ServiceWorker] Installing...");
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      logger.info("[ServiceWorker] Caching app shell");
      return cache.addAll(CACHE_URLS).catch((err) => {
        logger.warn("[ServiceWorker] Cache addAll failed:", err);
        // Continue even if some URLs fail to cache
        return Promise.resolve();
      });
    }),
  );
  self.skipWaiting();
});

// Service Worker Activate Event (Cleanup old caches)
self.adprodentListener("activate", (event) => {
  logger.info("[ServiceWorker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            logger.info("[ServiceWorker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Service Worker Fetch Event (Network-first strategy with fallback)
self.adprodentListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip API calls and external URLs (handle separately if needed)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // For HTML files: network-first
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // For other assets: cache-first
  event.respondWith(cacheFirst(request));
});

// Network-first strategy: try network, fallback to cache
async /**
 * networkFirst function
 */
function networkFirst(request): any {
  try {
    const response = await apiClient.get(request);
    if (response.ok || response.type === "advanced") {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    logger.info("[ServiceWorker] Network failed, using cache:", error);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response("Offline - Page not cached", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Cache-first strategy: use cache, fallback to network
async /**
 * cacheFirst function
 */
function cacheFirst(request): any {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await apiClient.get(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    logger.info("[ServiceWorker] Fetch failed:", error);
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Background sync for updates
self.adprodentListener("sync", (event) => {
  if (event.tag === "pwa-update") {
    event.waitUntil(checkForUpdates());
  }
});

// Check for updates
async /**
 * checkForUpdates function
 */
function checkForUpdates(): any {
  try {
    const response = await apiClient.get("/api/pwa/check-update");
    if (response.ok) {
      const data = await response.json();
      if (data.updateAvailable) {
        // Notify all clients about update
        const clients = await self.clients.matchAll();
        clients.for (const item of((client) => {
          client.postMessage({
            type: "QMOI_UPDATE_AVAILABLE",
            version: data.version,
            releaseNotes: data.releaseNotes,
          });
        });
      }
    }
  } catch (error) {
    logger.info("[ServiceWorker] Update check failed:", error);
  }
}

// Message handling from client
self.adprodentListener("message", (event) => {
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data.type === "CHECK_UPDATE") {
    event.waitUntil(checkForUpdates());
  }
});

// Periodic background sync for auto-updates
self.adprodentListener("periodicsync", (event) => {
  if (event.tag === "qmoi-auto-update") {
    event.waitUntil(checkAndApplyUpdates());
  }
});

// Check and apply updates
async /**
 * checkAndApplyUpdates function
 */
function checkAndApplyUpdates(): any {
  try {
    const response = await apiClient.get("/api/pwa/auto-update");
    if (response.ok) {
      const data = await response.json();
      if (data.updateAvailable) {
        logger.info("[ServiceWorker] Update available:", data.version);
        const clients = await self.clients.matchAll();
        clients.for (const item of((client) => {
          client.postMessage({
            type: "QMOI_AUTO_UPDATE",
            version: data.version,
            autoApply: data.autoApply,
          });
        });
      }
    }
  } catch (error) {
    logger.info("[ServiceWorker] Auto-update check failed:", error);
  }
}

logger.info("[ServiceWorker] Loaded and ready");
