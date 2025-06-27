const FILES_TO_CACHE = [
  './pages/index.html',
  './pages/offline.html',
  './pwa/manifest.json',
  './pages/formulario.css',
  './pages/styles.css',
  './pages/responsive.css',
  './pages/script.js',
  './pages/formulario-cardapio.html',
  './pages/formulario-consultas.html',
  './pages/formulario-contas.html',
  './pages/formulario-cronograma-capilar.html',
  './pages/formulario-financas.html',
  './pages/formulario-limpeza.html',
  './pages/formulario-lista-compras.html',
  './pages/formulario-meta.html',
  './pages/formulario-remedios.html',
  './pages/formulario-skincare.html',
  './pages/formulario-tarefa.html',
  './pages/tela-inicial.html',
  './assets/icon-192.png',
  './assets/icon-512.png'
];


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
