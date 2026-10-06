/* ==========================================================================
   PUREVESTING — SERVICE WORKER
   Save at:  /sw.js   (it must sit at the top of the site, not in /assets/,
   because a service worker can only look after pages at or below its own
   folder)

   WHAT THIS IS
   A small script the browser keeps running in the background once someone
   has visited the site. It is what lets the site install like an app
   (/app/), and it keeps a copy of pages a reader has opened so they still
   open without internet.

   HOW IT DECIDES WHAT TO SHOW
   - Pages: always fetched fresh from the internet first, so readers never
     see an old figure while they are online. The saved copy is used only
     when there is no internet, or when the internet takes more than 4
     seconds to answer. A page that was never saved shows /offline/.
   - The stylesheet and scripts: fresh first too, saved copy when offline,
     so they always match the page.
   - Fonts and images: the saved copy at once (they almost never change),
     and a fresh copy is fetched quietly in the background for next time.
   - Anything on another website (YouTube thumbnails, Beehiiv, the form
     service, Cloudflare's visitor counting) is left completely alone.

   WHEN TO EDIT THIS FILE
   Almost never: new pages are saved automatically as people open them.
   Only if you change the PRECACHE list below, raise VERSION by one (v1 to
   v2), so phones that already have the app replace their saved copies.
   ========================================================================== */

var VERSION = 'v1';
var STATIC = 'pv-static-' + VERSION;   // the stylesheet, scripts, fonts, images
var PAGES  = 'pv-pages-' + VERSION;    // pages, saved as people open them
var OFFLINE_URL = '/offline/';

// Saved the moment the app is installed (or the site is first visited), so
// the home page and the "you're offline" page open even with no internet.
var PRECACHE = [
  '/',
  OFFLINE_URL,
  '/assets/site.css',
  '/assets/site.js',
  '/assets/share-card.js',
  '/assets/fonts/bricolage-grotesque-latin-wght.woff2',
  '/assets/fonts/plus-jakarta-sans-latin-wght.woff2',
  '/assets/fonts/dm-mono-latin-400.woff2',
  '/assets/img/logo.svg',
  '/assets/img/byline-96.webp'
];


/* 1. INSTALL — save the list above ======================================= */

self.addEventListener('install', function (event) {
  event.waitUntil(
    // The two pages go in the pages store, everything else in static.
    Promise.all(PRECACHE.map(function (url) {
      var store = (url === '/' || url === OFFLINE_URL) ? PAGES : STATIC;
      return fetch(url, { cache: 'no-cache' }).then(function (response) {
        return save(store, url, response);
      });
    })).then(function () {
      return self.skipWaiting();   // start working straight away
    })
  );
});


/* 2. ACTIVATE — throw away copies saved by an older version ============== */

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) {
        var ours = name.indexOf('pv-') === 0;
        if (ours && name !== STATIC && name !== PAGES) return caches.delete(name);
      }));
    }).then(function () {
      return self.clients.claim();  // look after pages that are already open
    })
  );
});


/* 3. FETCH — every request the site makes passes through here ============ */

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;                 // forms: leave alone

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;      // other websites
  // Cloudflare's own addresses are left alone, except its small scripts
  // (such as the one that shows email addresses), so they work offline.
  if (url.pathname.indexOf('/cdn-cgi/') === 0 && request.destination !== 'script') return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(page(event));
    return;
  }

  var kind = request.destination;
  if (kind === 'style' || kind === 'script') {
    event.respondWith(freshFirst(request));
  } else if (kind === 'font' || kind === 'image') {
    event.respondWith(savedFirst(event));
  }
  // Anything else (the sitemap, the manifest…) goes to the internet as
  // normal, untouched.
});


/* 4. THE THREE WAYS OF ANSWERING ========================================= */

// Only clean, complete answers from this site are worth saving. A redirect
// (for example /about to /about/) is passed on but never saved.
function isSaveable(response) {
  return response && response.ok && response.type === 'basic' && !response.redirected;
}

function save(store, request, response) {
  if (!isSaveable(response)) return Promise.resolve();
  var copy = response.clone();
  return caches.open(store).then(function (cache) { return cache.put(request, copy); });
}

// Pages: the internet first. If it fails, or is slower than 4 seconds and a
// saved copy exists, the saved copy; if there is no saved copy, /offline/.
function page(event) {
  var request = event.request;
  var fromNetwork = fetch(request).then(function (response) {
    event.waitUntil(save(PAGES, request, response));
    return response;
  });
  var saved = caches.match(request, { ignoreSearch: true, ignoreVary: true });

  var tooSlow = new Promise(function (resolve) {
    setTimeout(function () {
      saved.then(function (copy) { if (copy) resolve(copy); });
    }, 4000);
  });

  event.waitUntil(fromNetwork.catch(function () {}));   // let it finish saving

  return Promise.race([fromNetwork, tooSlow]).catch(function () {
    return saved.then(function (copy) {
      return copy || caches.match(OFFLINE_URL);
    });
  });
}

// The stylesheet and scripts: the internet first, the saved copy offline.
function freshFirst(request) {
  return fetch(request).then(function (response) {
    save(STATIC, request, response);
    return response;
  }).catch(function () {
    return caches.match(request, { ignoreVary: true }).then(function (copy) {
      return copy || Response.error();
    });
  });
}

// Fonts and images: the saved copy at once, refreshed in the background.
function savedFirst(event) {
  var request = event.request;
  var fromNetwork = fetch(request).then(function (response) {
    event.waitUntil(save(STATIC, request, response));
    return response;
  });
  event.waitUntil(fromNetwork.catch(function () {}));
  return caches.match(request, { ignoreVary: true }).then(function (copy) {
    return copy || fromNetwork;
  });
}
