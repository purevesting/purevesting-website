# Purevesting website

The site at purevesting.com: halal finance for Muslims in India —
investing, saving and borrowing. The rules come first; the guide to how
it is built is after them.

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

Added by MAS on 8 November 2026 (part 4):

- **Instrument pages** (EPF, PPF, NPS, Sukanya Samriddhi, digital gold)
  start with the answer drawn — the parts side by side, each with a sign
  (✓ ✗ ? !) and the answer in a word or two — then how it works as a small
  drawing (your money → where it goes → what you get), what scholars say
  as short cards ("a fatwa", never who), and what people do as icon
  cards. Long details under "Read more"; Sources at the bottom, closed.
- **Hub and legal pages are short.** One card or tile per thing; long
  text under "Read more".
- **Clear code beats short code.** Simple names, and a short plain-English
  comment above each part saying what it does and where it shows.

## The guide — how the site is built

Plain files, no build step: what is in this folder is what goes live.
Cloudflare publishes it on every push to `main` (it reads `wrangler.jsonc`).

### What each file and folder does

**The pages** — each folder is one address: `ask/index.html` is
purevesting.com/ask/.

| File or folder | What it is |
|---|---|
| `index.html` | The home page: the stock search, the question tiles, the 500 squares, the videos, "Ask me", the newsletter. |
| `screener/` | "Is my stock halal?" — the search and all 501 Nifty 500 companies. Rewritten every month by `scripts/update_screener.py`. |
| `halal-stocks/` | How many Indian stocks are halal: the squares, by companies or by market value. |
| `methodology/` | How a stock is checked: the two-step drawing and "Try it". |
| `purification-calculator/` | How much to give away from share income. |
| `compare/shariah-mutual-funds/` | The six Shariah mutual funds, as cards. |
| `sip-calculator/`, `loan-calculator/` | The two calculators. |
| `instruments/` | EPF & more: one card per instrument. Inside it, one folder per instrument: `epf/`, `ppf/`, `nps/`, `sukanya-samriddhi/`, `digital-gold/`. |
| `tools/`, `learn/`, `videos/` | The hub pages. |
| `newsletter/`, `ask/`, `about/`, `app/` | HalalEdge sign-up, the question form, about Purevesting, installing the app. |
| `corrections/`, `disclaimer/`, `privacy/` | The corrections log and the two legal pages. |
| `stop-the-genocide/` | The boycott list. Rewritten by `scripts/update_boycott.py` when its dataset changes. |
| `404.html` | "This page doesn't exist", for any wrong address. |
| `offline/` | What the app shows for a page never opened before, with no internet. |

**The shared files** — every page uses these.

| File or folder | What it is |
|---|---|
| `assets/site.css` | The whole look: colours, fonts, cards, charts… in 32 numbered sections, listed at the top of the file. Each section says where it shows on the site. |
| `assets/site.js` | The polish: rising cards, filling charts, tap a figure to see its source, numbers counting up, the app, the offline note. The site works without it. |
| `assets/share-card.js` | The "Share as image" button under an article's answer. |
| `assets/videos.js` | Turns `videos/list.js` into video cards (home page and /videos/). |
| `videos/list.js` | **The list of videos — the one file to edit for a new video.** |
| `assets/fonts/` | The two fonts, plus two tiny files with just the ₹ sign. |
| `assets/img/` | The logo, MAS's photo, the app's icons and screenshots. |
| `assets/og/` | The picture WhatsApp and others show for each page's link (1200 × 630). |
| `favicon…`, `apple-touch-icon.png` | The little icons in a browser tab and on a phone. |
| `manifest.json`, `sw.js` | The app: its name and icons, and the part that keeps pages for reading offline. |
| `sitemap.xml`, `robots.txt` | The list of pages for Google. |

**Not published** (`.assetsignore` keeps them off the site):

| File or folder | What it is |
|---|---|
| `README.md` | This file. |
| `TODO.md` | What is left to do, the jobs that repeat (monthly, quarterly), and what MAS has to do himself. |
| `_template.html` | The starting point for a new page, with every building block in it. |
| `og-template.html` | Makes the link pictures in `assets/og/` (ask the website chat). |
| `scripts/update_screener.py` | The monthly screener update ("run the screener update"). |
| `scripts/update_boycott.py` | The boycott list update ("run the boycott update"). |
| `wrangler.jsonc`, `.assetsignore` | Cloudflare's settings: what is published, and the 404 page. |

### How to add a page

1. Copy `_template.html` into a new folder, as `index.html`: for
   example `instruments/zakat/index.html` becomes
   purevesting.com/instruments/zakat/. Delete the template's
   `<meta name="robots" content="noindex">` line.
2. Fill in the per-page block at the top (the title, the description, the
   address three times), the link picture (`og:image`), and the
   structured data under it (the headline, the dates, the last
   breadcrumb).
3. Write the page with the rules above: the answer first, the byline (on
   an article), the sections, "Still have a doubt? Ask me", then Sources,
   closed. Copy any building block you need from `_template.html` or from
   a page that already has it (the list below says which).
4. Link to it: add one line to the right menu list in the header — on
   **every** page, because the header is the same everywhere (a
   find-and-replace across all files) — and a card on its hub page
   (`/instruments/`, `/tools/` or `/learn/`).
5. Add it to `sitemap.xml`: copy a `<url>` block and change the address
   and the date.
6. Ask the website chat to make its link picture for `assets/og/`.
7. Check it on a small phone (360 pixels wide), a normal phone (390) and a
   computer: nothing should slide sideways.

### How to change a colour

Every colour has a name, set once in `assets/site.css`, section 2
("TOKENS"), and used everywhere else by that name. Change the code next
to the name — for example `--sky: #2A9AE0;` — and every place that uses
it changes. Never type a colour code anywhere else (the table under "The
colours" above says what each name is for).

### How to change a number

Every figure is typed into the page itself, and has a line in the page's
Sources part at the bottom, with its date.

1. Find the number on the page (search the file for it, e.g. `7.1%`).
2. Change it. If it sits in a chart, change its bar too: a bar's length is
   in its style, `style="--to: 65"` for 65% of the track (`--from` too, for
   a range). The comment above each chart says how its bars are worked
   out.
3. Change its line in Sources: the date ("as of …") and the link, if the
   source changed.
4. Change the page's "Last updated" date (on an article) and
   `dateModified` in its structured data, to the same day, and the
   page's date in `sitemap.xml`.

The numbers that change on a timetable — the monthly NSE figures, the
quarterly fund returns and small savings rates — have their own
step-by-step list in `TODO.md`, section 0b, saying which page and which
part each one lives in. A calculator's starting numbers are written out
in full (the answer, its chart and the year-by-year table), so ask the
website chat to work them out again.

### Building blocks, and their names in the HTML

Copy from the page named in brackets.

- **The answer**: `<div class="answer"><p>…</p></div>`, straight under the
  H1 (`_template.html`). "Share as image" appears under the first one.
- **The answer drawn** (`instruments/epf/`): `<div class="answer
  answer-parts" data-share-text="…">` with one `<div class="part">` per
  part — `part-what` (what it is), `part-word` (a sign and the answer in a
  word or two), `part-why` (one line). Add `three-parts` for three.
  `data-share-text` holds the same answer in sentences, for the picture.
- **Signs**: `<span class="sign sign-yes">` ✓ green, "you may";
  `sign-no` ✗ grey, riba; `sign-differ` scales, scholars differ;
  `sign-open` ? no fatwa found; `sign-note` ! good to know; `sign-none` –
  not asked. The words beside a sign always say the answer too.
- **How it works, drawn** (`instruments/ppf/`): `<ol class="money-path">`
  with three `<li class="step">`, each with a `step-head` (an icon and a
  heading). Add `money-path-wide` when the middle step holds a chart
  (`instruments/epf/`).
- **A fatwa card** (`instruments/epf/`): `<div class="card fatwa">` — a
  heading saying where it is from (never who), its answers as a
  `<ul class="fatwa-answers">` of signs, one line, and its exact words in
  a `<details class="source">` "What the fatwa says".
- **The byline** (articles only): MAS's photo, name and
  `Last updated <time datetime="…">…</time>` (`_template.html`).
- **Read more**: `<details class="source"><summary>Read more</summary>
  <div class="source-body">…</div></details>` — closed until tapped.
- **Sources**: one `<details class="source sources" id="sources">` at the
  very end of `<main>`. Give each line an id (`<li id="src-epf-bands">`)
  and point its figures at it with `data-src="src-epf-bands"` — on the
  figure, its table, or anything around it. Tapping the figure then
  shows its source.
- **A figure**: `<span class="num">7.1%</span>` (same-width digits, so
  figures line up); `big-number` for one big number on its own. Put
  `data-count` on a number to make it count up.
- **The friendly line**: `<p class="ask-line">Still have a doubt?
  <a href="/ask/">Ask me</a></p>`, at the end of an article.
- **A blue band**: `<section class="section band">`. Never two in a row.
- **Rising cards**: put `reveal` on a section; its cards rise in turn.
- **An icon**: `<span class="icon" aria-hidden="true"><svg viewBox="0 0
  24 24">…</svg></span>`, drawn with `stroke="currentColor"`. On a phone
  an icon card (`card card-icon`) puts its icon beside the title.
- **A question tile** (`index.html`, `tools/`): `<a class="tile">` with an
  icon, `tile-question` and `tile-arrow`; `tile-name` for a small grey
  line under the question.
- **Bars** (`instruments/epf/`): `<div class="bars">`, one
  `<div class="bar-row" style="--to: 65">` per bar, holding `bar-label`,
  `bar-value` and `bar-track`. Bars that can go below zero:
  `bars bars-zero` (`compare/shariah-mutual-funds/`).
- **A few facts in a card** (`instruments/digital-gold/`):
  `<dl class="fact-list">`, one `<div>` with `<dt>` and `<dd>` per fact;
  `class="wide"` for a long one.
- **A table that becomes cards on a phone**: `<div class="table-scroll
  table-stack">`, and `data-label="…"` on each cell with its column's
  name.
- **A long list behind one button** (`screener/`): `<details
  class="list-toggle"><summary><span>See all …</span></summary><div
  class="list-body">…</div></details>`. A link to an id inside it opens it.
- **A video near the top** (`instruments/nps/`): `<a class="video-pick">`
  with the video's picture, its length and its title.
- **A calculator** (`sip-calculator/`): `<section class="section
  calculator-page">`, then `calculator-layout` holding the boxes
  (`calculator-boxes`, with a `calculator-row` or `calculator-pair` per
  box) and the answer (`calculator-answer`).
- **A green or red word in a heading**: `word-green` (only in an H1 or
  H2); `word-red` only for the cost of a loan.
- **Buttons**: `button` (solid green), `button-quiet` (outlined),
  `button-light` (white, on a dark band).
