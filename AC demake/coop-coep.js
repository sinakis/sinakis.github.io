const COOP_COEP_VERSION = '1.0.0';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./coop-coep.js').then((registration) => {
        if (registration.active && !navigator.serviceWorker.controller) {
            window.location.reload();
        }
    });

    navigator.serviceWorker.addEventListener('install', () => {
        self.skipWaiting();
    });

    navigator.serviceWorker.addEventListener('activate', (event) => {
        event.waitUntil(self.clients.claim());
    });

    self.addEventListener('fetch', (event) => {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) return response;

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
                    newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
}
