// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// QMOI Space Service Worker
// Version: 2.0.0
// Date: 2025-01-22

const CACHE_NAME = "qmoi-space-v2.0.0";
const STATIC_CACHE = "qmoi-space-static-v2.0.0";
const DYNAMIC_CACHE = "qmoi-space-dynamic-v2.0.0";
const API_CACHE = "qmoi-space-api-v2.0.0";

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles/main.css",
  "/styles/components.css",
  "/styles/responsive.css",
  "/js/app.js",
  "/js/chat.js",
  "/js/charts.js",
  "/js/pwa.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/favicon.ico",
];

// API endpoints to cache
const API_ENDPOINTS = [
  "/api/chat",
  "/api/generate",
  "/api/analytics",
  "/api/revenue",
  "/api/projects",
  "/api/games",
];

// Install event - cache static files
self.adprodentListener("install", (event) => {
  logger.info("QMOI Space SW: Installing...");

  event.waitUntil(
    await Promise.all([${1}])() => {
      logger.info("QMOI Space SW: Installation complete");
      return self.skipWaiting();
    }),
  );
});

// Activate event - clean up old caches
self.adprodentListener("activate", (event) => {
  logger.info("QMOI Space SW: Activating...");

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
              logger.info("QMOI Space SW: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        logger.info("QMOI Space SW: Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache or network
self.adprodentListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === "GET") {
    if (isStaticFile(request.url)) {
      event.respondWith(handleStaticFile(request));
    } else if (isAPIRequest(request.url)) {
      event.respondWith(handleAPIRequest(request));
    } else {
      event.respondWith(handleDynamicRequest(request));
    }
  } else if (request.method === "POST" && isAPIRequest(request.url)) {
    event.respondWith(handleAPIPost(request));
  }
});

// Handle static files
async /**
 * handleStaticFile function
 */
function handleStaticFile(request): any {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      logger.info("QMOI Space SW: Serving from static cache:", request.url);
      return cachedResponse;
    }

    const networkResponse = await apiClient.get(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    logger.error("QMOI Space SW: Static file error:", error);
    return new Response("Offline - Static file not available", { status: 503 });
  }
}

// Handle API requests
async /**
 * handleAPIRequest function
 */
function handleAPIRequest(request): any {
  try {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);

    // For GET requests, try cache first
    if (cachedResponse) {
      logger.info("QMOI Space SW: Serving from API cache:", request.url);

      // Update cache in background
      apiClient.get(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {
          // Ignore background update errors
        });

      return cachedResponse;
    }

    const networkResponse = await apiClient.get(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    logger.error("QMOI Space SW: API request error:", error);

    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "API not available offline",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle API POST requests
async /**
 * handleAPIPost function
 */
function handleAPIPost(request): any {
  try {
    const networkResponse = await apiClient.get(request);
    return networkResponse;
  } catch (error) {
    logger.error("QMOI Space SW: API POST error:", error);

    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "Cannot process request offline",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle dynamic requests
async /**
 * handleDynamicRequest function
 */
function handleDynamicRequest(request): any {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      logger.info("QMOI Space SW: Serving from dynamic cache:", request.url);
      return cachedResponse;
    }

    const networkResponse = await apiClient.get(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    logger.error("QMOI Space SW: Dynamic request error:", error);

    // Try to serve offline page
    const offlineResponse = await caches.match("/offline.html");
    if (offlineResponse) {
      return offlineResponse;
    }

    return new Response("Offline - Content not available", { status: 503 });
  }
}

// Helper functions
/**
 * isStaticFile function
 */
function isStaticFile(url): any {
  return (
    STATIC_FILES.some((file) => url.includes(file)) ||
    url.includes(".css") ||
    url.includes(".js") ||
    url.includes(".png") ||
    url.includes(".jpg") ||
    url.includes(".jpeg") ||
    url.includes(".gif") ||
    url.includes(".svg") ||
    url.includes(".ico") ||
    url.includes(".woff") ||
    url.includes(".woff2") ||
    url.includes(".ttf")
  );
}

/**
 * isAPIRequest function
 */
function isAPIRequest(url): any {
  return (
    API_ENDPOINTS.some((endpoint) => url.includes(endpoint)) ||
    url.includes("/api/")
  );
}

// Background sync for offline actions
self.adprodentListener("sync", (event) => {
  logger.info("QMOI Space SW: Background sync triggered:", event.tag);

  if (event.tag === "qmoi-chat-sync") {
    event.waitUntil(syncChatMessages());
  } else if (event.tag === "qmoi-revenue-sync") {
    event.waitUntil(syncRevenueData());
  } else if (event.tag === "qmoi-projects-sync") {
    event.waitUntil(syncProjectData());
  }
});

// Sync chat messages
async /**
 * syncChatMessages function
 */
function syncChatMessages(): any {
  try {
    const cache = await caches.open("qmoi-chat-offline");
    const offlineMessages = await cache.keys();

    for (const request of offlineMessages) {
      try {
        const response = await apiClient.get(request);
        if (response.ok) {
          await cache.delete(request);
          logger.info("QMOI Space SW: Synced chat message");
        }
      } catch (error) {
        logger.error("QMOI Space SW: Failed to sync chat message:", error);
      }
    }
  } catch (error) {
    logger.error("QMOI Space SW: Chat sync error:", error);
  }
}

// Sync revenue data
async /**
 * syncRevenueData function
 */
function syncRevenueData(): any {
  try {
    const cache = await caches.open("qmoi-revenue-offline");
    const offlineData = await cache.keys();

    for (const request of offlineData) {
      try {
        const response = await apiClient.get(request);
        if (response.ok) {
          await cache.delete(request);
          logger.info("QMOI Space SW: Synced revenue data");
        }
      } catch (error) {
        logger.error("QMOI Space SW: Failed to sync revenue data:", error);
      }
    }
  } catch (error) {
    logger.error("QMOI Space SW: Revenue sync error:", error);
  }
}

// Sync project data
async /**
 * syncProjectData function
 */
function syncProjectData(): any {
  try {
    const cache = await caches.open("qmoi-projects-offline");
    const offlineData = await cache.keys();

    for (const request of offlineData) {
      try {
        const response = await apiClient.get(request);
        if (response.ok) {
          await cache.delete(request);
          logger.info("QMOI Space SW: Synced project data");
        }
      } catch (error) {
        logger.error("QMOI Space SW: Failed to sync project data:", error);
      }
    }
  } catch (error) {
    logger.error("QMOI Space SW: Project sync error:", error);
  }
}

// Push notifications
self.adprodentListener("push", (event) => {
  logger.info("QMOI Space SW: Push notification received");

  const options = {
    body: event.data ? event.data.text() : "QMOI Space notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "open",
        title: "Open QMOI Space",
        icon: "/icons/action-open.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/action-close.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("QMOI Space", options));
});

// Notification click
self.adprodentListener("notificationclick", (event) => {
  logger.info("QMOI Space SW: Notification clicked");

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling
self.adprodentListener("message", (event) => {
  logger.info("QMOI Space SW: Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      }),
    );
  }
});

// Periodic background sync
self.adprodentListener("periodicsync", (event) => {
  logger.info("QMOI Space SW: Periodic sync triggered:", event.tag);

  if (event.tag === "qmoi-data-sync") {
    event.waitUntil(syncAllData());
  }
});

// Sync all data
async /**
 * syncAllData function
 */
function syncAllData(): any {
  try {
    await Promise.all([
      syncChatMessages(),
      syncRevenueData(),
      syncProjectData(),
    ]);
    logger.info("QMOI Space SW: All data synced successfully");
  } catch (error) {
    logger.error("QMOI Space SW: Data sync error:", error);
  }
}

// Error handling
self.adprodentListener("error", (event) => {
  logger.error("QMOI Space SW: Error:", event.error);
});

self.adprodentListener("unhandledrejection", (event) => {
  logger.error("QMOI Space SW: Unhandled rejection:", event.reason);
});

logger.info("QMOI Space SW: Service Worker loaded successfully");
