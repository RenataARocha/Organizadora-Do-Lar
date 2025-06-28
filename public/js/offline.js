document.addEventListener('DOMContentLoaded', () => {
  const btnRecarregar = document.querySelector('button');

  btnRecarregar.addEventListener('click', () => {
    location.reload();
  });
});

window.addEventListener('online', () => {
  alert('Uhu! Você está online de novo. Pode continuar usando a Organizadora do Lar normalmente.');
  location.reload();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/pages/offline.html'))
  );
});
