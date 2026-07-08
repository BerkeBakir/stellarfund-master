// Minimal service worker for installability (PWA). Network-first with no asset
// caching, so a new deployment's code is always served immediately (no stale
// bundle after redeploys). Bump CACHE to force older SWs to update.
const CACHE = 'stellarfund-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

// Pass-through: always go to the network. The SW exists only to make the app
// installable; it does not cache, so it can never serve stale code.
self.addEventListener('fetch', () => {});
