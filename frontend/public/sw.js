// Service Worker for IBVAP PWA
const CACHE_NAME = 'ibvap-pwa-v2';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/pwa-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache static assets (manifest, icons). Let everything else go to network.
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.endsWith('.mp4') ||
    event.request.url.includes('/src/') ||
    event.request.url.includes('/node_modules/') ||
    event.request.url.includes('/@') ||
    event.request.url.endsWith('.js') ||
    event.request.url.endsWith('.ts') ||
    event.request.url.endsWith('.tsx') ||
    event.request.url.endsWith('.css') ||
    event.request.url.endsWith('.html')
  ) {
    return; // Let the browser handle these normally — no caching
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      // Cache successful responses for offline use
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      // Offline fallback — try cache
      return caches.match(event.request);
    })
  );
});
