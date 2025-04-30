// Cache version - update this when assets change
const CACHE_VERSION = 'v2';
const CACHE_NAME = `olivia-app-cache-${CACHE_VERSION}`;
const IMAGE_CACHE = `olivia-images-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Critical images to cache on install
const CRITICAL_IMAGES = [
  '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
  '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png',
  '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
  '/lovable-uploads/4e16d86c-652b-4717-958f-b48ce5663c9b.png',
  '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png',
  '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png',
  '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png',
  '/lovable-uploads/0d7fa3b7-6021-40f8-8d5f-5888742474a7.png',
  '/lovable-uploads/fc3adcfb-8651-4f05-b4ea-ae17d34c7699.png'
];

// Install event - precache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache main app assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Cache critical images separately for better management
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_IMAGES);
      })
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== IMAGE_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Immediately claim clients so the new service worker takes over
  return self.clients.claim();
});

// Helper function to determine if request should be cached
const shouldCache = (request) => {
  const url = new URL(request.url);
  
  // Cache strategy for images
  if (request.destination === 'image') {
    return true;
  }
  
  // Cache strategy for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf')
  ) {
    return true;
  }
  
  // Cache HTML for app routes
  if (request.mode === 'navigate') {
    return true;
  }
  
  return false;
};

// Fetch event - cache-first strategy for static assets, network-first for API calls
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For images, use cache-first strategy
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cache if we have it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Return early if error or non-GET
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Clone the response since it can only be consumed once
          const responseToCache = networkResponse.clone();
          
          // Cache the fetched image
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // For other cacheable resources
  if (shouldCache(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cache if we have it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch
        return fetch(event.request).then((networkResponse) => {
          // Return early if error or non-GET
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Clone the response
          const responseToCache = networkResponse.clone();
          
          // Cache the fetched resource
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        });
      })
    );
  }
});
