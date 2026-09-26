/* يتيح تثبيت التطبيق على الهاتف وفتحه بدون إنترنت. */
const CACHE = 'gestion-scolaire-v1';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// الشبكة أولًا للحصول على آخر نسخة، والذاكرة المؤقتة عند انقطاع الإنترنت.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // لا نتدخل في اتصالات Firebase (المزامنة والمصادقة)
  if (/googleapis\.com$|firebaseio\.com$/.test(url.hostname) && !url.hostname.startsWith('fonts.')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && (url.origin === self.location.origin || /gstatic\.com$|fonts\.googleapis\.com$/.test(url.hostname))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
