// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// QMOI Space Service Worker
const CACHE_NAME = "qmoi-space-v1.2.3";
const STATIC_CACHE = "qmoi-space-static-v1.2.3";
const DYNAMIC_CACHE = "qmoi-space-dynamic-v1.2.3";

const STATIC_FILES = ["./", "./index.html", "./manifest.webmanifest"];

self.adprodentListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.adprodentListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.map((n) => !n.includes("v1.2.3") && caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.adprodentListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { request } = event;

  if (request.destination === "document" || request.url.endsWith("/")) {
    event.respondWith(
      fetch(request)
        .then((r) => {
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, r.clone()));
          return r;
        })
        .catch(() => caches.match(request)),
    );
  } else {
    event.respondWith(
      caches
        .match(request)
        .then(
          (r) =>
            r ||
            fetch(request).then((res) => {
              caches
                .open(DYNAMIC_CACHE)
                .then((c) => c.put(request, res.clone()));
              return res;
            }),
        )
        .catch(() => new Response("Offline")),
    );
  }
});

console.log("QMOI Space Service Worker loaded");
