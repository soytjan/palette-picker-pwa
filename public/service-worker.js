this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/js/scripts.js',
        '/css/reset.css',
        '/css/styles.css',
        '/assets/closed-lock.png',
        '/assets/open-lock.png',
        '/assets/paint-palette.png',
        '/assets/trash.png'
      ])
    })
  );
})