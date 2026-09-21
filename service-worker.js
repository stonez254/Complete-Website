const CACHE="ederstone-v3";
const PRECACHE=["/","/index.html","/auth.html","/access-loader.html","/session-expired.html","/site-ui.js","/site-ui.css","/language.js"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);

  // Never cache authentication/session API responses. They must always reflect
  // the live server-side cookie and expiry.
  if(url.origin===self.location.origin && url.pathname.startsWith("/api/")){
    event.respondWith(fetch(event.request));
    return;
  }

  // Always try the network first for the app shell and JavaScript/CSS so a
  // deployment cannot be trapped behind an older cached session guard.
  const isAppCode=url.origin===self.location.origin &&
    (url.pathname.endsWith(".js") || url.pathname.endsWith(".css") ||
     url.pathname==="/" || url.pathname.endsWith(".html"));

  if(isAppCode){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          return response;
        })
        .catch(()=>caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached=>cached||fetch(event.request).then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      }).catch(()=>cached))
  );
});
