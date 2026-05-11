/* ============================================================
   ArtCraft Studio — Service Worker (PWA)
   ============================================================ */

const CACHE_NAME = "artcraft-v1";
const STATIC_ASSETS = [
  "/artcraft/",
  "/artcraft/index.html",
  "/artcraft/shop.html",
  "/artcraft/product.html",
  "/artcraft/custom-order.html",
  "/artcraft/about.html",
  "/artcraft/contact.html",
  "/artcraft/cart.html",
  "/artcraft/checkout.html",
  "/artcraft/order-success.html",
  "/artcraft/auth.html",
  "/artcraft/wishlist.html",
  "/artcraft/style.css",
  "/artcraft/script.js",
  "/artcraft/manifest.json",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch — network first, cache fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
