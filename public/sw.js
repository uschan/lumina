
const CACHE_NAME = 'lumina-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force activation immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Aggressively clean up ANY old caches to prevent white screen of death
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // STRICT NETWORK FIRST STRATEGY
  // 1. Try Network
  // 2. If Network fails (offline), use Cache
  // 3. If Cache missing, return offline fallback (optional, not implemented here)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and update cache with fresh version
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        console.warn('Network failed, falling back to cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});
