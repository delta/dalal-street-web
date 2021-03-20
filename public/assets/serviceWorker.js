console.log("Hello world from service worker");
self.addEventListener("push", (e) => {
  console.log(e);
  const data = e.data.json();
  console.log(data);
  console.log("Push Received...", data);
  self.registration.showNotification(data.Title, {
    body: data.Message,
    requireInteraction: true,
    icon: data.LogoUrl,
    badge: data.LogoUrl,
    image: data.ImageUrl,
  });
});

self.addEventListener("notificationclick", function (e) {
  const urlToOpen = new URL("/", self.location.origin).href;
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      // check if the website is open, and then open / focus it
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.includes(urlToOpen)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  e.waitUntil(promiseChain);
  e.notification.close();
});

var currentCache = {
  offline: "offline-cache_dalal",
};
const offlineUrl = "offline.html";

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function (cache) {
      return cache.addAll(["./sed.png", offlineUrl]);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request.url).catch((error) => {
        // Return the offline page
        return caches.match(offlineUrl);
      })
    );
  } else {
    // Respond with everything else if we can
    event.respondWith(
      caches
        .match(event.request)
        .then(function (response) {
          return response || fetch(event.request);
        })
        .catch((error) => {
          return caches.match("./sed.png");
        })
    );
  }
});
