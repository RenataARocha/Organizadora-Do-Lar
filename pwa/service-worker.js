const FILES_TO_CACHE = [
  '/',                     
  '/pages/index.html',     
  '/pages/offline.html',
  '/pwa/manifest.json',
  '/pages/formulario.css',
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

FILES_TO_CACHE.forEach(async path => {
  try {
    const res = await fetch(path);
    if (!res.ok) console.error(`❌ Falhou: ${path} - Status ${res.status}`);
    else console.log(`✅ OK: ${path}`);
  } catch (err) {
    console.error(`❌ Erro fatal: ${path}`, err);
  }
});
