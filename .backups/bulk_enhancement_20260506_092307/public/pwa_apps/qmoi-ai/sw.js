const CACHE_NAME = 'qmoi-ai-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-48.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        }),
      ),
    ),
  );
  self.clients.claim();
});

const isNavigationRequest = (request) =>
  request.mode === 'navigate' ||
  (request.destination === 'document' && request.method === 'GET');

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin === location.origin) {
    if (isNavigationRequest(request)) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match('./index.html')),
      );
      return;
    }

    if (
      request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      requestUrl.pathname.endsWith('.png') ||
      requestUrl.pathname.endsWith('.webmanifest')
    ) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          });
        }),
      );
      return;
    }
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request) || caches.match('./index.html')),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
