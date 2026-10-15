// Service Worker for Haj Dua's Mobile App (Offline)
const VERSION = "haj-duas-v4";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/Duas/Leaving%20Home-1.ogg",
  "/Duas/Leaving%20Home-2.ogg",
  "/Duas/Send%20of%20others.ogg",
  "/Duas/BOARDING%20IN%20THE%20SHIP.ogg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then(async (c) => {
      for (const url of SHELL) {
        try {
          await c.add(url);
        } catch (err) {
          console.warn("SW item precache error:", url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) =>
      Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  
  // Don't intercept Vite development modules
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/index.html")));
    return;
  }

  // Cache first for all static assets & audio files
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      // Handle decoded vs encoded pathname for audio files
      if (url.pathname.includes("/Duas/")) {
        const decoded = decodeURIComponent(url.pathname);
        return caches.match(decoded, { ignoreSearch: true }).then((decodedHit) => {
          if (decodedHit) return decodedHit;
          return fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }).catch(() => new Response("", { status: 404, statusText: "Offline audio unavailable" }));
        });
      }
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
