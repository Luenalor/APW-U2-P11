

//caches names
const STATIC_CACHE_NAME = 'stanic-cache-v1.2';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1';

self.addEventListener("install", (e) => {

});

self.addEventListener("activate", (e) => {
     const promDelete = caches.keys().then((items) => {
        items.forEach((element) => {
            if (element !== STATIC_CACHE_NAME && items.includes('static')) {
               return caches.delete(element);
            }
        });
    })
    event.waitUntil(promtDelete);
});


self.addEventListener("install", (event) => {
  console.log("SW: Instalado");
  const respCache = caches.open("static-cache-v1").then((cache) => {
    return cache.addAll([
      "./",
      "./index.html",
      "./manifest.json",
      "./pages/offline.html",
      "./images/generic.png",
      "./images/icons/android-launchericon-144-144.png",
    ]);
  });

  const respCacheInmutables = caches
    .open("cache-inmutable-v1")
    .then((cache) => {
      return cache.addAll([
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/webfonts/fa-solid-900.woff2",
      ]);
    });

  event.waitUntil(Promise.all([respCache, respCacheInmutables]));
});

//clean cache
const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(() => {
          cleanCache(cacheName, limitItems);
        });
      }
    });
  });
};

// self.addEventListener("activate", (event) => {
//   console.log("SW: Activado");
//   const resp = caches.keys().then((keys) => {
//     keys.forEach((key) => {
//       if (key !== "cache-v1" && key.includes("cache")) {
//         return caches.delete(key);
//       }
//     });
//   });
//   event.waitUntil(resp);
// });

self.addEventListener("fetch", (event) => {
  console.log("SW: Fetch");
  const resp = caches
    .match(event.request)
    .then((respCache) => {
      if (respCache) {
        return respCache;
      }
      return fetch(event.request).then((respWeb) => {
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, respWeb);
          cleanCache(DYNAMIC_CACHE_NAME, 10);
        });
        return respWeb.clone();
      });
    })
    .catch((err) => {
      if (event.request.headers.get("accept").includes("text/html")) {
        return caches.match("./pages/offline.html");
      }
      //return img
      if (event.request.headers.get("accept").includes("image/")) {
        return caches.match("./images/generic.png");
      }
    });
  event.respondWith(resp);
});
