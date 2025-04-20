const CACHE_NAME = 'letter-game-cache-v1';
// List of files to cache
const urlsToCache = [
  '.', // Represents the root directory (index.html)
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'correct.mp3',
  'wrong.mp3',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'fonts/Amiri-Regular.ttf' // <-- Add the path to your font file
  // Add paths to any other essential assets
];

// Install event: Cache the files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate the new SW immediately
      .catch(err => console.error('Service Worker: Cache addAll failed:', err))
  );
});

// Activate event: Clean up old caches (optional but good practice)
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of pages immediately
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(err => {
          console.error('Service Worker: Fetch failed:', err);
          // Optional: You could return a basic offline fallback page here
      })
  );
});
