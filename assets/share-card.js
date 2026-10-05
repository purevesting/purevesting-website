/* ==========================================================================
   PUREVESTING — SHARE CARDS
   Save at:  /assets/share-card.js

   Puts a "Share as image" button under every answer box and every table.
   Tapping it draws a picture of that box or table — logo, heading, the
   content, its source and the page address — 1080 pixels wide, the size
   WhatsApp and Instagram use. On a phone it opens the share sheet. On a
   computer, which can't share files, the picture downloads instead.

   Nothing here is needed to read the site. With JavaScript switched off
   the buttons never appear, and everything else works as normal.

   HOW IT'S BUILT, TOP TO BOTTOM
     1. Settings — card size, colours, fonts (same tokens as site.css)
     2. Reading the page — pulls the text out of a box or table
     3. Text helpers — measuring and wrapping text to a width
     4. Drawing — the card itself, and the table inside it
     5. Sharing — share sheet on phones, download everywhere else
     6. Start-up — waits for the fonts and logo, then adds the buttons
   ========================================================================== */

(function () {
  'use strict';

  // Very old browsers can't draw or share the card, so they get no buttons.
  if (!window.Promise || !document.fonts || !window.HTMLCanvasElement) return;

  // Pages with no answer box and no table have nothing to share.
  if (!document.querySelector('.answer, .table-scroll')) return;


  /* 1. SETTINGS ========================================================== */

  var W       = 1080;         // card width in pixels
  var MIN_H   = 1080;         // shortest card: a square
  var MAX_H   = 1350;         // tallest card: Instagram's 4:5 portrait
  var PAD     = 72;           // space around the edge of the card
  var INNER   = W - PAD * 2;  // width left for the content
  var MAX_COLUMNS = 6;        // wider tables are too cramped to share

  // Text sizes to try, largest first (1 = full size). An answer shrinks
  // further so it always fits whole. A table stops shrinking sooner and
  // drops its last rows instead, so the card stays readable on a phone.
  var ANSWER_SCALES = [1, 0.92, 0.85, 0.78, 0.72];
  var TABLE_SCALES  = [1, 0.92, 0.85];

  var C = {                   // the colours from site.css
    bone: '#FAF7F0', white: '#FFFFFF', ink: '#1A1814', ink2: '#5B5951',
    ink3: '#6E6B60', line: '#E7E1D4', green: '#0E9E6E',
    greenDeep: '#0A7F58', greenTint: '#D7F2E6', greenInk: '#0A5B41'
  };

  var FONT = {                // the fonts from site.css
    display: '"Bricolage Grotesque", "Plus Jakarta Sans", sans-serif',
    body:    '"Plus Jakarta Sans", system-ui, sans-serif',
    mono:    '"DM Mono", ui-monospace, monospace'
  };

  function font(weight, size, family) {
    return weight + ' ' + Math.round(size) + 'px ' + family;
  }


  /* 2. READING THE PAGE ================================================== */

  // Collapse runs of spaces and line breaks into single spaces. A
  // non-breaking space (&nbsp; in the HTML) is kept, so words joined by one
  // — "Size&nbsp;(₹&nbsp;cr)" — stay on one line on the card too.
  function clean(text) {
    return (text || '').replace(/[ \t\r\n\f]+/g, ' ').trim();
  }

  // An element's text without any source panel a reader has opened inside
  // it (see the tappable figures in site.js), so the card never shows one.
  function textOf(el) {
    var copy = el.cloneNode(true);
    copy.querySelectorAll('.fig-pop').forEach(function (pop) { pop.remove(); });
    return clean(copy.textContent);
  }

  // The page address without "https://", e.g. purevesting.com/instruments/epf/
  function pageAddress() {
    var link = document.querySelector('link[rel="canonical"]');
    var url = link ? link.href : location.origin + location.pathname;
    return url.replace(/^https?:\/\//, '');
  }

  // The date in the byline, e.g. "Last updated 24 September 2026".
  function lastUpdated() {
    var t = document.querySelector('.byline time');
    return t ? 'Last updated ' + clean(t.textContent) : '';
  }

  // The H1 split into coloured pieces, so the green words stay green.
  function headingPieces() {
    var h1 = document.querySelector('h1');
    var pieces = [];
    if (!h1) return pieces;
    h1.childNodes.forEach(function (node) {
      var green = node.nodeType === 1 && node.classList.contains('t-green');
      pieces.push({ text: node.textContent, color: green ? C.green : C.ink });
    });
    return pieces;
  }

  // One table cell: its main text, its small second line (if any), and
  // whether it is a number column or a pass / fail chip.
  // A cell can carry data-share-text="…" to say something shorter on the
  // card than on the page — e.g. a chip whose "see note" points at a note
  // the card doesn't show.
  function readCell(cell, isNumColumn) {
    var copy = cell.cloneNode(true);
    copy.querySelectorAll('.fig-pop').forEach(function (pop) { pop.remove(); });
    var note = copy.querySelector('.cell-note');
    var noteText = note ? clean(note.textContent) : '';
    if (note) note.remove();
    var chip = cell.querySelector('.chip');
    return {
      text: cell.getAttribute('data-share-text') || clean(copy.textContent),
      note: noteText,
      num: isNumColumn || cell.classList.contains('num'),
      chip: chip ? (chip.classList.contains('chip-pass') ? 'pass' : 'fail') : null
    };
  }

  // A whole table: header cells and body rows.
  // A column whose <th> has data-share="skip" is left off the card — use it
  // for a column that only repeats what another one says, so the rest have
  // room. Rows opened by tapping a figure (class "fig-row") are not data.
  function readTable(table) {
    var headCells = table.querySelectorAll('thead th');
    var numCols = [];
    var skip = [];
    var head = [];
    headCells.forEach(function (th, i) {
      skip[i] = th.getAttribute('data-share') === 'skip';
      numCols[i] = th.classList.contains('num');
      if (!skip[i]) head.push(clean(th.textContent));
    });
    var rows = [];
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      if (tr.classList.contains('fig-row')) return;
      var cells = [];
      tr.querySelectorAll('th, td').forEach(function (cell, i) {
        if (!skip[i]) cells.push(readCell(cell, numCols[i]));
      });
      rows.push(cells);
    });
    return { head: head, rows: rows };
  }

  // The source line for a table's card. A table can have more than one
  // source note under it (the compare page's first table has three); the
  // card takes the part of each that starts at "Source", so every source is
  // named and the explanations are left for the page. If no note names a
  // source, the first note goes on the card whole.
  function tableSource(notes) {
    var parts = [];
    notes.forEach(function (note) {
      var text = textOf(note);
      var at = text.search(/\bSources?\b/);
      if (at >= 0) parts.push(text.slice(at));
    });
    if (parts.length) return parts.join(' ');
    return notes.length ? textOf(notes[0]) : '';
  }

  // A table is worth sharing only if it has rows, isn't too wide, and
  // isn't still waiting for its data (every value a dash).
  function tableIsShareable(data) {
    if (!data.rows.length) return false;
    var cols = Math.max(data.head.length, data.rows[0].length);
    if (cols > MAX_COLUMNS) return false;
    var filled = 0;
    data.rows.forEach(function (row) {
      row.slice(1).forEach(function (cell) {
        if (cell.text && cell.text !== '—' && cell.text !== '-') filled++;
      });
    });
    return filled > 0;
  }

  // The title for a table's card: its hidden caption if it has one,
  // otherwise the heading of the section it sits in.
  function tableTitle(table) {
    var caption = table.querySelector('caption');
    if (caption && clean(caption.textContent)) return clean(caption.textContent);
    var section = table.closest('section');
    var h = section && section.querySelector('h2, h3');
    return h ? clean(h.textContent) : clean(document.title);
  }


  /* 3. TEXT HELPERS ====================================================== */

  // Splits text into lines that fit maxWidth, using the font already set
  // on ctx. A single word too long for a line is broken by letters.
  function wrap(ctx, text, maxWidth) {
    var words = clean(text).split(' ');
    var lines = [];
    var line = '';
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (!line || ctx.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);

    var out = [];
    lines.forEach(function (l) {
      while (ctx.measureText(l).width > maxWidth && l.length > 1) {
        var cut = l.length - 1;
        while (cut > 1 && ctx.measureText(l.slice(0, cut)).width > maxWidth) cut--;
        out.push(l.slice(0, cut));
        l = l.slice(cut);
      }
      out.push(l);
    });
    return out;
  }

  // The same, for text made of coloured pieces (the H1). Returns lines,
  // each a list of { text, color } pieces ready to draw left to right.
  function wrapPieces(ctx, pieces, maxWidth) {
    var words = [[]];                         // each word: list of pieces
    pieces.forEach(function (p) {
      p.text.replace(/\s+/g, ' ').split(/( )/).forEach(function (part) {
        if (part === ' ') { if (words[words.length - 1].length) words.push([]); }
        else if (part) words[words.length - 1].push({ text: part, color: p.color });
      });
    });
    words = words.filter(function (w) { return w.length; });

    function width(word) {
      return word.reduce(function (sum, p) { return sum + ctx.measureText(p.text).width; }, 0);
    }
    var space = ctx.measureText(' ').width;
    var lines = [];
    var line = [];
    var lineWidth = 0;
    words.forEach(function (word) {
      var w = width(word);
      if (line.length && lineWidth + space + w > maxWidth) {
        lines.push(line);
        line = [];
        lineWidth = 0;
      }
      if (line.length) { line.push({ text: ' ', color: C.ink }); lineWidth += space; }
      word.forEach(function (p) { line.push(p); });
      lineWidth += w;
    });
    if (line.length) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }


  /* 4. DRAWING =========================================================== */

  // Every card has the same frame: logo and name at the top, a heading,
  // the content (an answer or a table), then the source and the address.
  // The content is drawn by "body": it reports its height when asked to
  // measure, and draws itself when given a position.
  //
  // Everything is laid out at a "scale" — 1 is full size. If the card
  // would be taller than MAX_H, it is laid out again slightly smaller.

  var LOGO = new Image();

  function layoutCard(ctx, card, scale) {
    var s = scale;
    var titleSize = card.titleSize * s;
    ctx.font = font(800, titleSize, FONT.display);
    var titleLines = card.titlePieces
      ? wrapPieces(ctx, card.titlePieces, INNER)
      : wrap(ctx, card.title, INNER).map(function (t) { return [{ text: t, color: C.ink }]; });

    var sourceSize = 24;
    ctx.font = font(400, sourceSize, FONT.body);
    var allSource = card.source ? wrap(ctx, card.source, INNER) : [];
    // A note that starts with an explanation can be too long for five
    // lines. Then the explanation is dropped, so the card keeps the part
    // that names the source.
    var sourceAt = card.source ? card.source.search(/\bSources?\b/) : -1;
    if (allSource.length > 5 && sourceAt > 0) {
      allSource = wrap(ctx, card.source.slice(sourceAt), INNER);
    }
    var sourceLines = allSource.slice(0, 5);
    if (allSource.length > 5) {               // cut short: end on a whole word and "…"
      var last = sourceLines[4];
      while (ctx.measureText(last + '…').width > INNER && last.indexOf(' ') > 0) {
        last = last.slice(0, last.lastIndexOf(' '));
      }
      sourceLines[4] = last + '…';
    }

    var body = card.body(ctx, s);             // measures the content
    var brandH = 56, gapAfterBrand = 48;
    var titleH = titleLines.length * titleSize * 1.12, gapAfterTitle = 40;
    var gapAfterBody = 36;
    var sourceH = sourceLines.length * sourceSize * 1.45;
    var footerH = 26 * 1.4 + 8 + 22 * 1.4;    // address line + disclaimer line

    var height = PAD + brandH + gapAfterBrand + titleH + gapAfterTitle +
                 body.height + gapAfterBody + sourceH + 24 + footerH + PAD;

    return {
      height: height, body: body, titleSize: titleSize, titleLines: titleLines,
      sourceSize: sourceSize, sourceLines: sourceLines,
      brandH: brandH, gapAfterBrand: gapAfterBrand, titleH: titleH,
      gapAfterTitle: gapAfterTitle, gapAfterBody: gapAfterBody, sourceH: sourceH,
      footerH: footerH
    };
  }

  function drawCard(card) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // Find the largest scale at which everything fits in MAX_H.
    var scales = card.scales;
    var L;
    for (var i = 0; i < scales.length; i++) {
      L = layoutCard(ctx, card, scales[i]);
      if (L.height <= MAX_H && L.body.fits !== false) break;
    }
    // Still too tall at the smallest size: let the table drop rows.
    if (L.height > MAX_H && card.fitRows) {
      card.fitRows(ctx, scales[scales.length - 1], L.body.height - (L.height - MAX_H));
      L = layoutCard(ctx, card, scales[scales.length - 1]);
    }

    var H = Math.max(MIN_H, Math.min(MAX_H, Math.ceil(L.height)));
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';

    // Background
    ctx.fillStyle = C.bone;
    ctx.fillRect(0, 0, W, H);

    // Logo and name
    var y = PAD;
    if (LOGO.complete && LOGO.naturalWidth) ctx.drawImage(LOGO, PAD, y, 56, 56);
    ctx.font = font(800, 40, FONT.display);
    ctx.fillStyle = C.ink;
    ctx.fillText('Purevesting', PAD + 56 + 16, y + 8);

    // The green dot after the name, as in the site header: sitting on the
    // baseline like a full stop. alphabeticBaseline says how far below the
    // top of the text the baseline is; 31 is the same figure for browsers
    // too old to report it.
    var wordmark = ctx.measureText('Purevesting');
    var drop = typeof wordmark.alphabeticBaseline === 'number' ? -wordmark.alphabeticBaseline : 31;
    var dot = 40 * 0.13;
    ctx.fillStyle = C.green;
    ctx.beginPath();
    ctx.arc(PAD + 56 + 16 + wordmark.width + 40 * 0.06 + dot, y + 8 + drop - dot, dot, 0, 2 * Math.PI);
    ctx.fill();

    y += L.brandH + L.gapAfterBrand;

    // Heading
    ctx.font = font(800, L.titleSize, FONT.display);
    L.titleLines.forEach(function (line) {
      var x = PAD;
      line.forEach(function (p) {
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, x, y);
        x += ctx.measureText(p.text).width;
      });
      y += L.titleSize * 1.12;
    });
    y += L.gapAfterTitle;

    // The content
    L.body.draw(ctx, PAD, y);
    y += L.body.height + L.gapAfterBody;

    // Source, then the page address and the disclaimer pinned to the bottom
    ctx.font = font(400, L.sourceSize, FONT.body);
    ctx.fillStyle = C.ink3;
    L.sourceLines.forEach(function (line) {
      ctx.fillText(line, PAD, y);
      y += L.sourceSize * 1.45;
    });

    var footerY = H - PAD - L.footerH;
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, footerY - 20);
    ctx.lineTo(W - PAD, footerY - 20);
    ctx.stroke();
    ctx.font = font(700, 26, FONT.body);
    ctx.fillStyle = C.greenDeep;
    ctx.fillText(card.address, PAD, footerY);
    ctx.font = font(400, 22, FONT.body);
    ctx.fillStyle = C.ink3;
    ctx.fillText('Educational content, not investment advice.', PAD, footerY + 26 * 1.4 + 8);

    return canvas;
  }

  // The content of an answer box: its text on a white panel with the
  // green edge the site uses for answers.
  function answerBody(text) {
    return function (ctx, s) {
      var size = 36 * s, lh = size * 1.5, padIn = 44 * s, edge = 10;
      ctx.font = font(400, size, FONT.body);
      var lines = wrap(ctx, text, INNER - edge - padIn * 2);
      var height = lines.length * lh + padIn * 2;
      return {
        height: height,
        draw: function (ctx, x, y) {
          ctx.fillStyle = C.white;
          roundRect(ctx, x, y, INNER, height, 16);
          ctx.fill();
          ctx.strokeStyle = C.line;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = C.green;
          ctx.fillRect(x, y + 8, edge, height - 16);
          ctx.font = font(400, size, FONT.body);
          ctx.fillStyle = C.ink;
          lines.forEach(function (line, i) {
            ctx.fillText(line, x + edge + padIn, y + padIn + i * lh + (lh - size) / 2);
          });
        }
      };
    };
  }

  // The content of a table: header row, then each row, with column widths
  // worked out from how much text each column holds.
  function tableBody(data) {
    var keep = data.rows.length;       // rows shown; fitRows() can lower it

    function layout(ctx, s) {
      var cellSize = 28 * s, noteSize = 21 * s, headSize = 23 * s;
      var padX = 18 * s, padY = 16 * s, lhCell = cellSize * 1.35, lhNote = noteSize * 1.4;
      var cols = Math.max(data.head.length, data.rows[0].length);
      var rows = data.rows.slice(0, keep);

      function cellFont(cell, col) {
        if (cell.num) return font(400, cellSize, FONT.mono);
        return font(col === 0 ? 600 : 400, cellSize, FONT.body);
      }

      // Narrowest and widest each column could sensibly be.
      var minW = [], maxW = [];
      for (var c = 0; c < cols; c++) { minW[c] = 0; maxW[c] = 0; }
      function consider(text, fnt, c) {
        ctx.font = fnt;
        var longestWord = 0;
        clean(text).split(' ').forEach(function (w) {
          longestWord = Math.max(longestWord, ctx.measureText(w).width);
        });
        minW[c] = Math.max(minW[c], Math.min(longestWord, INNER * 0.45) + padX * 2);
        maxW[c] = Math.max(maxW[c], ctx.measureText(clean(text)).width + padX * 2);
      }
      data.head.forEach(function (t, c) { consider(t, font(600, headSize, FONT.body), c); });
      rows.forEach(function (row) {
        row.forEach(function (cell, c) {
          if (cell.chip) {
            // A chip never wraps, so its column must fit the whole pill.
            ctx.font = cellFont(cell, c);
            var pill = ctx.measureText(cell.text).width + 24 * s + padX * 2;
            minW[c] = Math.max(minW[c], pill);
            maxW[c] = Math.max(maxW[c], pill);
          } else {
            consider(cell.text, cellFont(cell, c), c);
          }
          if (cell.note) consider(cell.note, font(400, noteSize, FONT.body), c);
        });
      });

      // Share out the width: every column gets its minimum, and the spare
      // room goes to the columns with the most text.
      var sumMin = 0, sumMax = 0;
      for (c = 0; c < cols; c++) { sumMin += minW[c]; sumMax += maxW[c]; }
      var widths = [];
      for (c = 0; c < cols; c++) {
        if (sumMax <= INNER) {
          widths[c] = maxW[c] * INNER / sumMax;
        } else {
          var flex = sumMax - sumMin;
          widths[c] = minW[c] + (flex ? (maxW[c] - minW[c]) * (INNER - sumMin) / flex : 0);
        }
      }
      var fits = sumMin <= INNER;

      // Wrap every cell and work out each row's height.
      ctx.font = font(600, headSize, FONT.body);
      var headLines = data.head.map(function (t, c) { return wrap(ctx, t, widths[c] - padX * 2); });
      var headH = padY * 2 + Math.max.apply(null, headLines.map(function (l) { return l.length; }).concat([1])) * headSize * 1.3;

      var laid = rows.map(function (row) {
        var cells = row.map(function (cell, c) {
          ctx.font = cellFont(cell, c);
          var lines = cell.chip ? [cell.text] : wrap(ctx, cell.text, widths[c] - padX * 2);
          ctx.font = font(400, noteSize, FONT.body);
          var notes = cell.note ? wrap(ctx, cell.note, widths[c] - padX * 2) : [];
          var h = lines.length * lhCell + (notes.length ? 6 + notes.length * lhNote : 0);
          return { cell: cell, lines: lines, notes: notes, h: h };
        });
        var rowH = padY * 2 + Math.max.apply(null, cells.map(function (x) { return x.h; }));
        return { cells: cells, h: rowH };
      });

      var height = headH + laid.reduce(function (sum, r) { return sum + r.h; }, 0);
      var more = data.rows.length - rows.length;
      if (more > 0) height += lhCell + padY * 2;

      return {
        fits: fits, height: height,
        draw: function (ctx, x, y) {
          ctx.fillStyle = C.white;
          roundRect(ctx, x, y, INNER, height, 16);
          ctx.fill();
          ctx.strokeStyle = C.line;
          ctx.lineWidth = 2;
          ctx.stroke();

          var cx, cy = y;

          // Header row
          ctx.font = font(600, headSize, FONT.body);
          ctx.fillStyle = C.ink3;
          cx = x;
          headLines.forEach(function (lines, c) {
            var right = rows.length && rows[0][c] && rows[0][c].num;
            lines.forEach(function (line, i) {
              var tx = right ? cx + widths[c] - padX - ctx.measureText(line).width : cx + padX;
              ctx.fillText(line, tx, cy + padY + i * headSize * 1.3);
            });
            cx += widths[c];
          });
          cy += headH;

          // Body rows, each with a line above it
          laid.forEach(function (row) {
            ctx.strokeStyle = C.line;
            ctx.beginPath();
            ctx.moveTo(x, cy);
            ctx.lineTo(x + INNER, cy);
            ctx.stroke();

            cx = x;
            row.cells.forEach(function (lc, c) {
              var cell = lc.cell, ty = cy + padY;
              ctx.font = cellFont(cell, c);

              if (cell.chip) {
                // Pass / fail chip: a pill with the symbol and the word,
                // never colour alone.
                var tw = ctx.measureText(cell.text).width;
                var ph = cellSize * 1.35, pw = tw + 24 * s;
                roundRect(ctx, cx + padX, ty, pw, ph, ph / 2);
                ctx.fillStyle = cell.chip === 'pass' ? C.greenTint : C.bone;
                ctx.fill();
                if (cell.chip !== 'pass') { ctx.strokeStyle = C.line; ctx.stroke(); }
                ctx.fillStyle = cell.chip === 'pass' ? C.greenInk : C.ink2;
                ctx.fillText(cell.text, cx + padX + 12 * s, ty + (ph - cellSize) / 2);
              } else {
                ctx.fillStyle = C.ink;
                lc.lines.forEach(function (line, i) {
                  var tx = cell.num ? cx + widths[c] - padX - ctx.measureText(line).width : cx + padX;
                  ctx.fillText(line, tx, ty + i * lhCell + (lhCell - cellSize) / 2);
                });
              }

              if (lc.notes.length) {
                ctx.font = font(400, noteSize, FONT.body);
                ctx.fillStyle = C.ink3;
                var ny = ty + lc.lines.length * lhCell + 6;
                lc.notes.forEach(function (line, i) {
                  ctx.fillText(line, cx + padX, ny + i * lhNote);
                });
              }
              cx += widths[c];
            });
            cy += row.h;
          });

          // "…and N more rows" when the table had to be cut short
          if (more > 0) {
            ctx.strokeStyle = C.line;
            ctx.beginPath();
            ctx.moveTo(x, cy);
            ctx.lineTo(x + INNER, cy);
            ctx.stroke();
            ctx.font = font(600, cellSize, FONT.body);
            ctx.fillStyle = C.ink3;
            ctx.fillText('…and ' + more + ' more row' + (more > 1 ? 's' : '') + ' on the page',
                         x + padX, cy + padY + (lhCell - cellSize) / 2);
          }
        }
      };
    }

    return {
      body: layout,
      fitRows: function (ctx, s, room) {
        while (keep > 1 && layout(ctx, s).height > room) keep--;
      }
    };
  }


  /* 5. SHARING =========================================================== */

  // Can this browser share picture files (most phones can)? Checked once.
  var CAN_SHARE_FILES = (function () {
    try {
      var test = new File([new Uint8Array(1)], 'test.png', { type: 'image/png' });
      return !!(navigator.canShare && navigator.canShare({ files: [test] }));
    } catch (e) {
      return false;
    }
  })();

  // The picture as a file. Done without waiting on anything, because a
  // phone only lets a page open the share sheet straight after a tap.
  function canvasToFile(canvas, name) {
    var data = atob(canvas.toDataURL('image/png').split(',')[1]);
    var bytes = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) bytes[i] = data.charCodeAt(i);
    return new File([bytes], name, { type: 'image/png' });
  }

  function download(file) {
    var url = URL.createObjectURL(file);
    var a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function share(card, fileName) {
    var file = canvasToFile(drawCard(card), fileName);
    if (!CAN_SHARE_FILES) return download(file);
    try {
      navigator.share({ files: [file], title: document.title, text: 'https://' + card.address })
        .catch(function (err) {
          // Closing the share sheet isn't an error. Anything else: download.
          if (err && err.name !== 'AbortError') download(file);
        });
    } catch (e) {
      download(file);
    }
  }

  // "purevesting-instruments-epf-2.png"
  function fileName(n) {
    var slug = location.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
    return 'purevesting-' + slug + '-' + n + '.png';
  }


  /* 6. START-UP ========================================================== */

  function addButton(after, onClick) {
    var row = document.createElement('div');
    row.className = 'share-row';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'share-btn';
    btn.textContent = CAN_SHARE_FILES ? 'Share as image' : 'Download as image';
    btn.addEventListener('click', onClick);
    row.appendChild(btn);
    after.parentNode.insertBefore(row, after.nextSibling);
  }

  function start() {
    var address = pageAddress();
    var updated = lastUpdated();
    var count = 0;

    // Answer boxes
    document.querySelectorAll('.answer').forEach(function (box) {
      var n = ++count;
      addButton(box, function () {
        share({
          titlePieces: headingPieces(),
          titleSize: 60,
          scales: ANSWER_SCALES,
          body: answerBody(textOf(box)),
          source: updated,
          address: address
        }, fileName(n));
      });
    });

    // Tables. The button goes under the table's first source line if it
    // has one. A table whose columns can't fit side by side on the card,
    // even at the smallest text size, gets no button.
    var measure = document.createElement('canvas').getContext('2d');
    document.querySelectorAll('.table-scroll').forEach(function (wrapEl) {
      var table = wrapEl.querySelector('table');
      if (!table) return;
      var data = readTable(table);
      if (!tableIsShareable(data)) return;
      if (!tableBody(data).body(measure, TABLE_SCALES[TABLE_SCALES.length - 1]).fits) return;
      // Every source note directly under the table, collected before any
      // button is added between them.
      var notes = [];
      for (var el = wrapEl.nextElementSibling;
           el && el.classList.contains('source-note');
           el = el.nextElementSibling) notes.push(el);
      var n = ++count;
      addButton(notes[0] || wrapEl, function () {
        // Read the table at the moment of the tap, so a calculator's
        // current numbers are what go on the card.
        var t = tableBody(readTable(table));
        share({
          title: tableTitle(table),
          titleSize: 46,
          scales: TABLE_SCALES,
          body: t.body,
          fitRows: t.fitRows,
          source: notes.length ? tableSource(notes) : updated,
          address: address
        }, fileName(n));
      });
    });
  }

  // Wait for the fonts and the logo, so the very first card is drawn with
  // them. If either fails to load, start anyway with fallbacks.
  var ready = [
    document.fonts.load('800 40px "Bricolage Grotesque"'),
    document.fonts.load('400 30px "Plus Jakarta Sans"'),
    document.fonts.load('600 30px "Plus Jakarta Sans"'),
    document.fonts.load('700 30px "Plus Jakarta Sans"'),
    document.fonts.load('400 30px "DM Mono"'),
    new Promise(function (resolve) {
      LOGO.onload = LOGO.onerror = resolve;
      LOGO.src = '/assets/img/logo.svg';
    })
  ];
  Promise.all(ready.map(function (p) { return p.catch(function () {}); })).then(start);
})();