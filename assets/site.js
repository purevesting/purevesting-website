/* ==========================================================================
   PUREVESTING — SITE SCRIPT
   Save at:  /assets/site.js

   Deliberately tiny. The site works completely without it: every number,
   every table and every link is in the HTML. This file only adds polish.

   Right now it does one thing: fades sections in as you scroll to them.
   ========================================================================== */

(function () {

  // Find every element marked <section class="section reveal">.
  var items = document.querySelectorAll('.reveal');
  if (items.length === 0) return;

  // If the reader has asked their phone to reduce motion, do nothing at all.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Some older in-app browsers do not have IntersectionObserver. If so, show
  // everything immediately rather than leaving it invisible.
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add('is-visible');
    }
    return;
  }

  // IntersectionObserver tells us when an element scrolls into view.
  var watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');   // triggers the CSS fade
        watcher.unobserve(entry.target);            // only ever happens once
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  items.forEach(function (item) { watcher.observe(item); });

})();