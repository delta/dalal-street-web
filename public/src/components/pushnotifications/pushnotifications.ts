const localHostTester = /^localhost$|^(0.0.0.0)$|^(?:0*\:)*?:?0*1$/g; // check if react is running in dev environment
const isLocalHost = localHostTester.test(window.location.hostname);
let pushServerPublicKey = "";

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
  // console.log(window.Notification.permission)
  return await window.Notification.requestPermission();
}

/**
 * Checks if the server is running development (localhost / ipv4 / ipv6 env)
 */
function isDevServer(): boolean {
  return isLocalHost ? true : false;
}

/**
 * Sets the Public VAPID key info, acquired from the user
 * @param publicKey VAPID Public key received from the server
 */
function setVAPIDPublicKey(publicKey: string) {
  pushServerPublicKey = publicKey;
  return;
}

/**
 * Registers a service worker for push notification, after checking for development environment
 */
function register(config: any): Promise<ServiceWorkerRegistration | null> {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV == "production" && "serviceWorker" in navigator) {
      // the browser supports SWs (Service Workers)
      // URL web-api is present is present in every browser which supports SWs
      const publicUrl = new URL(
        process.env.ASSET_PATH as string,
        window.location.href
      );

      if (publicUrl.origin !== window.location.origin) {
        // SWs wont work if the ASSET_PATH is on a different origin from what are page is served on.
        // Might be issue a production !!!, adding this to make life easier later on
        console.error(
          "Public url and website url are different. ",
          "They need to be same for service-worker to work",
          "\nPublic url : ",
          publicUrl.origin,
          "\nWebsite url : ",
          window.location.origin
        );
        resolve(null);
      }
    }

    // the url of the service worker, to fetch it
    const swUrl = `${process.env.ASSET_PATH}/serviceWorker.js`;
    let serviceWorker: ServiceWorkerRegistration | null = null;
    try {
      if (isLocalHost) {
        // react is running in dev environment, check if the service worker exists or not
        serviceWorker = await checkValidServiceWorkerAndRegister(swUrl, config);

        // add some additional logging to localHost
        navigator.serviceWorker.ready.then(() => {
          console.log("Service worker is up and running");
          console.log("~~~Additional Loggers~~~");
        });
      } else {
        // not localhost, just register the service worker
        serviceWorker = await checkValidServiceWorkerAndRegister(swUrl, config);
      }
      resolve(serviceWorker);
    } catch (err) {
      console.error("error while registering service worker, ", err);
      reject(err);
    }
  });
}
/**
 * ensuring that we are fetching the correct service worker
 * if not it may cause security issues
 * doing this to ensure, it works after doing react build.
 */
async function checkValidServiceWorkerAndRegister(
  swUrl: string,
  config: any
): Promise<ServiceWorkerRegistration | null> {
  // Check if the service worker can be found, if not send error ( some error in the swUrl)
  return fetch(swUrl)
    .then(async (response) => {
      // Ensure the service worker actually exists and that, we are really getting a JS file
      const contentType = response.headers.get("content-type");

      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Service worker not found
        // unregister it (if you are using a diff app)
        // Send error
        navigator.serviceWorker.ready.then((registration) =>
          registration.unregister().then(() => {
            console.error("service worker not found at, ", swUrl);
            return null;
          })
        );
      } else {
        // Service worker was found, register it.
        return await registerServiceWorker(swUrl, config);
      }
      return null;
    })
    .catch((err) => {
      // probably network error
      console.error("something went wrong, ", err);
      return null;
    });
}

function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

/**
 * returns a promise which resolves after the service worker is registered
 */
function registerServiceWorker(
  swUrl: string,
  config: any
): Promise<ServiceWorkerRegistration> {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker
      .register(swUrl, config)
      .then((reg) => {
        isLocalHost && console.log("Registration", reg);
        resolve(reg);
      })
      .catch((err) => {
        console.error("unable to register service worker, ", err);
        reject("Unable to register service worker");
      });
  });
}

/**
 * using the registered service worker creates a push notification subscription and
 * returns the push notif object
 */
async function createNotificationSubscription() {
  isLocalHost && console.log("creating notification subscription");
  const serviceWorker = await navigator.serviceWorker.ready;
  isLocalHost && console.log("service worker : ", serviceWorker);
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(pushServerPublicKey),
  });
}

/**
 * returns the subscription if present or nothing
 * this can be used to get a subscription if present
 */
async function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function (pushSubscription) {
      return pushSubscription;
    })
    .catch((err) => {
      console.log("Couldn't fetch the subscription, ", err);
      return null;
    });
}

/**
 * changes content encoding from urlbase64 to unit8, and returns an array
 * @param base64String ...
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export {
  register,
  askUserPermission,
  getUserSubscription,
  isDevServer,
  createNotificationSubscription,
  setVAPIDPublicKey,
};
