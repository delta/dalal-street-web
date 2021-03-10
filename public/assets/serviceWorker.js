console.log("Hello world from service worker");
self.addEventListener("push", (e) => {
  console.log(e);
  const data = e.data.json();
  console.log(data);
  console.log("Push Received...", data);
  self.registration.showNotification(data.Title, {
    body: data.Message,
    icon: "",
  });
});
var currentCache = {
  offline: 'offline-cache_dalal'
};
const offlineUrl = 'offline.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
        "./sed.png",
          offlineUrl
      ]);
    })
  );
});

this.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl);
          })
    );
  }
  else{
    // Respond with everything else if we can
    event.respondWith(caches.match(event.request)
                    .then(function (response) {
                    return response || fetch(event.request);
                }).catch(error =>{
                  return caches.match("./sed.png");
                })
        );
  }
});
