const CACHE_NAME = 'lol-cafe-cache-v1';
const API_CACHE_NAME = 'lol-cafe-api-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
+  const url = new URL(request.url)
+  // API requests: network first
+  if (url.pathname.startsWith('/api/')) {
+    event.respondWith(
+      fetch(request)
+        .then((res) => {
+          const copy = res.clone()
+          caches.open(API_CACHE_NAME).then((cache) => cache.put(request, copy))
+          return res
+        })
+        .catch(() => caches.match(request))
+    )
+    return
+  }

  // Otherwise, try cache first then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match(OFFLINE_URL)))
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting()
})
