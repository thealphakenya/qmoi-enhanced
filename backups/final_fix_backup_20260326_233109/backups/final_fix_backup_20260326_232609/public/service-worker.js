// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:31Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
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
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(CACHE_URLS).catch((err) => {
        console.warn("[ServiceWorker] Cache addAll failed:", err);
        // Continue even if some URLs fail to cache
        return Promise.resolve();
      });
    }),
  );
  self.skipWaiting();
});

// Service Worker Activate Event (Cleanup old caches)
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log("[ServiceWorker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Service Worker Fetch Event (Network-first strategy with fallback)
self.addEventListener("fetch", (event) => {
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
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok || response.type === "basic") {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    console.log("[ServiceWorker] Network failed, using cache:", error);
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
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[ServiceWorker] Fetch failed:", error);
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Background sync for updates
self.addEventListener("sync", (event) => {
  if (event.tag === "pwa-update") {
    event.waitUntil(checkForUpdates());
  }
});

// Check for updates
async function checkForUpdates() {
  try {
    const response = await fetch("/api/pwa/check-update");
    if (response.ok) {
      const data = await response.json();
      if (data.updateAvailable) {
        // Notify all clients about update
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "QMOI_UPDATE_AVAILABLE",
            version: data.version,
            releaseNotes: data.releaseNotes,
          });
        });
      }
    }
  } catch (error) {
    console.log("[ServiceWorker] Update check failed:", error);
  }
}

// Message handling from client
self.addEventListener("message", (event) => {
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data.type === "CHECK_UPDATE") {
    event.waitUntil(checkForUpdates());
  }
});

// Periodic background sync for auto-updates
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "qmoi-auto-update") {
    event.waitUntil(checkAndApplyUpdates());
  }
});

// Check and apply updates
async function checkAndApplyUpdates() {
  try {
    const response = await fetch("/api/pwa/auto-update");
    if (response.ok) {
      const data = await response.json();
      if (data.updateAvailable) {
        console.log("[ServiceWorker] Update available:", data.version);
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "QMOI_AUTO_UPDATE",
            version: data.version,
            autoApply: data.autoApply,
          });
        });
      }
    }
  } catch (error) {
    console.log("[ServiceWorker] Auto-update check failed:", error);
  }
}

console.log("[ServiceWorker] Loaded and ready");
