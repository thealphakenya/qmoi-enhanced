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
