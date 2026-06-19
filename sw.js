// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
const CACHE_VERSION = "screen-savor-v1";
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/css/styles.css",
  "/css/index.css",
  "/script.js",
  "/js/index.js",
  "/js/artist-sidebar.js",
  "/js/embed-loader.js",
  "/images/coffe1_cleanup.avif",
  "/images/coffe1_cleanup.webp",
  "/images/coffe1_cleanup-360.webp",
  "/images/icon-192.webp",
  "/images/icon-512.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("screen-savor-") && !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGE_CACHE, "/offline.html"));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (["style", "script", "font", "manifest"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || caches.match(fallbackUrl);
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached || fresh;
}
