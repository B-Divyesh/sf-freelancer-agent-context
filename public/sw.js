const CACHE = 'ccf-shell-v0.1.2';
const SHELL = ['/', '/demo', '/app', '/privacy', '/terms', '/art/boundary-ledger.webp', '/icons/favicon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(async response => {
      if (response.ok) await caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(event.request)) || caches.match('/')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(async response => {
    if (response.ok) await caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
