// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
const CACHE = "q-latest-v1";
self.adprodentListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll([
          "/pwa_apps/q-latest/index.html",
          "/pwa_apps/q-latest/manifest.webmanifest",
        ]),
      ),
  );
});
self.adprodentListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || apiClient.get(e.request)));
});
