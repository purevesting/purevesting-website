/* ==========================================================================
   PUREVESTING — THE SITE'S SCRIPT
   Save at:  /assets/site.js   (every page loads it, at the bottom)

   The site works completely without it: every number, every table and
   every link is in the HTML. This file only adds polish, in seven parts:

     0. The menu — marks the menu word for the page you are on.
     1. Rising cards — sections fade in as you scroll to them, and their
        cards rise one after another.
     2. Charts fill in — bars grow and squares light up as they scroll
        into view.
     3. Tap a figure — tap a number to see its source and date.
     4. Counting up — marked numbers count up once, if they scroll into
        view.
     5. The app — switches on /sw.js, which lets the site install like an
        app and keeps opened pages for reading offline.
     6. The offline note — says so when a page is a saved copy.
     7. Links into a closed part — opens it (a "See all" list, a Read
        more), so a link like /screener/#list lands on something open.

   All the movement is light and quick, and none of it happens when the
   reader's phone asks for less motion (README.md, "The look").
   ========================================================================== */

// True when the reader's phone or computer asks for less motion. Parts 1,
// 2 and 4 then do nothing, and everything simply shows at once.
var lessMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* 0. THE MENU ==============================================================
   Shows on: the header of every page.
   The header is identical on every page, so the page itself can't say
   which menu word is "here". This finds the word whose page, or one of
   whose drop-down pages, is the page you are on, and marks it (a short
   blue bar under it, from site.css section 7).
   ========================================================================== */

(function () {

  var here = location.pathname.replace(/index\.html$/, '');
  if (here === '/') return;
  var menuWords = document.querySelectorAll('.site-nav .nav-item');
  for (var i = 0; i < menuWords.length; i++) {
    var links = menuWords[i].querySelectorAll('a[href]');
    for (var j = 0; j < links.length; j++) {
      if (links[j].getAttribute('href') === here) {
        menuWords[i].classList.add('is-current');
        var mainLink = menuWords[i].querySelector('a');
        if (mainLink && mainLink.getAttribute('href') === here) mainLink.setAttribute('aria-current', 'page');
        return;
      }
    }
  }

})();


/* 1. RISING CARDS ==========================================================
   Shows on: every section marked <section class="section reveal">.
   The section fades and rises into place the first time it scrolls into
   view, and the cards, tiles, bars and steps inside it rise one after
   another: each gets its place in the queue as --i, which site.css
   (section 14) turns into a short delay.
   ========================================================================== */

(function () {

  var sections = document.querySelectorAll('.reveal');
  if (sections.length === 0) return;
  if (lessMotion) return;

  // Some older in-app browsers can't tell when something scrolls into
  // view. Then show everything at once rather than leave it invisible.
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < sections.length; i++) sections[i].classList.add('is-visible');
    return;
  }

  // Number the cards in each group, so they rise in turn (at most 8 steps,
  // so a long list never keeps anyone waiting).
  sections.forEach(function (section) {
    section.querySelectorAll('.card, .tile, .bar-row, .step').forEach(function (card) {
      var group = card.parentNode;
      group.cardsSoFar = (group.cardsSoFar || 0) + 1;
      card.style.setProperty('--i', Math.min(group.cardsSoFar - 1, 8));
    });
  });

  // The browser tells us when a section scrolls into view.
  var watcher = new IntersectionObserver(function (seen) {
    seen.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');   // starts the fade in site.css
        watcher.unobserve(entry.target);            // only ever happens once
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  sections.forEach(function (section) { watcher.observe(section); });

})();


/* 2. CHARTS FILL IN ========================================================
   Shows on: every bar chart (<div class="bars">) and the grid of squares
   (<div class="screen-grid">: the home page and /halal-stocks/).
   They start empty and fill in when they scroll into view: bars grow
   from the left, squares light up in a sweep from the top-left corner. A
   chart already on screen when the page opens is left full, without
   waiting. Without JavaScript, or with less motion asked for, they are
   simply full.
   ========================================================================== */

(function () {

  var charts = document.querySelectorAll('.bars, .screen-grid');
  if (!charts.length || lessMotion || !('IntersectionObserver' in window)) return;

  // Each square's moment in the sweep: squares on the same diagonal light
  // up together, the whole sweep taking about 0.9 seconds.
  function planTheSweep(grid) {
    var squares = grid.querySelectorAll('i');
    var across = getComputedStyle(grid).gridTemplateColumns.split(' ').length || 25;
    var down = Math.ceil(squares.length / across);
    var stepTime = 900 / (across + down);
    for (var k = 0; k < squares.length; k++) {
      var column = k % across, row = Math.floor(k / across);
      squares[k].style.setProperty('--d', Math.round((column + row) * stepTime) + 'ms');
    }
  }

  var watcher = new IntersectionObserver(function (seen) {
    seen.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var chart = entry.target;
      watcher.unobserve(chart);
      if (chart.classList.contains('screen-grid')) planTheSweep(chart);
      // Two frames: the browser draws the empty chart before it fills.
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
    if (box.top < window.innerHeight && box.bottom > 0) return;   // on screen: leave it full
    chart.classList.add('pre-fill');
    watcher.observe(chart);
  });

})();


/* 3. TAP A FIGURE TO SEE ITS SOURCE ========================================
   Shows on: every page with sourced figures — the instrument pages, the
   fund cards, the halal stocks and methodology pages…
   Every figure — a number in a table (<td class="num">) or in the text
   (<span class="num">) — has its source and date in the page's closed
   "Sources" part at the bottom. With JavaScript on, the figure becomes a
   button (class "figure-button"): tap it and a small blue panel (class
   "source-panel") opens right there, with that source. Tap again to
   close it. Without JavaScript nothing changes: the figure is plain text.

   WHICH SOURCE BELONGS TO WHICH FIGURE: each line in Sources has an id
   (<li id="src-epf-bands">), and the figure points at it with data-src —
   on the figure itself, its column's <th>, its whole <table>, or anything
   around it (a paragraph, a list, a drawing, a section):
     data-src="src-epf-bands"   use the line with that id
     data-src="none"            not a sourced figure (a calculator's
                                answer, say), so it stays plain text
   The nearest one wins: the figure's own, then its cell's, its column's,
   its table's, then the closest element around it. A figure with no
   data-src at all takes a source note (<p class="source-note">) right
   after its table or paragraph, if there is one. Anything with no link
   and no date in it isn't a source, so its figure stays plain text.
   ========================================================================== */

(function () {

  var panelsMade = 0;   // numbers each panel, so its button can point at it

  // Figures in these places are left alone: inside a link or a button, in
  // a heading cell, or inside a source note or a panel already open.
  var LEAVE_ALONE = 'a, button, summary, label, th, .source-note, .source-panel, .cell-note, .share-row';

  // The data-src that applies to this figure: an id, "none", or nothing.
  function sourceIdFor(figure) {
    var cell = figure.closest('td');
    var table = figure.closest('table');
    var id = figure.getAttribute('data-src') || (cell && cell.getAttribute('data-src'));
    if (!id && cell && table && table.tHead) {
      var columnHeading = table.tHead.rows[0].cells[cell.cellIndex];
      id = columnHeading && columnHeading.getAttribute('data-src');
    }
    if (!id && table) id = table.getAttribute('data-src');
    if (!id) {                     // a paragraph, list or section around it
      var around = figure.closest('[data-src]');
      if (around) id = around.getAttribute('data-src');
    }
    return id;
  }

  function looksLikeASource(el) {
    return !!el && !!el.querySelector('a[href], time');
  }

  function isHeading(el) {
    return /^H[1-6]$/.test(el.tagName);
  }

  // The first source note after the figure's block, or failing that the
  // nearest one before it — never reaching past a heading either way.
  function nearestSourceNote(figure) {
    var block = figure.closest('.table-scroll') || figure;
    while (block.parentElement && !block.parentElement.classList.contains('wrap')) {
      block = block.parentElement;
    }
    var el;
    for (el = block.nextElementSibling; el && !isHeading(el); el = el.nextElementSibling) {
      if (el.classList.contains('source-note') && looksLikeASource(el)) return el;
    }
    for (el = block.previousElementSibling; el && !isHeading(el); el = el.previousElementSibling) {
      if (el.classList.contains('source-note') && looksLikeASource(el)) return el;
    }
    return null;
  }

  // The source for a figure, or null if it has none.
  function sourceFor(figure) {
    var id = sourceIdFor(figure);
    if (id === 'none') return null;
    var source = id ? document.getElementById(id) : nearestSourceNote(figure);
    return looksLikeASource(source) ? source : null;
  }

  // What goes in the panel: a copy of the source. A whole source note is
  // cut to start at the word "Source" or "Sources", so the panel opens on
  // the source itself rather than on the explanation before it.
  function panelWords(source) {
    var copy = source.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    copy.querySelectorAll('.source-panel').forEach(function (el) { el.remove(); });
    copy.querySelectorAll('button.figure-button').forEach(function (button) {
      button.parentNode.replaceChild(document.createTextNode(button.textContent), button);
    });
    if (source.classList.contains('source-note')) startAtTheWordSource(copy);
    var words = document.createDocumentFragment();
    while (copy.firstChild) words.appendChild(copy.firstChild);
    return words;
  }

  function startAtTheWordSource(copy) {
    var walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT, null);
    var textNode;
    while ((textNode = walker.nextNode())) {
      var at = textNode.nodeValue.search(/\bSources?\b/);
      if (at < 0) continue;
      textNode.nodeValue = textNode.nodeValue.slice(at);
      for (var n = textNode; n !== copy; n = n.parentNode) {
        while (n.previousSibling) n.parentNode.removeChild(n.previousSibling);
      }
      return;
    }
  }

  function makePanel(source) {
    var panel = document.createElement('span');
    panel.className = 'source-panel';
    panel.id = 'source-panel-' + (++panelsMade);
    panel.setAttribute('role', 'note');
    panel.appendChild(panelWords(source));
    return panel;
  }

  // Tells screen readers whether a figure's panel is open, and which one.
  function markOpen(button, panel) {
    button.setAttribute('aria-expanded', panel ? 'true' : 'false');
    if (panel) button.setAttribute('aria-controls', panel.id);
    else button.removeAttribute('aria-controls');
  }

  // A figure inside a table opens a full-width row under its own row, so
  // the source isn't squeezed into one narrow cell. One panel per row:
  // tapping another figure in the same row swaps it.
  function togglePanelUnderRow(button, figure, row) {
    var next = row.nextElementSibling;
    var openRow = next && next.classList.contains('source-panel-row') ? next : null;
    var sameFigure = openRow && openRow.openedBy === button;
    if (openRow) {
      markOpen(openRow.openedBy, null);
      openRow.remove();
    }
    if (sameFigure) return;
    var source = sourceFor(figure);
    if (!source) return;
    var newRow = document.createElement('tr');
    newRow.className = 'source-panel-row';
    var cell = document.createElement('td');
    var table = row.closest('table');
    cell.colSpan = (table.tHead || table).rows[0].cells.length;
    var panel = makePanel(source);
    cell.appendChild(panel);
    newRow.appendChild(cell);
    row.parentNode.insertBefore(newRow, row.nextSibling);
    newRow.openedBy = button;
    markOpen(button, panel);
  }

  // A figure in the text opens its panel at the end of its paragraph (or
  // list item), so the sentence it sits in is never split in two. In a
  // small chart or a row of facts (marked class="source-panel-here": the
  // fund cards), it opens under the whole thing instead of inside one
  // narrow box. One panel per paragraph: tapping another figure swaps it.
  function togglePanelInText(button, figure) {
    var block = figure.closest('p, li, .source-panel-here') || figure.parentNode;
    var last = block.lastElementChild;
    var openPanel = last && last.classList.contains('source-panel') ? last : null;
    var sameFigure = openPanel && openPanel.openedBy === button;
    if (openPanel) {
      markOpen(openPanel.openedBy, null);
      openPanel.remove();
    }
    if (sameFigure) return;
    var source = sourceFor(figure);
    if (!source) return;
    var panel = makePanel(source);
    block.appendChild(panel);
    panel.openedBy = button;
    markOpen(button, panel);
  }

  // One listener for the whole page, so it keeps working when a script
  // swaps in new HTML (the SIP calculator's table, the video cards).
  document.addEventListener('click', function (event) {
    var button = event.target.closest ? event.target.closest('button.figure-button') : null;
    if (!button) return;
    var figure = button.parentNode;
    var row = figure.closest('tr');
    if (row) togglePanelUnderRow(button, figure, row);
    else togglePanelInText(button, figure);
  });

  // Turns each figure's text into a button. Safe to run again on new HTML:
  // a figure that already has its button is skipped.
  function makeFiguresTappable(root) {
    (root || document).querySelectorAll('td.num, .num').forEach(function (figure) {
      if (figure.querySelector('button.figure-button')) return;
      if (figure.closest(LEAVE_ALONE)) return;
      if (!figure.matches('td') && figure.closest('td.num')) return;  // the cell is the figure
      if (!sourceFor(figure)) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'figure-button';
      button.setAttribute('aria-expanded', 'false');
      while (figure.firstChild) button.appendChild(figure.firstChild);
      figure.appendChild(button);
    });
  }

  makeFiguresTappable(document);
  // For page scripts that swap in new HTML (the SIP calculator, the video
  // cards): they call window.makeFiguresTappable(theNewPart).
  window.makeFiguresTappable = makeFiguresTappable;

})();


/* 4. COUNTING UP ===========================================================
   Shows on: any number marked data-count — the home page's 204, and the
   two big figures on /halal-stocks/.
   <span class="num" data-count>204</span> counts up from zero once, when
   it scrolls into view. Whole numbers and decimals both work ("40.7%"
   counts with one decimal), and whatever sits around the number ("₹",
   "%") stays put.

   It never runs on a number already on screen when the page opens: text
   a reader can see never waits on an animation. Its box keeps the final
   number's width the whole time, so nothing around it moves.
   ========================================================================== */

(function () {

  var numbers = document.querySelectorAll('[data-count]');
  if (numbers.length === 0) return;
  if (lessMotion) return;
  if (!('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

  var COUNT_UP_TIME = 900;   // milliseconds

  function countUp(el) {
    var textNode = el;                                       // the text itself,
    while (textNode.firstChild) textNode = textNode.firstChild;  // even inside a button
    if (textNode.nodeType !== 3) return;
    var finalText = textNode.nodeValue;
    var parts = finalText.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);   // before, number, after
    if (!parts) return;
    var digits = parts[2].replace(/,/g, '');
    var target = parseFloat(digits);
    if (!(target > 0)) return;
    var decimals = digits.indexOf('.') < 0 ? 0 : digits.length - digits.indexOf('.') - 1;
    var hasCommas = parts[2].indexOf(',') >= 0;
    function written(value) {
      var s = value.toFixed(decimals);
      if (hasCommas) s = Number(s).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      return parts[1] + s + parts[3];
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

    var startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min(1, (now - startTime) / COUNT_UP_TIME);
      var eased = 1 - Math.pow(1 - progress, 3);          // fast, then settling
      textNode.nodeValue = progress < 1 ? written(target * eased) : finalText;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.style.display = el.style.minWidth = el.style.textAlign = '';
      }
    }
    window.requestAnimationFrame(step);
  }

  numbers.forEach(function (el) {
    var firstLook = true;
    var watcher = new IntersectionObserver(function (seen) {
      var visible = seen[seen.length - 1].isIntersecting;
      if (firstLook) {
        firstLook = false;
        if (visible) watcher.disconnect();   // on screen at load: leave it
        return;
      }
      if (visible) {
        watcher.disconnect();
        countUp(el);
      }
    });
    watcher.observe(el);
  });

})();


/* 5. THE APP ===============================================================
   Shows on: nothing you can see — it works in the background on every
   page, so the site can be installed (/app/) and read offline.
   Switches on the service worker (/sw.js — its own comments explain it).
   It waits until the page has fully loaded, so it never slows the first
   view. Opening a page as a file on your computer (no web address) skips
   it, because browsers only allow service workers on a real website.
   ========================================================================== */

(function () {

  if (!('serviceWorker' in navigator)) return;
  var onThisComputer = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (location.protocol !== 'https:' && !onThisComputer) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // If it can't start, the site simply works as a normal website.
    });
  });

})();


/* 6. THE OFFLINE NOTE ======================================================
   Shows on: any page read with no internet — a small white note pinned to
   the bottom of the screen.
   With no internet, the app shows the copy of a page saved on the phone.
   A saved copy can be older than the live page, so the note says so. It
   never pushes the page around, and goes away by itself when the internet
   comes back, or with Close.
   ========================================================================== */

(function () {

  if (!('onLine' in navigator)) return;
  if (document.getElementById('offline-page')) return;   // /offline/ says it already

  var note = null;

  function showNote() {
    if (note) return;
    note = document.createElement('div');
    note.className = 'offline-note';
    note.setAttribute('role', 'status');
    note.innerHTML =
      '<p><strong>You\'re offline.</strong> This is the copy of this page saved ' +
      'on your phone, so figures may have changed since — each one shows ' +
      'its “as of” date.</p>' +
      '<button type="button" class="offline-close">Close</button>';
    note.querySelector('button').addEventListener('click', hideNote);
    document.body.appendChild(note);
  }

  function hideNote() {
    if (!note) return;
    note.remove();
    note = null;
  }

  if (!navigator.onLine) showNote();
  window.addEventListener('offline', showNote);
  window.addEventListener('online', hideNote);

})();


/* 7. LINKS INTO A CLOSED PART ==============================================
   Shows on: any link that points inside a closed part — /screener/#list,
   /ask/#feedback, /app/#iphone, /privacy/#forms…
   Long lists and "Read more" parts are closed <details> (README.md). When
   a link points at something inside one, this opens it, and every closed
   part around it, then shows it. Without JavaScript the part stays
   closed and opens with a tap, as always.
   ========================================================================== */

(function () {

  function openToTheLink() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    if (!target) return;
    var openedSomething = false;
    for (var part = target; part; part = part.parentElement) {
      if (part.tagName === 'DETAILS' && !part.open) { part.open = true; openedSomething = true; }
    }
    if (openedSomething) target.scrollIntoView();
  }

  openToTheLink();
  window.addEventListener('hashchange', openToTheLink);

})();
