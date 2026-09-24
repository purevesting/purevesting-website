# Purevesting website — open items

Everything the site still needs. Add to this file whenever something gets
parked. Delete a line when it's actually done.

Last updated: 24 September 2026

---

## 1. Missing data and missing sources

Every figure on the site is supposed to carry a source link and an "as of"
date. These are the places that don't yet.

- [x] ~~**Home page — the 205 of 500 figure.**~~ FIXED 24 Sep. The source
      link now goes to NSE's Nifty500 Shariah factsheet, which lists 205
      constituents as of 31 August 2026.
- [ ] **Home page and compare page — "behind the Nifty 500" has no source.**
      The home page says the Nifty500 Shariah index is behind the Nifty 500
      over 1 and 5 years, "largely because the screen removes about 31% of the
      market in financial services". The compare page repeats the 31%. Neither
      figure has a source. The Nifty500 Shariah factsheet (31 Aug 2026) only
      gives the Shariah index's own returns: price return 1.19 over 1 year and
      6.05 over 5 years, total return 2.27 and 7.33 (all %, as printed). Get
      the Nifty 500 factsheet for the same month-end — the obvious factsheet
      addresses on niftyindices.com say "page not found", so go through the
      site's Reports → Factsheets menu. Compare like with like (price with
      price, same dates), then keep, correct or delete the sentence. Delete
      "The comparison page shows both" either way — the compare page shows
      funds, not the two indices. Files: `index.html` (the grey line under the
      screen grid) and `compare/shariah-mutual-funds/index.html` (search for
      `31%`).
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
      January–March 2026. The 30 June 2026 announcement kept every small
      savings rate unchanged for July–September 2026, so 7.1% still holds —
      only the date and source line on the page need updating. (The Sukanya
      page already cites that announcement.)
- [ ] **PPF page — confirm both Deoband fatwa references.** Fatwa
      894/876/SN=09/1437 (interest is riba) and Fatwa 634/510/B=1431 (account
      may be used for tax saving). Open both, confirm the numbers and wording.
      Same standard as the EPF page: a misquoted fatwa is unrecoverable.
- [ ] **PPF page — look harder for a competing ruling.** The page states
      plainly that no ruling holding PPF interest is not riba was found, and
      says that is not a claim of consensus. Worth one more pass through Indian
      darul iftas before this page gets traffic.

- [ ] **NPS page — three source links point at `#`.** The PFRDA asset-class
      description, the PFRDA scheme preference rules (to confirm the 75%/50%
      equity caps), and the PFRDA exit and withdrawal regulations.
- [ ] **NPS page — the exit table has a deliberate hole.** It shows only the
      two bands both sources agreed on: under ₹8 lakh (no annuity) and above
      ₹12 lakh (min 20% annuity). The ₹8–12 lakh band was described
      differently by two sources, so it was left out rather than guessed.
      Government-subscriber and premature-exit rules are also missing. Get the
      PFRDA notification (reported as December 2025) and fill all of it from
      that one document.
- [ ] **NPS page — the annuity question has NO ruling attached.** This is the
      biggest genuine gap on the site. The page says plainly that no ruling on
      the NPS annuity requirement was found, and does not substitute a general
      insurance ruling for one. Worth asking a mufti directly — it would be
      original, citable material nobody else has, and it is the part of NPS
      that is forced rather than chosen.
- [ ] **NPS page — confirm the IslamWeb fatwa.** Fatwa 352687, dated
      9 September 2017. Open it and confirm the wording and number.

- [ ] **Digital gold page — upgrade three sources to primary ones.** Every
      link works, but three rest on secondary sources: the provider structure
      table (currently a comparison blog by OroPocket, a competing platform —
      replace with MMTC-PAMP, SafeGold and Augmont's own terms), the SEBI
      caution (currently All India Radio's report — replace with SEBI's own
      8 November 2025 press release), and the SGB status note (currently
      GoldenPi — replace with RBI's SGB FAQ).
- [ ] **Digital gold page — confirm the Islamonweb quotes word for word.**
      Ahammed Nijad PC, 26 March 2026. Note this is an analysis by a named
      author, not a fatwa — the page says so. Islamonweb is a different site
      from IslamWeb (cited on the NPS page).
- [ ] **Digital gold page — ask the providers the two AAOIFI questions.**
      Is a customer's gold tied to a specific, serial-numbered bar? Is a
      certificate issued on the day of purchase? The page says public
      information does not show either. A written answer from MMTC-PAMP,
      SafeGold or Augmont would be original, citable material — same idea as
      asking a mufti about the NPS annuity.

- [ ] **Sukanya page — replace two sources with India Post's scheme page.**
      The rate currently cites Upstox and the rules cite Wikipedia. Both work
      as pointers, but India Post is the primary source.
- [ ] **Sukanya page — one rule conflict to settle.** Wikipedia says the girl
      can run the account from age 10; a 2026 source says the guardian runs it
      until 18. The page uses 18, which matches the 2019 scheme. Confirm on
      India Post.
- [ ] **Sukanya page — confirm what a defaulted account earns.** The page
      says stopping deposits does not stop the interest. That is certain for
      years 15–21. For an account that goes into default before year 15,
      confirm in the 2019 scheme rules which rate it keeps earning.
- [ ] **Sukanya page — confirm the two quotes.** The Jamiat Ulama-i-Hind
      resolution (PTI, 30 March 2019 — quote and the four names) and the TASIS
      FAQ answer. The PTI quote has a typo, "aiding", shown on the page as
      "[adding]".

- [ ] **Methodology page — cite AAOIFI Standard 21 directly.** AAOIFI's own
      web page for the standard currently shows unrelated content, so the
      30% / 30% / 5% limits are quoted from an academic paper that cites the
      standard (Qadi, Sharma and Medda, arXiv, 2025). Get the standard's own
      text — AAOIFI publishes its Shari'ah Standards as a book — and cite it
      with clause numbers. File: `methodology/index.html`, search for
      `FILL IN`.
- [ ] **Methodology page — confirm NSE's methodology is the latest.** The
      NSE document the page links is dated January 2020. Check niftyindices.com
      for a newer version. If any limit changed, update step 2 AND the worked
      example (the 25% is also written into the small script at the bottom
      of the page).
- [ ] **Methodology page — find Dow Jones's announcement of its September
      2026 change.** The page says the Dow Jones Islamic Market indices went
      from a 33% debt limit to two limits under 30% on 18 September 2026. That
      comes from the September 2026 edition of Dow Jones's methodology
      document and its record of changes. If S&P Dow Jones Indices published
      an announcement of the change, link it next to the methodology as a
      second source. (S&P's separate Shariah index family shows 30% as well.)

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

- [x] ~~`/methodology/`~~ — built 24 Sep. The two screening steps, the
      AAOIFI and NSE limits with sources, a worked example you can change,
      purification, what the screen does to the real market, and why halal
      stock lists disagree. Linked from the home page's "By goal" list. Its
      header link is still switched off — see the nav item below.
- [x] ~~`/instruments/epf/`~~ — built. Still needs its four source links.
- [x] ~~`/instruments/ppf/`~~ — built. Still needs its two source links.
- [x] ~~`/instruments/nps/`~~ — built 18 Sep. Still needs its three source
      links, and the annuity question is genuinely open.
- [x] ~~`/instruments/digital-gold/`~~ — built 23 Sep. Covers physical gold,
      gold ETFs and SGBs in one comparison table as well.
- [ ] `/instruments/sovereign-gold-bonds/` — the planning pipeline lists the
      SGB "trap" (2.5% interest on top of the gold price) as its own priority
      video. The gold page covers it in one row and one paragraph; a full page
      can follow the video.
- [x] ~~`/instruments/sukanya-samriddhi/`~~ — built 23 Sep. Every row on
      the `/instruments/` index is now a live link.
- [ ] **Instruments for the first website draft: DONE at five pages** — EPF,
      PPF, NPS, digital gold, Sukanya Samriddhi (MAS's call, 23 Sep). This is
      not the final list. More instruments get added after the first draft,
      taken from the planning chat's pipeline doc (smallcases, foreign Islamic
      ETFs, REITs, savings accounts, insurance, crypto and the rest). The SGB
      page above is the natural first one.
- [x] ~~`/instruments/`~~ — built 18 Sep, and the "Instruments" link is now
      LIVE in the header and footer of every page. It is not just a list: it
      carries a summary table of where the rulings land, and the
      compulsory-vs-voluntary through-line that runs across instruments.
- [ ] `/newsletter/` — a dedicated page, separate from the footer form.
- [ ] When each page goes live: turn its greyed-out "soon" line on the home
      page into a real link, turn its row on `/instruments/` into a link, and
      uncomment its link in the header nav if it is a top-level section.
- [ ] **Header nav is still Instruments | Compare.** Methodology is built, but
      its header link stays commented out until the newsletter page exists.
      Then both links get switched on in one batch, so every page is
      replaced once instead of twice. In that same batch, fix the footer on
      the compare page and in `_template.html`: both are missing the sentence
      "Shariah positions are quoted from the bodies that issued them…" that
      every other page's disclaimer has (the home page got it on 24 Sep).

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

- [ ] **Commission links with tracking BOTH sides can trust (MAS, 23 Sep).**
      A commission deal needs a count of referred people that you and the
      sponsor both accept — not just the sponsor's own figure, and not just
      yours. Kinds of setup to look into: a neutral third-party affiliate
      network, where both of you log into the same dashboard; the sponsor's
      own affiliate platform with read-only access for you; a unique coupon
      code per channel, so every redemption is unambiguous; and UTM tags on
      every link, so the visits appear under Purevesting's name in the
      sponsor's own analytics. Before any deal, check the sponsor against the
      SEBI RA guide in project knowledge — once you are registered, every paid
      relationship must be disclosed as a conflict, and distribution
      commissions from your own research clients are barred (section 13,
      point 10). The items below are the starting notes on this.
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

- [x] ~~**Rename `.gitignore.txt` to `.gitignore`**~~ — checked 24 Sep: the
      file in the repo is already called `.gitignore`.
- [ ] **Stop publishing files that are only meant for the repo (found
      24 Sep).** The live site publishes everything in the repo folder. That
      includes this TODO file — anyone can read it at purevesting.com/TODO.md,
      section 6 included — and the hidden `.git` folder, which holds the whole
      history of the repo. `.gitignore` can't fix this: it decides what goes
      into git, not what Cloudflare publishes. The fix is the `.assetsignore`
      file in the repo root (sent 24 Sep). After pushing it, check that
      purevesting.com/TODO.md and purevesting.com/.git/HEAD both show "page
      not found". If you ever want this TODO public, delete its line from
      `.assetsignore`.
- [ ] Fill the Beehiiv publication address in the footer of every page —
      currently `YOUR-PUBLICATION.beehiiv.com`.
- [ ] Paste three real YouTube video IDs into the home page video cards.