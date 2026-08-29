import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [{
    name: 'service-worker-upgrade-fixture',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0] ?? '/';
        const known = ['/', '/demo', '/app', '/privacy', '/terms', '/art-provenance'];
        if (!known.includes(path) && !path.includes('.')) response.statusCode = 404;
        next();
      });
      server.middlewares.use('/test/sw-driver.html', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><title>Service worker test</title>');
      });
      server.middlewares.use('/test/legacy-sw.js', (_request, response) => {
        response.setHeader('Content-Type', 'text/javascript');
        response.setHeader('Service-Worker-Allowed', '/');
        response.end(`const CACHE='ccf-shell-v0.1.1';self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.put('/',new Response('<h1>stale shell</h1>',{headers:{'content-type':'text/html'}}))).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));`);
      });
    }
  }],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
  build: {
    outDir: 'dist/site',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    rollupOptions: { output: { assetFileNames: 'assets/[name]-[hash][extname]' } }
  }
});
