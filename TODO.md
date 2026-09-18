# Purevesting website — open items

Everything the site still needs. Add to this file whenever something gets
parked. Delete a line when it's actually done.

Last updated: 18 September 2026

---

## 1. Missing data and missing sources

Every figure on the site is supposed to carry a source link and an "as of"
date. These are the places that don't yet.

- [ ] **Home page — the 205 of 500 figure.** The source link under the screen
      grid points at `#`, which goes nowhere. Needs the exact NSE page the
      205 came from. File: `index.html`, search for `href="#"`.
- [ ] **Compare page — the whole returns table is empty.** Every cell is a
      dash. Fill from ONE website, ONE date, Direct plan Growth option for all
      six funds. Different sites report Tata Ethical's 3-year return as 6.36%,
      7.28%, 10.91% and 12.49% — mixing them puts four different truths in one
      table. File: `compare/shariah-mutual-funds/index.html`.
- [ ] **Compare page — TASIS source link** points at `#`. Needs the real TASIS
      page URL and the date it was checked.
- [ ] **Compare page — Nippon scheme document link** points at `#`. Needs the
      scheme information document where Nippon states the scheme is not
      Shariah compliant. This is an important claim; it must be linked.
- [ ] **Nippon: dig into the contradiction properly.** The fund is literally
      called "Nifty 50 Shariah BeES" and tracks the Nifty 50 Shariah index,
      yet its own scheme objective says the scheme is not Shariah compliant.
      Find out why before writing about it at length. Things to check: whether
      the disclaimer is about the *fund wrapper* rather than the underlying
      index (cash holdings, securities lending, dividend income sitting in a
      bank account); whether it is a legal shield so the AMC is not held to a
      compliance claim it has no Shariah board to defend; whether it changed
      at some point in the fund's history; and whether any Shariah board has
      ever reviewed it. This is a genuinely strong video and a genuinely
      strong page — a fund sold under a Shariah name that disclaims being
      Shariah compliant — but only if the reason is established first rather
      than implied. Do not build a "gotcha" on a disclaimer that turns out to
      be routine legal boilerplate.
- [ ] **Compare page — The Wealth Company Ethical Fund.** Launch year is a
      guess (2025) and its Shariah advisor is marked "Not verified". Check the
      scheme documents and correct both.
- [ ] **Compare page — Quantum Ethical Fund.** Confirm whether it is currently
      certified by any board other than ShariahCap Advisors.

- [ ] **EPF page — four source links point at `#`.** The investment pattern
      (45–65% government securities etc.), the list of ETF indices EPFO tracks,
      the EPFO contribution rules, and Malaysia's Simpanan Shariah. The first
      two should come from the EPFO annual report or the Ministry of Labour
      notification rather than a news article — news reports of the pattern were
      consistent with each other, but a primary source is what the page claims
      to rest on. File: `instruments/epf/index.html`.
- [ ] **EPF page — confirm the latest declared interest rate.** EPFO declared
      8.25% for FY 2024–25. Sources disagreed on whether FY 2025–26 was also
      8.25% or not yet declared, so the page deliberately does not state a rate
      at all. Add one only once you have the EPFO announcement itself.
- [ ] **EPF page — confirm the Deoband fatwa reference.** The page cites Fatwa
      1084/915/B=1432 and links darulifta-deoband.com. Open it, confirm the
      number and wording match, and confirm the fatwa is still listed. A
      misquoted fatwa is the single worst error this site could publish.
- [ ] **EPF page — consider adding an Indian ruling on VPF specifically.**
      The two rulings quoted on VPF are from Sri Lanka and the UK. An Indian
      darul ifta ruling on VPF would be a stronger fit for the audience.

- [ ] **PPF page — two source links point at `#`.** The Ministry of Finance
      quarterly rate notification, and the Department of Economic Affairs page
      on the National Small Savings Fund.
- [ ] **PPF page — confirm the rate for the CURRENT quarter.** The page states
      7.1% as notified for April–June 2026. That was also the rate for
      January–March 2026. Check the July–September 2026 notification and update
      both the figure and the date if it moved.
- [ ] **PPF page — confirm both Deoband fatwa references.** Fatwa
      894/876/SN=09/1437 (interest is riba) and Fatwa 634/510/B=1431 (account
      may be used for tax saving). Open both, confirm the numbers and wording.
      Same standard as the EPF page: a misquoted fatwa is unrecoverable.
- [ ] **PPF page — look harder for a competing ruling.** The page states
      plainly that no ruling holding PPF interest is not riba was found, and
      says that is not a claim of consensus. Worth one more pass through Indian
      darul iftas before this page gets traffic.

## 2. Automating the data instead of typing it

Right now every number is typed into the HTML by hand. That doesn't scale
past a few pages, and hand-typed numbers go stale silently.

- [ ] Find a data source for fund AUM, NAV and returns that can be pulled
      automatically rather than retyped. Options worth checking: the AMFI
      daily NAV file (free, official, plain text), an AMC's own factsheet
      feed, or a paid market-data API.
- [ ] Decide where the numbers live. Likely answer: one JSON file per topic
      in `assets/data/`, which the page reads. Then updating a figure means
      editing one line in one data file, not hunting through HTML.
- [ ] Whatever the source, the rule stays: one figure per cell, same plan
      type, same date, one source.

## 3. Features still to build

In the order they matter, from the original plan.

- [ ] **Screen grid toggles.** The 500 squares are on the home page but static.
      Making companies drop out as you switch a screening rule on and off
      needs a list of which company fails which rule. Not built until that
      data exists.
- [ ] **Quarterly movement in the screen grid.** Show companies entering and
      leaving compliance quarter by quarter, with a year marker. Needs NSE
      index constituent lists at each rebalance date.
- [ ] **Market-cap treemap.** Each company a square sized by market cap,
      coloured by pass/fail on the screen — NOT by gain/loss. 205 of 500 pass
      by count, but by market value the passing share is far smaller, because
      the screen removes the very large financial companies. That gap is the
      whole point of the picture.
- [ ] **Share-card button** on every table and answer box, generating a
      branded image sized for WhatsApp and Instagram.
- [x] ~~**Source chips**~~ — built and in use on the EPF page: tap a scholar's
      position to read the exact wording it was issued in. Note the constraint:
      `<details>` cannot go inside a `<p>`, so a source chip sits between
      paragraphs, not mid-sentence.
- [ ] **Corrections log** at `/corrections/` — mistakes made and fixed.
- [ ] **Purification calculator**, embedded in the relevant instrument pages.

## 3b. Visual polish — logged, not yet actioned

Things MAS flagged while reviewing pages. One fixed, one still open.

- [x] ~~**Too much empty space between sections.**~~ FIXED 18 Sep. Three
      spacings were stacking before every heading: the first section's bottom
      padding, the next section's top padding, and the heading's own
      margin-top — 72+72+40 = 184px on desktop. Now one clean 72px break
      (48px phone). Fixed globally in `site.css`, applies to every page.
      Original note kept below for reference:
      ~~**Too much empty space between sections on the compare page.**~~
      Specifically: a big gap between the contents-list and "What each fund
      is", and again before "Size and returns". Worth checking whether this
      is `--section` spacing stacking up around the `.toc` nav, or something
      more specific to that page's structure. The EPF page's answer box was
      already tightened once for a similar reason — check whether the same
      fix applies here, or whether the empty table (all dashes, section 1
      above) is what's making the "Size and returns" section look
      disproportionately tall and empty.
- [ ] **Bring back the green dot** that sat next to "Purevesting" in the
      original preview's logo lockup (top-left, beside the wordmark). It was
      dropped when the real logo icon replaced the text-only wordmark. MAS
      liked it and wants it back — figure out where it fits now that there's
      an actual logo image to the left of the text as well.

## 4. Pages not built yet

- [ ] `/methodology/` — the two screening steps, the AAOIFI limits with
      sources, an interactive example.
- [x] ~~`/instruments/epf/`~~ — built. Still needs its four source links.
- [x] ~~`/instruments/ppf/`~~ — built. Still needs its two source links.
- [ ] `/instruments/nps/`, `/instruments/digital-gold/`,
      `/instruments/sukanya-samriddhi/` — all three are already listed as rows
      on the `/instruments/` index marked "Page being written". When each one
      goes live, turn its row's instrument name into a link and replace the
      "Page being written" cell.
- [x] ~~`/instruments/`~~ — built 18 Sep, and the "Instruments" link is now
      LIVE in the header and footer of every page. It is not just a list: it
      carries a summary table of where the rulings land, and the
      compulsory-vs-voluntary through-line that runs across instruments.
- [ ] `/newsletter/` — a dedicated page, separate from the footer form.
- [ ] When each page goes live: turn its greyed-out "soon" line on the home
      page into a real link, turn its row on `/instruments/` into a link, and
      uncomment its link in the header nav if it is a top-level section.
- [ ] **Header nav is now Instruments | Compare.** Methodology and Newsletter
      are still commented out in every page's header, waiting on those pages.

## 5. Analytics and tracking

- [ ] **Cloudflare Web Analytics.** One script tag, no cookies, no consent
      banner needed. The tag is already sitting commented out at the bottom of
      every page — just needs the real token pasted in. Get it from:
      Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site.
- [ ] **Google Search Console.** This is not analytics — it is what shows
      which searches people are finding the site through, and whether Google
      can index the pages. Verify via the Cloudflare DNS method. This matters
      more than analytics for an SEO-led site.
- [ ] **Google Analytics (GA4).** Optional and a real decision, not automatic.
      It gives much deeper reporting than Cloudflare, but it uses cookies,
      which means a consent banner for European visitors and a slower page.
      Decide whether the extra detail is worth it, or whether Cloudflare
      Analytics plus Search Console covers what's actually needed.

## 6. Sponsors and referral tracking

The plan: approach sponsors, and be paid commission on people who reach them
from the Purevesting site. That requires proving how many people came from
here, which needs building before the first sponsor conversation, not after.

- [ ] **Decide how attribution is proved.** Two realistic options:
      (a) the sponsor gives a unique link or coupon code used only on this
      site, and their own system counts it — simplest, and the sponsor trusts
      their own numbers over ours;
      (b) outbound clicks are counted on our side and the two sets of numbers
      are reconciled — more work, and sponsors tend to trust their own data
      anyway. Option (a) is almost certainly the right starting point.
- [ ] **Build outbound click counting** so there is a number to negotiate
      with, even if the sponsor's own count is the one that gets paid on.
- [ ] **Decide the disclosure wording.** A paid or commissioned link must be
      labelled as one, visibly, on the page it appears on. This is both a
      legal expectation and the entire basis of the site's credibility.
- [ ] **Decide where sponsored links are allowed to appear.** A strong default:
      never inside a comparison table, and never on a page that compares the
      sponsor against competitors. Keep them in clearly marked blocks.
- [ ] Check whether taking commission on financial products changes anything
      about SEBI positioning. Getting paid to send people to a financial
      product is a different activity from publishing educational content.
      Worth a lawyer's opinion before the first deal, not after.

## 7. Assets still needed

- [ ] **Photo for the byline** — WebP, square, two sizes: `byline-96.webp`
      (96×96) and `byline-192.webp` (192×192), both into `assets/img/`. Then
      uncomment the byline image block in `index.html`, `_template.html` and
      the compare page.
- [ ] **Social preview image** — 1200×630, saved as JPG not WebP (WhatsApp
      previews are unreliable with WebP), under 300KB, at `assets/og/default.jpg`.
      This image is the entire first impression when someone shares a link.
- [ ] Eventually, a different preview image per page type rather than one
      default for everything.

## 8. Housekeeping

- [ ] **Rename `.gitignore.txt` to `.gitignore`** — with the `.txt` on the end
      git ignores the file completely, so it is doing nothing right now.
- [ ] Decide whether this TODO file should stay public. Anything in the repo
      is reachable on the live site by anyone who guesses the address, and
      section 6 describes commercial plans. If that's not wanted, add it to
      `.gitignore` once that file is named correctly.
- [ ] Fill the Beehiiv publication address in the footer of every page —
      currently `YOUR-PUBLICATION.beehiiv.com`.
- [ ] Paste three real YouTube video IDs into the home page video cards.