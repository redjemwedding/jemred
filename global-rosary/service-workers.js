self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("rosary-cache").then(cache=>{
      return cache.addAll([
        "./",
        "./index.html",
        "./portal.html",
        "./room.html"
      ]);
    })
  );
});
