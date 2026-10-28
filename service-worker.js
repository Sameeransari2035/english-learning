const CACHE_NAME = 'english-seekho-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/dark-mode.js',
  './js/nav-updater.js',
  './favicon.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar cache mein mila toh wahi do, warna internet se lao
        return response || fetch(event.request);
      })
  );
});

// Purane cache ko clear karna
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});