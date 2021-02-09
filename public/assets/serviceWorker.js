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
