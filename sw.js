/**
 * COSMIC KNIGHT 2D - SERVICE WORKER (OFFLINE PWA)
 * Programmed & Developed by: Ahmed Abdelwahab (أحمد عبد الوهاب)
 * Caches all game assets for instant offline play.
 */

const CACHE_NAME = 'cosmic-knight-v3.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    './css/style.css',
    './js/audio.js',
    './js/particles.js',
    './js/levels.js',
    './js/entities.js',
    './js/controls.js',
    './js/engine.js',
    './js/game.js',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable.png',
    './icons/favicon.png',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Outfit:wght@500;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// 1. Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline assets...');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('[ServiceWorker] Some non-critical assets failed to cache:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: Cache First with Network Fallback & Runtime Caching
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Fetch in background to update cache (Stale-While-Revalidate)
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {
                    // Ignore offline network errors
                });
                return cachedResponse;
            }

            // Not in cache: fetch from network and store for next time
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // If offline and request is for HTML page, return root index
                if (event.request.headers.get('accept')?.includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
