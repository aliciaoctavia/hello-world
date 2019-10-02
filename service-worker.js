
const urlsToCache = [
  '/js/jquery.321.min.js',
  '/img/pwa-logo-96.png'
]

self.addEventListener('push', function(e) {

  var body = 'Push message no payload';
  if (e.data) {
    body = e.data.text();
  }

  var options = {
    body: body,
    icon: '/img/pwa-logo-48.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 2
    },
    actions:[
      {
        action:'yes',
        title:'Yes',
        icon:'/img/check.png'
      },
      {
        action:'no',
        title:'No',
        icon:'/img/close.png'
      }
    ]
  };

  e.waitUntil(
    self.registration.showNotification('Push Notification Title', options)
  );
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'no') {
    notification.close();
  } else {
    clients.openWindow('https://qea.la');
    notification.close();
  }
});


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-cache-v4')
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );

})

self.addEventListener('activate', (event) => {
  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          console.log('cacheName:' + cacheName);

        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );


})