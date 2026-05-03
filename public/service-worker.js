console.log("[ServiceWorker] production mode initialized");

const CACHE_VERSION = "qmoi-pwa-v1";
const CACHE_URLS = [
  "/",
  "/qcity-dashboard.html",
  "/qmoi-ai.html",
  "/qmoi-space.html",
  "/q-latest.html",
  "/qcity-enterprise.html",
  "/qcity-complete.html",
  "/index.html",
];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_VERSION);
  try {
    await cache.addAll(CACHE_URLS);
    console.log("[ServiceWorker] App shell cached");
  } catch (error) {
    console.warn("[ServiceWorker] Cache addAll failed:", error);
  }
}

self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log("[ServiceWorker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        }),
      ),
    ),
  );
  self.clients.claim();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn("[ServiceWorker] Fetch failed:", error);
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
      return response;
    }
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return response;
  } catch (error) {
    console.warn("[ServiceWorker] Network failed, using cache:", error);
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function checkForUpdates() {
  try {
    const response = await fetch("/api/pwa/check-update");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (data && data.version) {
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.postMessage({
          type: "QMOI_AUTO_UPDATE",
          version: data.version,
          releaseNotes: data.releaseNotes || "",
          autoApply: data.autoApply || false,
        });
      }
    }
  } catch (error) {
    console.warn("[ServiceWorker] Update check failed:", error);
  }
}

async function checkAndApplyUpdates() {
  try {
    const response = await fetch("/api/pwa/auto-update");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (data && data.version) {
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.postMessage({
          type: "QMOI_AUTO_UPDATE",
          version: data.version,
          autoApply: data.autoApply || false,
        });
      }
    }
  } catch (error) {
    console.warn("[ServiceWorker] Auto-update check failed:", error);
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "pwa-update") {
    event.waitUntil(checkForUpdates());
  }
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data.type === "CHECK_UPDATE") {
    event.waitUntil(checkForUpdates());
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "qmoi-auto-update") {
    event.waitUntil(checkAndApplyUpdates());
  }
});

console.log("[ServiceWorker] Loaded and ready");
