# Purevesting website

## Writing rules — read these first

Our visitors are Muslims in India who want to invest, save or borrow the
halal way. Most are beginners, and many speak Hinglish. They come with one
question, like "Is Zomato halal?" or "Is EPF halal?", and want the answer
fast. Write for them, not for MAS and not for a research paper.

These rules were set by MAS on 6 November 2026. They replace any older rule
in TODO.md, or in a comment in the code, that says something different.

1. **Never name a madrasa, a school of thought or a mufti.** Not Darul Uloom
   Deoband, and not any other. If we name one, people who follow the others
   leave. Just say "a fatwa" or "scholars". This goes for the Sources part
   too: describe the fatwa ("a fatwa on provident fund"), don't say who
   gave it.
2. **Simple everyday English, short sentences.** Explain a hard word the
   first time you use it: riba (interest).
3. **Answer first.** Every page starts with the answer, in 2 or 3 short
   lines.
4. **If a sentence is only there to protect us or to explain the page, cut
   it.**
5. **Sources stay, but out of the way:** one "Sources" part at the bottom of
   each page, closed.
6. **Don't change any fact, number or what a fatwa says.** Only change how
   it is said.

### What that means in practice

- **No names people don't know.** TASIS, ShariahCap Advisors, AAOIFI, Dow
  Jones and the like stay out of the page text: say "a Shariah board" or
  "the international standard". Names people already know, like NSE, SEBI
  and RBI, are fine.
- **Don't explain the page.** No "How to read this table", no "What this
  page contains", no "What the answer means". People can see the page. If
  something is really needed, put it under a "Read more" that stays closed.
- **One disclaimer line, in one place.** "Not investment advice", "we never
  recommend", "not a recommendation", "not a ruling" appear only in the one
  short line in the footer and on the /disclaimer/ page. Nowhere else.
- **No long notes in the middle of a page.** If a note has a fact the
  visitor needs, say it in one short sentence in the text.
- **Bylines.** On article pages: MAS's photo, name and the date, nothing
  else. No "min read", no "Corrected · see the corrections log" line. Tools,
  hub and legal pages have no name line. No "Found something wrong here?"
  boxes anywhere.
- **"Share as image" only under the main answer** of a page, never under
  tables.
- **End every article with one friendly line:** "Still have a doubt? Ask
  me", linking to /ask/.
- **Purevesting covers all of finance — investing, saving and borrowing —**
  not only investing. Use those words when the site talks about itself.

### How these look in the HTML

Copy from `_template.html`, which already follows the rules. In short:

- The answer: `<div class="answer"><p>…</p></div>`, straight under the H1.
  `assets/share-card.js` adds the "Share as image" button under the first
  answer box on a page, and nowhere else.
- The byline: photo, name, and `Last updated <time …>…</time>`.
- "Read more": `<details class="source"><summary>Read more</summary>
  <div class="source-body">…</div></details>`. It is closed until tapped.
- Sources: one `<details class="source sources" id="sources">` at the very
  end of `<main>`, with a list inside. Give each source line an id
  (`<li id="src-epf-bands">`) and point the figures it backs at it with
  `data-src="src-epf-bands"` — on the figure, its table, or the paragraph
  or section around it. Then tapping a number still shows its source.
- The friendly line: `<p class="ask-line">Still have a doubt?
  <a href="/ask/">Ask me</a></p>`, at the end of the article.

## The look — set by MAS on 6 November 2026

The site should look youthful, interesting and professional. Not flat,
not the same cream and green everywhere, not like a research paper.

1. **Three colours: cream, green and sky blue.** Green stays the brand:
   the logo, buttons, links and "Halal". Sky blue is for section
   backgrounds, icons and info parts (Read more, Sources, notes), so the
   page has rhythm and important things stand out. The cream page stays.
2. **Fewer words, more drawings.** Simple icons, small illustrations,
   charts and diagrams instead of paragraphs and tables. Draw them as
   simple SVG, or plain HTML and CSS, so pages stay fast: no pictures of
   text, no chart libraries.
3. **Some simple animation.** Numbers count up, squares and bars fill in,
   cards rise gently into view, buttons react to a tap. Light and quick
   (half a second or less), and all of it switches off when a phone asks
   for less motion.
4. **Two fonts.** Bricolage Grotesque for headings, Plus Jakarta Sans for
   text and numbers. Nothing else.
5. **Phone first.** Check every change on a small phone (360px wide), a
   normal phone (390px) and a computer. Nothing on a page slides sideways.

### The colours

All of them are in `assets/site.css`, section 2. Use the names, never the
codes.

| Name | Colour | For |
|---|---|---|
| `--bone` | #FAF7F0 | the cream page |
| `--white` | #FFFFFF | cards, tables, the search box |
| `--green` | #0E9E6E | "Halal", passing squares, green drawings |
| `--green-deep` | #0A7F58 | buttons and links |
| `--sky` | #2A9AE0 | drawings and chart bars |
| `--sky-deep` | #0B6FAA | blue icons and small blue words |
| `--sky-ink` | #0C4766 | headings and text on a blue band |
| `--sky-tint` | #E4F2FB | blue bands and info boxes |
| `--sky-soft` | #C8E6F8 | lines on a blue band, empty chart tracks |
| `--forest` | #123B30 | the footer and the videos band only |

The blues were checked against the green with a colour-blindness test
(they stay far apart for people who can't tell red from green) and for
contrast. Two rules that don't change: "doesn't pass" is grey, never
red; and red is only for the cost of a loan, on the loan calculator.
Never colour a real fund's returns.

### What that means in practice

- **Rhythm.** Sections alternate: cream, then a blue band, then cream.
  Never two blue bands in a row.
- **Icons** are 24-pixel line drawings: 2px lines, round ends, no fill,
  drawn in `--sky-deep` on a `--sky-tint` circle. Green only when the icon
  means "Halal" or is a button. No emoji, no photos as icons.
- **Charts** do one job each: bars no thicker than 24px with rounded
  ends, one colour per chart unless the chart compares two things, and
  the numbers written in the HTML as well, so they read without
  JavaScript, to screen readers, and still show their source when tapped.
  A big number on its own uses ordinary figures; numbers in a column use
  same-width figures (`.num`), so they line up.
- **Tables** turn into a stack of small cards on a phone. If a table has
  only a few rows, try a chart or cards instead.
- **Motion** never hides anything for long and never moves text someone is
  reading: a number already on screen when the page opens never counts up.

Added by MAS on 6 November 2026 (part 3):

- **The answer first and big; a long list behind one button.** The
  screener shows ✓ Halal, ✗ Not halal or ? Don't know yet, big, with only
  a small date; its 501 companies, and the boycott list, open with one
  "See all" button. The list stays in the page, so Google reads it.
- **No table may need sideways scrolling on a phone.** A table becomes
  cards on a phone, or a chart, or goes under a "Read more".
- **Calculators:** the boxes and the answer, drawn as a chart, on the
  first screen of a phone; tables and long explanations under "Read
  more".
- **A video on the same topic goes near the top**, as a small card that
  links to YouTube. Only where one really fits.

### How the look is built in the HTML

Copy from `index.html`, `halal-stocks/` and `_template.html`.

- A blue band: `<section class="section band">`.
- An icon: `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">…</svg></span>`.
  Draw with `stroke="currentColor"`, so CSS sets the colour.
- A question tile (home page, hub pages): `<a class="tile" href="…">`
  with an icon and the question inside.
- Bars: `<div class="bars">`, one `<div class="bar-row">` per bar, with
  the bar's size in its style (`style="--to: 65"` for 65%, and
  `--from` too for a range). The rows hold the words and numbers; the bar
  is only the drawing.
- Count-up: put `data-count` on a number. Squares and bars fill in by
  themselves when they scroll into view.
- A table that becomes cards on a phone: `<div class="table-scroll table-stack">`,
  and give each cell its column's name: `<td data-label="Share of new money">`.
- Rising cards: put `reveal` on the section (`<section class="section reveal">`);
  its cards and tiles rise one after another.
- A long list behind one button (copy from `screener/`):
  `<details class="list-toggle"><summary><span>See all …</span></summary>
  <div class="list-body">…</div></details>`. A link to its id opens it.
- A video near the top (copy from `screener/`): `<a class="video-pick">`
  with the video's picture, its length and its title.
- Bars that can go below zero (copy from `compare/shariah-mutual-funds/`):
  `<div class="bars bars-zero">`, with 0 in the middle (`--from: 50`) and
  `bar-row-left` on a row whose figure is negative.
- A tapped figure in a small chart or a row of facts opens its source
  under the whole thing, not inside one narrow box: put `fig-host` on it.
- A calculator (copy from `sip-calculator/`): `<section class="section
  calc-page">`, then `<div class="calc-layout">` holding the boxes
  (`calc-fields calc-inline`, with a `calc-row` per box or a `calc-pair`
  for two side by side) and the answer (`calc-result`).

## Other files

- `TODO.md` — everything still to do, and the monthly jobs.
- `_template.html` — the starting point for a new page.
- `scripts/` — the monthly screener update and the boycott list update.

None of these are published on the site (see `.assetsignore`).
