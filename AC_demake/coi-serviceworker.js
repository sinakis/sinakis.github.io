/*! coi-serviceworker v0.1.7 | MIT License | https://github.com/gzuidhof/coi-serviceworker */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        if (e.request.mode === "navigate" || (e.request.mode === "no-cors" && e.request.destination === "script")) {
            e.respondWith(fetch(e.request).then((r) => {
                if (r.status === 0) return r;
                const h = new Headers(r.headers);
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
            }).catch((err) => console.error(err)));
        }
    });
} else {
    (() => {
        if (window.crossOriginIsolated !== false) return;
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
        navigator.serviceWorker.register(window.document.currentScript.src).then((reg) => {
            reg.addEventListener("updatefound", () => {
                location.reload();
            });
            if (reg.active) location.reload();
        });
    })();
}
