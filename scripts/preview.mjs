import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist/site');
const appRoutes = new Set(['/', '/demo', '/app', '/privacy', '/terms', '/art-provenance']);
const types = {'.css':'text/css', '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.xml':'application/xml', '.txt':'text/plain', '.sh':'text/plain', '.ps1':'text/plain'};
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.github.com https://api.sociobot.in; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.sociobot.in; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  if (pathname === '/test/sw-driver.html') {
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end('<!doctype html><title>Service worker test</title>'); return;
  }
  if (pathname === '/test/legacy-sw.js') {
    response.writeHead(200, {'Content-Type':'text/javascript; charset=utf-8', 'Service-Worker-Allowed':'/'});
    response.end(`const CACHE='ccf-shell-v0.1.1';self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.put('/',new Response('<h1>stale shell</h1>',{headers:{'content-type':'text/html'}}))).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));`); return;
  }
  let status = 200;
  let relative = pathname.slice(1);
  if (appRoutes.has(pathname)) relative = 'index.html';
  else if (!extname(pathname)) { relative = '404.html'; status = 404; }
  const file = normalize(join(root, relative));
  if (!file.startsWith(root)) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const body = await readFile(file);
    response.writeHead(status, {'Content-Type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`, ...securityHeaders});
    response.end(body);
  } catch {
    try { response.writeHead(404, {'Content-Type':'text/html; charset=utf-8', ...securityHeaders}); response.end(await readFile(join(root, '404.html'))); }
    catch { response.writeHead(404); response.end('Not found'); }
  }
}).listen(4173, '127.0.0.1');
