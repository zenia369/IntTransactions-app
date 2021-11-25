
const staticCacheName = 'a-app-v2';
const dynamicCacheName = 'b-app-v2';

const assetUrls = [
    './src/index.html',
    './src/css/style.css',
    './src/js/auth.js'
]


self.addEventListener('install', async e => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assetUrls);


    console.log('[SW]: install')
})

self.addEventListener('activate', e => {
    console.log('[SW]: activate');
})


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(`${staticCacheName}`).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });

async function cacheFirst(request) {
    const cached = await caches.match(request);
    console.log(caches.match(request));

    return await fetch(request) ?? cached
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone())
        return response
    } catch (error) {
        const cached = await cache.match(request)
        return cached ?? await caches.match('./src/error.html')
    }

}