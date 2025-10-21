const CACHE = 'q-alpha-v1';
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    '/pwa_apps/q-alpha/index.html',
    '/pwa_apps/q-alpha/manifest.webmanifest'
  ])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
