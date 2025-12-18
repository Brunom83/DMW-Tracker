// sw.js - O Service Worker
const CACHE_NAME = 'dmw-tracker-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './css/animations.css',
    './js/app.js',
    './js/utils.js',
    './js/moedas.js',
    './js/eggs.js',
    './js/tours.js',
    './js/dungeons.js',
    './js/data_manager.js',
    './js/charts.js',
    './js/validators.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. Instalação: Cache dos ficheiros estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all files');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Fetch: Serve do Cache se estiver offline, senão vai à net
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Se estiver no cache, retorna o cache. Senão, vai buscar à rede.
            return response || fetch(event.request);
        })
    );
});

// 3. Ativação: Limpa caches antigas se mudarmos a versão
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});