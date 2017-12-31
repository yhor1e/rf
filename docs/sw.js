const cacheName = 'rf-0-0-5';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.info('[ServiceWorker] Caching app shell');
      return cache.addAll([
        './',
        './index.html',
        './main.js',
        './material-icons.css',
        './material.blue_grey-blue.min.css',
        './material.min.js',
        './MaterialIcons-Regular.woff2'
      ]);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.info('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.info('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.info('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
