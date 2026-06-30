const CACHE_NAME = 'neoviet360-v2';
const ASSETS = [
  './',
  './index.html',
  './styles/globals.css',
  './styles/theme.css',
  './styles/components.css',
  './config.js',
  './utils/state.js',
  './utils/router.js',
  './public/logo.svg',
  './public/favicon.svg'
];

// API endpoints to NEVER cache - always fetch fresh
const NEVER_CACHE_PATTERNS = [
  /\/api\//,
  /vercel\.app/,
  /neoviet360-backend/,
  /\.json$/  // Don't cache JSON data files
];

function shouldNeverCache(url) {
  return NEVER_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // NEVER cache API requests - always go to network
  if (shouldNeverCache(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
