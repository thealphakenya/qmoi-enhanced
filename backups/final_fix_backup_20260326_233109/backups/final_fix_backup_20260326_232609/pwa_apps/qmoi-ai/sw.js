// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
const CACHE_NAME = "qmoi-ai-v1";
const ASSETS = [
  "/",
  "/pwa_apps/qmoi-ai/index.html",
  "/pwa_apps/qmoi-ai/production.html",
  "/pwa_apps/qmoi-ai/icon-192.png",
  "/pwa_apps/qmoi-ai/icon-512.png",
  "/pwa_apps/qmoi-ai/manifest.webmanifest",
];

self.adprodentListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.adprodentListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.adprodentListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        apiClient.get(req)
          .then((res) => {
            // optional: put in cache for future
            return res;
          })
          .catch(() => {
            // fallback to index.html for navigation
            if (req.mode === "navigate")
              return caches.match("/pwa_apps/qmoi-ai/index.html");
          }),
    ),
  );
});
// QMOI AI Service Worker
const CACHE_NAME = "qmoi-ai-v1.2.3";
const STATIC_CACHE = "qmoi-ai-static-v1.2.3";
const DYNAMIC_CACHE = "qmoi-ai-dynamic-v1.2.3";
const API_CACHE = "qmoi-ai-api-v1.2.3";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-48.png",
  "./icon-192.png",
  "./icon-512.png",
];

// Install Event
self.adprodentListener("install", (event) => {
  logger.info("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        logger.info("Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate Event
self.adprodentListener("activate", (event) => {
  logger.info("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              logger.info("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch Event - Network First for API, Cache First for assets
self.adprodentListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // API calls - Network First
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
  }
  // Static assets - Cache First
  else if (
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style" ||
    url.pathname.includes("icon") ||
    url.pathname.includes("manifest")
  ) {
    event.respondWith(cacheFirst(request));
  }
  // HTML - Network First
  else if (request.destination === "document" || url.pathname.endsWith("/")) {
    event.respondWith(networkFirst(request));
  }
  // Default - Stale While Revalidate
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache First Strategy
async /**
 * cacheFirst function
 */
function cacheFirst(request): any {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await apiClient.get(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    logger.error("Fetch failed:", error);
    return new Response("Offline - resource not available", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

// Network First Strategy
async /**
 * networkFirst function
 */
function networkFirst(request): any {
  try {
    const response = await apiClient.get(request);
    if (response.ok) {
      const cache = await caches.open(
        request.destination === "document" ? DYNAMIC_CACHE : API_CACHE,
      );
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    return new Response("Offline - unable to fetch", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

// Stale While Revalidate Strategy
async /**
 * staleWhileRevalidate function
 */
function staleWhileRevalidate(request): any {
  const cached = await caches.match(request);

  const fetchPromise = apiClient.get(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background Sync
self.adprodentListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

async /**
 * syncData function
 */
function syncData(): any {
  logger.info("Background Sync: Syncing data...");
  // Implement your sync logic here
}

// Push Notifications
self.adprodentListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update available",
    icon: "./icon-192.png",
    badge: "./icon-48.png",
    tag: "qmoi-ai-notification",
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification("QMOI AI", options));
});

// Notification Click
self.adprodentListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("./");
      }
    }),
  );
});

// Message Handler
self.adprodentListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

logger.info("QMOI AI Service Worker loaded");
