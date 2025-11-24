// QMOI Space Service Worker - Advanced PWA Features
const CACHE_NAME = 'qmoi-space-v4.0.0';
const STATIC_CACHE = 'qmoi-static-v4.0.0';
const DYNAMIC_CACHE = 'qmoi-dynamic-v4.0.0';
const API_CACHE = 'qmoi-api-v4.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'cache-first',
  DYNAMIC: 'network-first',
  API: 'network-first',
  IMAGES: 'cache-first',
  AUDIO: 'cache-first',
  VIDEO: 'cache-first'
};

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/themes.css',
  '/js/main.js',
  '/js/qmoi-core.js',
  '/js/voice-control.js',
  '/js/camera-integration.js',
  '/js/file-handler.js',
  '/js/avatar-system.js',
  '/js/auto-update.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/sounds/notification.mp3',
  '/sounds/voice-start.mp3',
  '/sounds/voice-end.mp3'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/qmoi/chat',
  '/api/qmoi/voice',
  '/api/qmoi/vision',
  '/api/qmoi/avatar',
  '/api/qmoi/files',
  '/api/qmoi/revenue',
  '/api/qmoi/gaming',
  '/api/qmoi/analytics'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('QMOI Space SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('QMOI Space SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(API_CACHE).then(cache => {
        console.log('QMOI Space SW: Preparing API cache');
        return cache;
      })
    ]).then(() => {
      console.log('QMOI Space SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('QMOI Space SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('QMOI Space SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ]).then(() => {
      console.log('QMOI Space SW: Activation complete');
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Handle different types of requests
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Static files - cache first
    if (isStaticFile(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // API requests - network first
    if (isAPIRequest(url.pathname)) {
      return await networkFirst(request, API_CACHE);
    }
    
    // Images, audio, video - cache first
    if (isMediaFile(url.pathname)) {
      return await cacheFirst(request, DYNAMIC_CACHE);
    }
    
    // Other dynamic content - network first
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('QMOI Space SW: Fetch error:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match('/offline.html') || 
             new Response('QMOI Space is offline. Please check your connection.', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('QMOI Space SW: Serving from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      console.log('QMOI Space SW: Cached new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('QMOI Space SW: Network error for:', request.url, error);
    throw error;
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      console.log('QMOI Space SW: Updated cache for:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('QMOI Space SW: Network failed, trying cache for:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Helper functions
function isStaticFile(pathname) {
  return STATIC_FILES.some(file => pathname === file) ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.html') ||
         pathname.endsWith('.json');
}

function isAPIRequest(pathname) {
  return API_ENDPOINTS.some(endpoint => pathname.startsWith(endpoint)) ||
         pathname.startsWith('/api/');
}

function isMediaFile(pathname) {
  return pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|mp3|wav|ogg|mp4|avi|mov|webm)$/i);
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('QMOI Space SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'qmoi-chat-sync') {
    event.waitUntil(syncChatMessages());
  } else if (event.tag === 'qmoi-file-sync') {
    event.waitUntil(syncFileUploads());
  } else if (event.tag === 'qmoi-voice-sync') {
    event.waitUntil(syncVoiceData());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('QMOI Space SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'QMOI Space notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open QMOI Space',
        icon: '/icons/open-icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon-96x96.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification('QMOI Space', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('QMOI Space SW: Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('QMOI Space SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Sync functions
async function syncChatMessages() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingMessages = await cache.match('/pending-chat-messages');
    
    if (pendingMessages) {
      const messages = await pendingMessages.json();
      
      for (const message of messages) {
        try {
          await fetch('/api/qmoi/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
          });
        } catch (error) {
          console.error('QMOI Space SW: Failed to sync chat message:', error);
        }
      }
      
      // Clear pending messages after sync
      await cache.delete('/pending-chat-messages');
    }
  } catch (error) {
    console.error('QMOI Space SW: Chat sync failed:', error);
  }
}

async function syncFileUploads() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingFiles = await cache.match('/pending-file-uploads');
    
    if (pendingFiles) {
      const files = await pendingFiles.json();
      
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file.data);
          formData.append('metadata', JSON.stringify(file.metadata));
          
          await fetch('/api/qmoi/files/upload', {
            method: 'POST',
            body: formData
          });
        } catch (error) {
          console.error('QMOI Space SW: Failed to sync file upload:', error);
        }
      }
      
      // Clear pending files after sync
      await cache.delete('/pending-file-uploads');
    }
  } catch (error) {
    console.error('QMOI Space SW: File sync failed:', error);
  }
}

async function syncVoiceData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingVoice = await cache.match('/pending-voice-data');
    
    if (pendingVoice) {
      const voiceData = await pendingVoice.json();
      
      for (const data of voiceData) {
        try {
          await fetch('/api/qmoi/voice/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        } catch (error) {
          console.error('QMOI Space SW: Failed to sync voice data:', error);
        }
      }
      
      // Clear pending voice data after sync
      await cache.delete('/pending-voice-data');
    }
  } catch (error) {
    console.error('QMOI Space SW: Voice sync failed:', error);
  }
}

// Periodic background sync
self.addEventListener('periodicsync', event => {
  console.log('QMOI Space SW: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'qmoi-cache-update') {
    event.waitUntil(updateCaches());
  } else if (event.tag === 'qmoi-cleanup') {
    event.waitUntil(cleanupCaches());
  }
});

async function updateCaches() {
  try {
    console.log('QMOI Space SW: Updating caches...');
    
    // Update static files
    const staticCache = await caches.open(STATIC_CACHE);
    for (const file of STATIC_FILES) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          await staticCache.put(file, response);
        }
      } catch (error) {
        console.warn('QMOI Space SW: Failed to update static file:', file, error);
      }
    }
    
    console.log('QMOI Space SW: Cache update complete');
  } catch (error) {
    console.error('QMOI Space SW: Cache update failed:', error);
  }
}

async function cleanupCaches() {
  try {
    console.log('QMOI Space SW: Cleaning up caches...');
    
    const cacheNames = await caches.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge) {
            await cache.delete(request);
          }
        }
      }
    }
    
    console.log('QMOI Space SW: Cache cleanup complete');
  } catch (error) {
    console.error('QMOI Space SW: Cache cleanup failed:', error);
  }
}

console.log('QMOI Space Service Worker loaded successfully');

