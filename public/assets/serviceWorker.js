console.log("Hello world from service worker");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Received...", data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "",
  });
});
