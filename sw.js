
const staticCacheName = 'a-app-v1';
const dynamicCacheName = 'b-app-v1';

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

self.addEventListener('fetch', e => {
    const {request} = e;

    const url = new URL(request.url);
    if(url.origin === location.origin) {
        e.respondWith(cacheFirst(request))
    } else {
        e.respondWith(networkFirst(request))
    }


})

async function cacheFirst(request) {
    const cached = await caches.match(request);

    return cached || await fetch(request)
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