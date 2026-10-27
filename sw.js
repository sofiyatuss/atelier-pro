/* The Atelier service worker. Generated at build time from src/sw-template.js. */
const VERSION = 'c4b2aff6b1c8';
const CACHE = `atelier-${VERSION}`;
const PRECACHE = ["./","assets/KaTeX_AMS-Regular-U6PRYMIZ.woff2","assets/KaTeX_Caligraphic-Bold-5QL5CMTE.woff2","assets/KaTeX_Caligraphic-Regular-KX5MEWCF.woff2","assets/KaTeX_Fraktur-Bold-2QVFK6NQ.woff2","assets/KaTeX_Fraktur-Regular-2PEIFJSJ.woff2","assets/KaTeX_Main-Bold-YP5VVQRP.woff2","assets/KaTeX_Main-BoldItalic-N4V3DX7S.woff2","assets/KaTeX_Main-Italic-RELBIK7M.woff2","assets/KaTeX_Main-Regular-ARRPAO67.woff2","assets/KaTeX_Math-BoldItalic-K4WTGH3J.woff2","assets/KaTeX_Math-Italic-6KGCHLFN.woff2","assets/KaTeX_SansSerif-Bold-RRNVJFFW.woff2","assets/KaTeX_SansSerif-Italic-HMPFTM52.woff2","assets/KaTeX_SansSerif-Regular-XIQ62X4E.woff2","assets/KaTeX_Script-Regular-APUWIHLP.woff2","assets/KaTeX_Size1-Regular-5LRUTBFT.woff2","assets/KaTeX_Size2-Regular-LELKET5D.woff2","assets/KaTeX_Size3-Regular-WQRQ47UD.woff2","assets/KaTeX_Size4-Regular-CDMV7U5C.woff2","assets/KaTeX_Typewriter-Regular-VBYJ4NRC.woff2","assets/app.css","assets/app.js","assets/chunk-26TUOH33.js","assets/chunk-2Y47EB6D.js","assets/chunk-2YBSTVZU.js","assets/chunk-5TB3T4LI.js","assets/chunk-6P4OPWEJ.js","assets/chunk-6SNQRRET.js","assets/chunk-6WUKRXEL.js","assets/chunk-B3J2EJRO.js","assets/chunk-CD5HOIO4.js","assets/chunk-CSUNOUOJ.js","assets/chunk-DZG2CLJF.js","assets/chunk-FUKNVF7A.js","assets/chunk-GDM4GFG2.js","assets/chunk-HKEUAGWS.js","assets/chunk-IULSCP54.js","assets/chunk-JUFH6BX7.js","assets/chunk-LXFFIZCM.js","assets/chunk-MDMBS7LS.js","assets/chunk-NHDBCJ4D.js","assets/chunk-O5OOWLJE.js","assets/chunk-P6IUROPA.js","assets/chunk-PZ56NZ46.js","assets/chunk-QUMPJ47O.js","assets/chunk-RB2SQR5H.js","assets/chunk-RBYHX6JY.js","assets/chunk-SAGSQFBC.js","assets/chunk-T7AHGDXQ.js","assets/chunk-V6W27EIG.js","assets/chunk-XM5RQRJL.js","assets/pdf.worker.min.mjs","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","icons/maskable-512.png","index.html","manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('atelier-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never cache third-party API traffic (PubMed, OpenAlex, Crossref, your AI endpoint).
  if (url.origin !== self.location.origin) return;

  // Discovery digests are produced by the scheduled GitHub Action: always try the network first.
  if (url.pathname.endsWith('/discoveries.json')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./', { ignoreSearch: true })));
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url ? event.notification.data.url : './';
  event.waitUntil(self.clients.matchAll({ type: 'window' }).then((wins) => {
    for (const w of wins) { if ('focus' in w) { w.navigate(target); return w.focus(); } }
    return self.clients.openWindow(target);
  }));
});
