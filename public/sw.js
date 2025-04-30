
// Cache version - update this when assets change
const CACHE_VERSION = 'v1';
const CACHE_NAME = `olivia-app-cache-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - precache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache static assets with cache-first strategy
  if (event.request.method === 'GET' && 
      (event.request.url.includes('.js') || 
       event.request.url.includes('.css') || 
       event.request.url.includes('.png') || 
       event.request.url.includes('.jpg') || 
       event.request.url.includes('.svg') ||
       event.request.url.endsWith('/'))) {
    
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cache if we have it, otherwise fetch
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((response) => {
          // Return early if error or non-GET
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response - response body can only be consumed once
          const responseToCache = response.clone();
          
          // Cache the fetched response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
  }
});
