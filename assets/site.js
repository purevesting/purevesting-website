/* ==========================================================================
   PUREVESTING — SITE SCRIPT
   Save at:  /assets/site.js

   Deliberately small. The site works completely without it: every number,
   every table and every link is in the HTML. This file only adds polish.

   It does seven things:
     0. The menu — marks the menu word for the page you are on.
     1. Fades sections in as you scroll to them; their cards rise one
        after another.
     1b. Fills charts in — bars grow and squares light up — as they scroll
        into view.
     2. Tappable figures — tap a number to see its source and date.
     3. Count-up — marked numbers count up once, if they scroll into view.
     4. The app — switches on /sw.js, which lets the site install like an
        app and keeps opened pages for reading offline.
     5. The offline note — says so when a page is a saved copy.
     6. Links into a closed part — opens it (a "See all" list, a Read
        more), so a link like /screener/#list lands on something open.

   All the movement is light and quick, and none of it happens when the
   reader's phone asks for less motion (README.md, "The look").
   ========================================================================== */

var pvCalm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* 0. THE MENU ==============================================================
   The header is identical on every page, so the page itself can't say
   which menu word is "here". This finds the word whose page, or one of
   whose drop-down pages, is the page you are on, and marks it.
   ========================================================================== */

(function () {

  var here = location.pathname.replace(/index\.html$/, '');
  if (here === '/') return;
  var items = document.querySelectorAll('.site-nav .nav-item');
  for (var i = 0; i < items.length; i++) {
    var links = items[i].querySelectorAll('a[href]');
    for (var j = 0; j < links.length; j++) {
      if (links[j].getAttribute('href') === here) {
        items[i].classList.add('is-current');
        var top = items[i].querySelector('a');
        if (top && top.getAttribute('href') === here) top.setAttribute('aria-current', 'page');
        return;
      }
    }
  }

})();


/* 1. FADE-IN ===============================================================
   Every element marked <section class="section reveal"> fades and rises
   into place the first time it scrolls into view, and the cards, tiles and
   bars inside it rise one after another: each gets its place in the queue
   as --i, which the CSS turns into a short delay.
   ========================================================================== */

(function () {

  var items = document.querySelectorAll('.reveal');
  if (items.length === 0) return;

  // If the reader has asked their phone to reduce motion, do nothing at all.
  if (pvCalm) return;

  // Some older in-app browsers do not have IntersectionObserver. If so, show
  // everything immediately rather than leaving it invisible.
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add('is-visible');
    }
    return;
  }

  // Number the cards in each group, so they rise in turn (at most 8 steps,
  // so a long list never keeps anyone waiting).
  items.forEach(function (section) {
    section.querySelectorAll('.card, .tile, .bar-row, .step').forEach(function (el) {
      var key = el.parentNode;
      var n = (key.pvCount = (key.pvCount || 0) + 1) - 1;
      el.style.setProperty('--i', Math.min(n, 8));
    });
  });

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


/* 1b. CHARTS FILL IN =======================================================
   Bar charts (<div class="bars">) and the grid of squares
   (<div class="screen-grid">) start empty and fill in when they scroll
   into view: bars grow from the left, squares light up in a sweep from the
   top-left corner. A chart already on screen when the page opens fills in
   at once, without waiting. Without JavaScript, or with less motion asked
   for, they are simply full.
   ========================================================================== */

(function () {

  var charts = document.querySelectorAll('.bars, .screen-grid');
  if (!charts.length || pvCalm || !('IntersectionObserver' in window)) return;

  // Each square's moment in the sweep: squares on the same diagonal light
  // up together, the whole sweep taking about 0.9 seconds.
  function plan(grid) {
    var squares = grid.querySelectorAll('i');
    var across = getComputedStyle(grid).gridTemplateColumns.split(' ').length || 25;
    var down = Math.ceil(squares.length / across);
    var step = 900 / (across + down);
    for (var k = 0; k < squares.length; k++) {
      var d = Math.round(((k % across) + Math.floor(k / across)) * step);
      squares[k].style.setProperty('--d', d + 'ms');
    }
  }

  var watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var chart = entry.target;
      watcher.unobserve(chart);
      if (chart.classList.contains('screen-grid')) plan(chart);
      // two frames: the browser draws the empty chart before it fills
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          chart.classList.remove('pre-fill');
          chart.classList.add('is-filled');
        });
      });
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  charts.forEach(function (chart) {
    var box = chart.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;   // on screen: leave it
    chart.classList.add('pre-fill');
    watcher.observe(chart);
  });

})();


/* 2. TAPPABLE FIGURES ======================================================
   Every figure on the site — a number in a table (<td class="num">) or in
   the text (<span class="num">) — already has its source and date written
   in a source note near it. With JavaScript on, tapping the figure opens
   that source right there: under the line, or under the table row. Tap
   again to close it. With JavaScript off nothing changes: the figure is
   plain text, and the source note is where it always was.

   WHICH NOTE BELONGS TO WHICH FIGURE — since 6 Nov 2026 the sources sit
   in one closed "Sources" part at the bottom of each page, one line per
   source, each with an id (README.md). Point a figure at its line with
   data-src — on the figure itself, its column's <th>, its whole <table>,
   or any element around it (a paragraph, a list, a section):
     data-src="some-id"  use the element with id="some-id"
     data-src="none"     not a sourced figure (a calculator's answer, say),
                         so it stays plain text
   The nearest one wins: the figure's own, then its cell's, its column's,
   its table's, then the closest element around it. A figure with no
   data-src still takes a source note right after its table or paragraph,
   in the same part of the page, if there is one. A note with no link and
   no date in it isn't a source, so a figure that would get one of those
   stays plain text too.
   ========================================================================== */

(function () {

  var count = 0;   // numbers each panel, so a button can point at its own

  // Figures in these places are left alone: inside a link or a button,
  // in a heading cell, or inside a source note or a panel already open.
  var SKIP = 'a, button, summary, label, th, .source-note, .fig-pop, .cell-note, .share-row';

  // id, "none", or null — the data-src that applies to this figure.
  function chosenSource(fig) {
    var cell = fig.closest('td');
    var table = fig.closest('table');
    var id = fig.getAttribute('data-src') || (cell && cell.getAttribute('data-src'));
    if (!id && cell && table && table.tHead) {
      var th = table.tHead.rows[0].cells[cell.cellIndex];
      id = th && th.getAttribute('data-src');
    }
    if (!id && table) id = table.getAttribute('data-src');
    if (!id) {                     // a paragraph, list or section around it
      var around = fig.closest('[data-src]');
      if (around) id = around.getAttribute('data-src');
    }
    return id;
  }

  function isSource(el) {
    return !!el && !!el.querySelector('a[href], time');
  }

  function isHeading(el) {
    return /^H[1-6]$/.test(el.tagName);
  }

  // The first source note after the figure's block, or failing that the
  // nearest one before it — never reaching past a heading either way.
  function nearestNote(fig) {
    var block = fig.closest('.table-scroll') || fig;
    while (block.parentElement && !block.parentElement.classList.contains('wrap')) {
      block = block.parentElement;
    }
    var el;
    for (el = block.nextElementSibling; el && !isHeading(el); el = el.nextElementSibling) {
      if (el.classList.contains('source-note') && isSource(el)) return el;
    }
    for (el = block.previousElementSibling; el && !isHeading(el); el = el.previousElementSibling) {
      if (el.classList.contains('source-note') && isSource(el)) return el;
    }
    return null;
  }

  // The source element for a figure, or null if it has none.
  function sourceFor(fig) {
    var id = chosenSource(fig);
    if (id === 'none') return null;
    var el = id ? document.getElementById(id) : nearestNote(fig);
    return isSource(el) ? el : null;
  }

  // A copy of the source for the panel. A whole note is cut to start at
  // the word "Source" or "Sources", so the panel opens on the source
  // itself rather than on the explanation before it.
  function panelContent(src) {
    var copy = src.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    copy.querySelectorAll('.fig-pop').forEach(function (el) { el.remove(); });
    copy.querySelectorAll('button.fig').forEach(function (b) {
      b.parentNode.replaceChild(document.createTextNode(b.textContent), b);
    });
    if (src.classList.contains('source-note')) startAtSource(copy);
    var bits = document.createDocumentFragment();
    while (copy.firstChild) bits.appendChild(copy.firstChild);
    return bits;
  }

  function startAtSource(copy) {
    var walk = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walk.nextNode())) {
      var at = node.nodeValue.search(/\bSources?\b/);
      if (at < 0) continue;
      node.nodeValue = node.nodeValue.slice(at);
      for (var n = node; n !== copy; n = n.parentNode) {
        while (n.previousSibling) n.parentNode.removeChild(n.previousSibling);
      }
      return;
    }
  }

  function makePanel(src) {
    var pop = document.createElement('span');
    pop.className = 'fig-pop';
    pop.id = 'fig-pop-' + (++count);
    pop.setAttribute('role', 'note');
    pop.appendChild(panelContent(src));
    return pop;
  }

  function setOpen(btn, pop) {
    btn.setAttribute('aria-expanded', pop ? 'true' : 'false');
    if (pop) btn.setAttribute('aria-controls', pop.id);
    else btn.removeAttribute('aria-controls');
  }

  // A figure inside a table opens a full-width row under its own row, so
  // the source isn't squeezed into one narrow cell. One panel per row:
  // tapping another figure in the same row swaps it.
  function toggleInTable(btn, fig, row) {
    var next = row.nextElementSibling;
    var open = next && next.classList.contains('fig-row') ? next : null;
    var same = open && open.pvButton === btn;
    if (open) {
      setOpen(open.pvButton, null);
      open.remove();
    }
    if (same) return;
    var src = sourceFor(fig);
    if (!src) return;
    var tr = document.createElement('tr');
    tr.className = 'fig-row';
    var td = document.createElement('td');
    var table = row.closest('table');
    td.colSpan = (table.tHead || table).rows[0].cells.length;
    var pop = makePanel(src);
    td.appendChild(pop);
    tr.appendChild(td);
    row.parentNode.insertBefore(tr, row.nextSibling);
    tr.pvButton = btn;
    setOpen(btn, pop);
  }

  // A figure in the text opens its panel at the end of its paragraph (or
  // list item), so the sentence it sits in is never split in two. In a
  // small chart or a row of facts (marked class="fig-host": the fund
  // cards), it opens under the whole thing instead of inside one narrow
  // box. One panel per paragraph: tapping another figure in it swaps.
  function toggleInText(btn, fig) {
    var block = fig.closest('p, li, .fig-host') || fig.parentNode;
    var last = block.lastElementChild;
    var open = last && last.classList.contains('fig-pop') ? last : null;
    var same = open && open.pvButton === btn;
    if (open) {
      setOpen(open.pvButton, null);
      open.remove();
    }
    if (same) return;
    var src = sourceFor(fig);
    if (!src) return;
    var pop = makePanel(src);
    block.appendChild(pop);
    pop.pvButton = btn;
    setOpen(btn, pop);
  }

  // One listener for the whole page, so it keeps working when a script
  // swaps in new HTML (the home page's grid switch does).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('button.fig') : null;
    if (!btn) return;
    var fig = btn.parentNode;
    var row = fig.closest('tr');
    if (row) toggleInTable(btn, fig, row);
    else toggleInText(btn, fig);
  });

  // Turns each figure's text into a button. Safe to run again on new HTML:
  // a figure that already has its button is skipped.
  function enhance(root) {
    (root || document).querySelectorAll('td.num, .num').forEach(function (fig) {
      if (fig.querySelector('button.fig')) return;
      if (fig.closest(SKIP)) return;
      if (!fig.matches('td') && fig.closest('td.num')) return;  // the cell is the figure
      if (!sourceFor(fig)) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fig';
      btn.setAttribute('aria-expanded', 'false');
      while (fig.firstChild) btn.appendChild(fig.firstChild);
      fig.appendChild(btn);
    });
  }

  enhance(document);
  window.pvFigures = enhance;   // for page scripts that swap in new HTML

})();


/* 3. COUNT-UP ==============================================================
   A number marked data-count — <span class="num" data-count>204</span> —
   counts up from zero once, when it scrolls into view. Whole numbers and
   decimals both work ("40.7%" counts up with one decimal), and whatever
   sits around the number ("₹", "%") stays put.

   It never runs on a number that is already on screen when the page
   opens: text a reader can see never waits on an animation. Its box keeps
   the final number's width the whole time, so nothing around it moves.
   ========================================================================== */

(function () {

  var items = document.querySelectorAll('[data-count]');
  if (items.length === 0) return;
  if (pvCalm) return;
  if (!('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

  var DURATION = 900;   // milliseconds

  function run(el) {
    var node = el;                                 // the text itself, even
    while (node.firstChild) node = node.firstChild; // inside a figure button
    if (node.nodeType !== 3) return;
    var finalText = node.nodeValue;
    var m = finalText.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var digits = m[2].replace(/,/g, '');
    var target = parseFloat(digits);
    if (!(target > 0)) return;
    var places = digits.indexOf('.') < 0 ? 0 : digits.length - digits.indexOf('.') - 1;
    var commas = m[2].indexOf(',') >= 0;
    function show(v) {
      var s = v.toFixed(places);
      if (commas) s = Number(s).toLocaleString('en-IN', { minimumFractionDigits: places, maximumFractionDigits: places });
      return m[1] + s + m[3];
    }

    // A number in a line of text keeps its final width while it counts, so
    // the words after it don't move. A number on a line of its own needs
    // nothing: nothing sits beside it.
    var inLine = getComputedStyle(el).display !== 'block';
    if (inLine) {
      el.style.display = 'inline-block';
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      el.style.textAlign = 'right';
    }

    var start = null;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DURATION);
      var eased = 1 - Math.pow(1 - t, 3);          // fast, then settling
      node.nodeValue = t < 1 ? show(target * eased) : finalText;
      if (t < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.style.display = el.style.minWidth = el.style.textAlign = '';
      }
    }
    window.requestAnimationFrame(step);
  }

  items.forEach(function (el) {
    var first = true;
    var watcher = new IntersectionObserver(function (entries) {
      var visible = entries[entries.length - 1].isIntersecting;
      if (first) {
        first = false;
        if (visible) watcher.disconnect();   // on screen at load: leave it
        return;
      }
      if (visible) {
        watcher.disconnect();
        run(el);
      }
    });
    watcher.observe(el);
  });

})();


/* 4. THE APP ===============================================================
   Switches on the service worker (/sw.js — its own comments explain it).
   It waits until the page has fully loaded, so it never slows the first
   view. Opening a page as a file on your computer (no web address) skips
   it, because browsers only allow service workers on a real website.
   ========================================================================== */

(function () {

  if (!('serviceWorker' in navigator)) return;
  var local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (location.protocol !== 'https:' && !local) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // If it can't start, the site simply works as a normal website.
    });
  });

})();


/* 5. THE OFFLINE NOTE ======================================================
   With no internet, the app shows the copy of a page saved on the phone.
   A saved copy can be older than the live page, so a small note says so,
   pinned to the bottom of the screen (it never pushes the page around).
   It goes away by itself when the internet comes back, or with Close.
   ========================================================================== */

(function () {

  if (!('onLine' in navigator)) return;
  if (document.getElementById('offline-page')) return;   // says it already

  var note = null;

  function show() {
    if (note) return;
    note = document.createElement('div');
    note.className = 'offline-note';
    note.setAttribute('role', 'status');
    note.innerHTML =
      '<p><strong>You\'re offline.</strong> This is the copy of this page saved ' +
      'on your phone, so figures may have changed since — each one shows ' +
      'its \u201cas of\u201d date.</p>' +
      '<button type="button" class="offline-close">Close</button>';
    note.querySelector('button').addEventListener('click', hide);
    document.body.appendChild(note);
  }

  function hide() {
    if (!note) return;
    note.remove();
    note = null;
  }

  if (!navigator.onLine) show();
  window.addEventListener('offline', show);
  window.addEventListener('online', hide);

})();


/* 6. LINKS INTO A CLOSED PART ==============================================
   Long lists and "Read more" parts are closed <details> (README.md). When
   a link points at something inside one — /screener/#list, say — this
   opens it, and every closed part around it, then shows it. Without
   JavaScript the part stays closed and opens with a tap, as always.
   ========================================================================== */

(function () {

  function openTo() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    var opened = false;
    for (var p = el; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS' && !p.open) { p.open = true; opened = true; }
    }
    if (opened) el.scrollIntoView();
  }

  openTo();
  window.addEventListener('hashchange', openTo);

})();
