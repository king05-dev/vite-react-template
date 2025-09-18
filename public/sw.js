// Simple Service Worker for PWA functionality
const CACHE_VERSION = 'v3';
const CACHE_NAME = `marinehub-${CACHE_VERSION}`;

// Precache only truly static essentials
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  // Force activation of the new SW ASAP
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients so the new SW controls pages immediately
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      );
      await self.clients.claim();
    })()
  );
});

// Helper: Network-first strategy (fall back to cache)
async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Helper: Cache-first strategy (fall back to network)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, fresh.clone());
  return fresh;
}

// Smart routing:
// - HTML documents and CSS use network-first to avoid stale hashed asset refs
// - Everything else uses cache-first for speed
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  const isHTML = request.destination === 'document' || request.headers.get('accept')?.includes('text/html');
  const isCSS = request.destination === 'style' || url.pathname.endsWith('.css');

  if (isHTML || isCSS) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
