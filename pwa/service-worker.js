const CACHE_NAME = 'organizadora-cache-v1';
const FILES_TO_CACHE = [
  '/',                     // raiz, se o site abrir direto aqui
  '/pages/index.html',     
  '/pages/offline.html',
  '/pwa/manifest.json',
  '/pages/formulario.css',       // se o css está na pasta pages
  '/pages/styles.css',
  '/pages/responsive.css',
  '/pages/script.js',
  '/pages/formulario-cardapio.html',
  '/pages/formulario-consultas.html',
  '/pages/formulario-contas.html',
  '/pages/formulario-financas.html',
  '/pages/formulario-limpeza.html',
  '/pages/formulario-lista-compras.html',
  '/pages/formulario-meta.html',
  '/pages/formulario-remedios.html',
  '/pages/formulario-tarefa.html',
  '/pages/tela-inicial.html',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
