# Purevesting website — open items

Everything the site still needs. Add to this file whenever something gets
parked. Delete a line when it's actually done.

Last updated: 5 October 2026

---

## 0. What's left for MAS (5 Oct)

Only things that need MAS himself: a setting only he can reach, or a
decision only he can make.

- [x] ~~**Create the site's email address.**~~ DONE by MAS: he made
      **salam@purevesting.com** in Zoho Mail (not hello@, as first planned).
      Every page now uses salam@ (2 Oct).
- [x] ~~**1. Test both forms on purevesting.com/ask/.**~~ DONE by MAS,
      5 Oct. One small setting to check if it isn't done yet: in the
      Web3Forms dashboard, set how long it keeps copies of messages to the
      shortest option.
- [x] ~~**2. Test the newsletter sign-up on purevesting.com/newsletter/.**~~
      DONE by MAS, 5 Oct. Already decided: double opt-in off (MAS, 1 Oct).
      Beehiiv's second script, "attribution tracking", was left out on
      purpose: the site adds no tracking scripts.
- [x] ~~**3. Check the link preview.**~~ DONE by MAS, 5 Oct. Every page now
      has its own preview image (5 Oct batch), so test one inner page the
      same way once that batch is live: paste
      https://purevesting.com/instruments/epf/?v=3 into a WhatsApp chat
      with yourself — the `?v=3` stops WhatsApp reusing an old preview.
- [ ] **4. Fix the purevesting.in redirect — it still answers 302 (checked
      2 Oct, after the 301 rule showed "Active").** Cloudflare runs Redirect
      Rules before Page Rules and Bulk Redirects, and the first Redirect Rule
      that matches wins. So if the 301 rule were catching visits to
      purevesting.in, visitors would get a 301. They don't, so something is in
      its way. Check in this order:
      1. In Cloudflare, pick **purevesting.in** (not purevesting.com) from
         the list of sites → Rules → Overview. Is the 301 rule listed there?
         A rule saved under purevesting.com never sees visits to the .in
         address. If that's where it is, make it again under purevesting.in
         and delete the one under .com.
      2. On that same Overview page: is there more than one redirect rule?
         The one higher in the list wins. If an older 302 rule sits above the
         new one, delete the old one.
      3. Open the 301 rule and set it exactly like Cloudflare's own example
         for moving a whole domain: Request URL `http*://purevesting.in/*`;
         Target URL `https://purevesting.com/${2}`; Status code 301;
         "Preserve query string" ticked. The `http*` catches both http:// and
         https:// visits. Save, then Deploy.
      4. www.purevesting.in didn't respond at all when checked (2 Oct, twice).
         Add a second rule the same way, with Request URL
         `http*://www.purevesting.in/*` and the same Target URL.
      5. Then tell the website chat "check the .in redirect". A browser
         doesn't show 301 or 302, but Claude can check it from outside.
- [x] ~~**5. Search Console: request indexing of the home page**~~ DONE by
      MAS, 5 Oct. Once the 5 Oct batch is live, request indexing once more
      for the home page and for the new /about/ page, so Google reads the
      new site name, logo and description sooner — section 5.
- [ ] **6. Bing Webmaster Tools — from about 7 October**, once Search Console
      has run for a week — section 5.
- The flagship-videos item is now a monthly job — see the next section
  (MAS, 5 Oct).
- [ ] **7. Use the same one-line description everywhere.** Google's AI
      answers describe Purevesting from the site AND from Instagram and
      YouTube. The site now says, in its About page, footer and structured
      data: "Purevesting is a startup building India's one-stop destination
      for halal finance." Put that same sentence (or one very close to it),
      plus a link to https://purevesting.com, in the Instagram bio, the
      YouTube channel description and the channel's links. Also add the
      relevant purevesting.com page link to each video's description — links
      from YouTube are the easiest way for Google to connect the two.
- [ ] **8. Purevesting GPT: send the link.** Google's AI answer lists
      "Purevesting GPT" (it read that on Instagram), but the site never
      mentions it. If it is live, send the link in the website chat and it
      gets a line on the About page (or a page of its own). If it is no
      longer live, take it off the Instagram bio, or Google will keep
      describing a tool nobody can find.
- [ ] **9. Google still shows a globe instead of the logo — wait, then
      check.** The site's side is correct (a 192×192 PNG listed first, plus
      favicon.ico with 16/32/48 sizes, all added 1 Oct), and since 5 Oct
      the home page also tells Google the site's name and logo. Google
      refreshes icons on its own schedule — usually days to a few weeks
      after it recrawls the home page. If it is still a globe after about
      two weeks: in Cloudflare, check Security → Bots, and make sure
      nothing there blocks Google's crawlers (Google fetches the icon with
      its own crawler, not a browser).

---

## 0b. Monthly to-do — and the other jobs that repeat

Jobs that never finish, because the data or the videos keep changing.
Each one says what to send or change, and where.

### Every month

- [ ] **Refresh the three video cards on the home page.** Send the links of
      the three videos to show (the newest flagship videos, or whichever
      three matter most that month) in the website chat. Each card needs
      the video's address, its thumbnail and its exact title — the comment
      above the cards in `index.html` explains the format. The same three
      go on the /about/ page's "Watch" list if they replace one there.
- [ ] **NSE factsheet figures.** NSE replaces its factsheets at the same web
      address at the start of each month. DONE for 30 September 2026 (in the
      1 Oct batch): 204 of the 501 companies pass (the Nifty 500 listed 501
      that month, so the grid has 501 squares). Each month, from the two
      factsheets (Nifty500 Shariah, and Nifty 500 at
      niftyindices.com/Factsheet/ind_nifty_500.pdf), update:
      - home page: the count, the two meta descriptions, the grid (one square
        per company), the "as of" date;
      - home page market-value switch: Infosys's weight in each factsheet,
        the "about 31%" wording (twice: source note and script), and
        VALUE_SQUARES in the script at the bottom of the page (share × number
        of squares);
      - methodology page: the "204" mentions and the sector table;
      - purification calculator: the "204 figure" line;
      - home page: the og:description (it quotes the count);
      - /halal-stocks/: the answer box, the "501" and "204" in the first
        section, the table (40.7% = count ÷ companies; 31.4% = Infosys's
        weight in the Nifty 500 ÷ its weight in the Shariah index), the
        financial services figures, every "as of" date, the meta and
        og:title, and the page's "Last updated" date and dateModified;
      - the preview images don't show the count, so they never need
        remaking for this.

### Every quarter

- [ ] **The compare page's returns table.** After each quarter-end, redo it
      the same way: one end date for every fund, the same date one, three
      and five years before, Direct plan Growth. Update fund sizes and
      expense ratios at the same time, re-check the row order and the
      "nearly nine times" sentence under "How to read this table".
- [ ] **Small savings rates.** Around 31 Mar, 30 Jun, 30 Sep and 31 Dec the
      Ministry of Finance announces the next quarter's rates. Open the
      Department of Economic Affairs link on the PPF page, then update the
      rate, the quarter and the "Last updated" date on the PPF and Sukanya
      pages (and their dates in `sitemap.xml`).

### Every few months

- [ ] **Digital gold storage terms.** Providers change these without
      notice. Re-open the three terms pages linked under the gold page's
      structure table and check the free periods (2 / 5 / 5 years) and the
      10-year delivery rule.

---

## 1. Missing data and missing sources

Every figure on the site is supposed to carry a source link and an "as of"
date. These are the places that don't yet.

- [x] ~~**Home page — the 205 of 500 figure.**~~ FIXED 24 Sep. The source
      link now goes to NSE's Nifty500 Shariah factsheet, which lists 205
      constituents as of 31 August 2026.
- [x] ~~**Home page and compare page — "behind the Nifty 500" has no
      source.**~~ FIXED 1 Oct. The Nifty 500 factsheet is at
      niftyindices.com/Factsheet/ind_nifty_500.pdf. Both factsheets for
      30 September 2026 confirm the Shariah index is behind over 1 and 5 years
      (total return −3.87% vs −2.03%, and 5.52% vs 9.04% a year) and that
      financial services are 30.58% of the Nifty 500 and 0.18% of the Shariah
      index. The claim that this is the *main reason* had no source, so it is
      gone; both pages now state only the facts, and the compare page shows
      the two indices in a small table. Logged in the corrections log.
- [x] ~~**Compare page — the returns table is empty.**~~ FILLED 1 Oct.
      Returns are worked out from each fund's NAV as reported to AMFI
      (Direct plan, Growth; the Nippon ETF has one plan), 30 Sep 2026 against
      30 Sep 2025, 2023 and 2021, annualised for 3 and 5 years. Checked
      against Value Research and Groww where they show the same figure (Tata
      Ethical 3 years 3.8%, 5 years about 5.5%). Fund size and expense ratio
      from Value Research's fund pages. Rows were re-ordered by fund size —
      the UTI fund was out of place — and that is logged. The NAVs used are
      in a comment under the table.
- The quarterly redo of the returns table moved to section 0b (5 Oct).
- [x] ~~**Compare page — TASIS source link.**~~ DONE 1 Oct: TASIS's home page
      says Tata Ethical and UTI Nifty 500 Shariah Index Fund are the only
      mutual funds it certifies, and that Taurus Ethical Fund is not certified
      by TASIS.
- [x] ~~**Compare page — Nippon document link.**~~ DONE 1 Oct: Nippon's own
      product note (February 2026) says the scheme "is not a Shariah compliant
      scheme", has not appointed a Shariah board and does not follow any
      dividend purification process. Because of this, the page no longer
      calls all six funds Shariah-compliant or says all six have a board —
      logged in the corrections log.
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
      be routine legal boilerplate. UPDATE 1 Oct: the product note gives
      the fund house's own reason — no Shariah board and no purification at
      the fund level; the index itself is screened by TASIS for NSE. Still
      open: whether it ever had a board, and whether it changed over time.
- [ ] **Compare page — The Wealth Company Ethical Fund's board.** Launch
      year confirmed 1 Oct: launched 14 October 2025, first NAV 17 October
      2025. Its own fund page says it follows "select Shariah principles",
      uses the Nifty 500 Shariah TRI as its benchmark, and names no board, so
      the page says "None named" (2 Oct). Still worth checking its scheme
      information document for a Shariah board; if one is named, change the
      chip and the source note.
- [x] ~~**Compare page — Taurus and Quantum: ShariahCap has no source
      link.**~~ CORRECTED 2 Oct. Neither fund's own documents name
      ShariahCap or any other Shariah board: Taurus's scheme information
      document (28 Nov 2025) says it "may also seek guidance from identified
      ethical advisors", and Quantum describes its own screening. So the
      ShariahCap claim is gone, the board column reads TASIS / None named /
      Its own screening / TASIS / No board / None named, and the page says
      two of the six are certified by a Shariah board, both by TASIS. Logged
      in the corrections log.

- [x] ~~**EPF page — four source links point at `#`.**~~ DONE 1 Oct. Who
      notifies the pattern and which ETFs EPFO buys: the Labour Ministry's own
      statement (PIB, 2 Dec 2024). It says the pattern is notified by the
      Department of Financial Services, not the Labour Ministry as the page
      said — corrected and logged. Contributions: Code on Social Security,
      2020, section 16(1)(a) (the labour codes replaced the EPF Act on
      21 Nov 2025). Malaysia: KWSP's Simpanan Shariah page.
- [ ] **Compare page — the "Launched" column has no source link (found
      5 Oct).** Every other figure on the page has one. Add each fund's
      inception date from its own factsheet or scheme information document
      (or one source that lists all six), then remove `data-src="none"` from
      the column's heading so the years become tappable like the rest. Web
      search agrees with the years shown (e.g. Tata Ethical 1996), but the
      5 Oct session couldn't open the documents to link them.
- [ ] **PPF page — open the scheme rules link once (added 5 Oct).** The
      deposit limits and the lock-in now cite the Public Provident Fund
      Scheme, 2019, as published by India Post. The 5 Oct session found it
      by web search, which quoted the scheme's own wording (₹500 minimum,
      ₹1,50,000 maximum a year, 15 years, then 5-year blocks), but it could
      not open the PDF itself. Open it once and check it loads.
- [ ] **EPF page — the bands rest on Business Standard (20 Jul 2026).** The
      primary source is the Department of Financial Services' pattern for
      provident funds (notification of 2 March 2015, No. 11/14/2013-PR, as
      amended in 2016 when the government-securities limit went to 65%).
      India Code and the department's site didn't open from here. Link the
      notification itself when you can open it.
- [ ] **EPF page — confirm the latest declared interest rate.** EPFO declared
      8.25% for FY 2024–25. Sources disagreed on whether FY 2025–26 was also
      8.25% or not yet declared, so the page deliberately does not state a rate
      at all. Add one only once you have the EPFO announcement itself.
- [x] ~~**EPF page — confirm the Deoband fatwa reference.**~~ CHECKED 1 Oct:
      Fatwa 1084/915/B=1432 is live at the linked address and the quote
      matches word for word. The ACJU and Dr Khalid Zaheer quotes on the same
      page also match (the ACJU's own spellings "admit" and "quiet" are shown
      corrected in square brackets, as before).
- [x] ~~**EPF page — Darul Ifta Birmingham's VPF quote not yet checked.**~~
      CHECKED 2 Oct against the page text MAS copied from the ruling: both
      sentences match. The page now names the ruling in full: Fatwa ID
      05248, answered by Mufti Eunus Ali, 17 April 2021.
- [ ] **EPF page — consider adding an Indian ruling on VPF specifically.**
      The two rulings quoted on VPF are from Sri Lanka and the UK. An Indian
      darul ifta ruling on VPF would be a stronger fit for the audience.

- [x] ~~**PPF page — two source links point at `#`.**~~ DONE 1 Oct: the
      Department of Economic Affairs' small savings page (it lists every
      quarter's office memorandum) and the Indian Economic Service's
      Arthapedia page on the National Small Savings Fund.
- [x] ~~**PPF page — confirm the rate for the CURRENT quarter.**~~ DONE 1 Oct:
      the office memorandum of 30 Sep 2026 kept every rate unchanged for
      October–December 2026 — PPF 7.1%, Sukanya 8.2%. Both pages updated.
- The quarterly small savings rates check moved to section 0b (5 Oct).
- [x] ~~**PPF page — confirm both Deoband fatwa references.**~~ CHECKED
      1 Oct: both numbers and both quotes match. One wording fix: the page
      said the second questioner wanted "the Section 80C deduction"; the
      question itself says he wanted to save income tax through a PPF
      account, so the page now says that.
- [ ] **PPF page — look harder for a competing ruling.** The page states
      plainly that no ruling holding PPF interest is not riba was found, and
      says that is not a claim of consensus. Worth one more pass through Indian
      darul iftas before this page gets traffic.

- [x] ~~**NPS page — three source links point at `#`.**~~ DONE 1 Oct, and
      checking them showed the page was out of date: asset class A was merged
      into C and E in December 2025 (three classes now, not four); the equity
      class buys large-company shares directly rather than tracking indices;
      since October 2025 non-government subscribers can pick pension fund
      schemes with up to 100% equity; and central government staff can choose
      75% equity while young. All corrected and logged. PFRDA's own site
      blocks automated reading, so the circulars are linked from the
      record-keeping agency's copies (npscra.proteantech.in).
- [x] ~~**NPS page — the exit table has a deliberate hole.**~~ FILLED 1 Oct
      from the Ministry of Finance's summary of PFRDA's amended exit
      regulations (PIB, 19 Dec 2025): the ₹8–12 lakh band, government
      subscribers and leaving before 60 are all on the page now.
- [ ] **NPS page — the Unified Pension Scheme isn't covered.** Since April 2025
      central government staff in NPS can opt for UPS, which pays an assured
      pension. That is a different structure with its own Shariah question.
      Worth a section (or its own page) later.
- [ ] **NPS page — the annuity question has NO ruling attached.** This is the
      biggest genuine gap on the site. The page says plainly that no ruling on
      the NPS annuity requirement was found, and does not substitute a general
      insurance ruling for one. Worth asking a mufti directly — it would be
      original, citable material nobody else has, and it is the part of NPS
      that is forced rather than chosen.
- [x] ~~**NPS page — confirm the IslamWeb fatwa.**~~ CHECKED 1 Oct: number,
      date and wording all match; the questioner is a Karnataka government
      employee for whom NPS is compulsory, as the page says.

- [x] ~~**Digital gold page — upgrade three sources to primary ones.**~~
      DONE 1 Oct: SEBI's own press release (No. 70/2025); RBI's SGB FAQ plus
      the Government's July 2025 Rajya Sabha reply on the pause; and the
      providers' own pages for the structure table. The providers' pages
      showed one error — MMTC-PAMP keeps the gold in its own vaults, not a
      third party's — corrected and logged.
- [x] ~~**Digital gold page — two rows still rest on OroPocket.**~~ DONE
      2 Oct; OroPocket is no longer cited anywhere. GST: 3% from Business
      Standard (the GST Council kept it in September 2025); not refunded when
      you sell, from Aditya Birla Capital's guide. Storage, from each
      provider's own terms: free for 2 years at SafeGold (from the terms text
      MAS copied, since SafeGold's site refuses automated reading) and 5 at
      MMTC-PAMP and Augmont; after that it is charged for, the charge can come
      out of your gold, and MMTC-PAMP can buy the gold back. Augmont also
      requires delivery within 10 years. The old row ("then a small annual
      fee") was logged in the corrections log.
- The storage-terms check moved to section 0b (5 Oct).
- [x] ~~**Digital gold page — confirm the Islamonweb quotes word for
      word.**~~ CHECKED 1 Oct: both quotes, the author, title and both dates
      match.
- [ ] **Digital gold page — ask the providers the two AAOIFI questions.**
      Is a customer's gold tied to a specific, serial-numbered bar? Is a
      certificate issued on the day of purchase? The page says public
      information does not show either. A written answer from MMTC-PAMP,
      SafeGold or Augmont would be original, citable material — same idea as
      asking a mufti about the NPS annuity.

- [x] ~~**Sukanya page — replace the Wikipedia source.**~~ DONE 1 Oct with
      something better than India Post's page: the scheme rules themselves
      (Sukanya Samriddhi Account Scheme, 2019, as amended in 2020), published
      by the Finance Ministry's National Savings Institute. They settle the
      two open questions: the guardian runs the account until the girl turns
      18; and an account in default that is never revived still earns the
      scheme's rate until it is closed (now on the page). Small wording fix:
      the girl must be "under 10" at opening, not "up to 10".
- [x] ~~**Sukanya page — confirm the two quotes.**~~ CHECKED 1 Oct: the PTI
      quote matches (its typo "aiding" is still shown corrected as
      "[adding]"), and so does the TASIS answer, which is dated 17 September
      2022 (now on the page). One name fixed to match PTI: "Maulana", not
      "Mufti", Habiburrahman Khairabadi — he is described as the mufti of
      Darul Uloom Deoband.

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

- The monthly NSE factsheet update moved to section 0b (5 Oct).

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

- [x] ~~**Screen grid switch — by companies / by market value.**~~ BUILT
      1 Oct. Two buttons above the home page grid. "By market value" shows
      that the companies that pass are about 31% of the Nifty 500's value
      (against 41% by count). Worked out from the two NSE factsheets: Infosys
      is 1.83% of the Nifty 500 and 5.83% of the Shariah index, and both
      indices weight companies by free-float market value (the Shariah
      index's only caps are 33% per stock and 62% for the top three, far
      above Infosys), so 1.83 ÷ 5.83 is the Shariah index's share of the
      whole. This takes the place of the market-cap treemap.
- The per-rule switches for the screen grid were dropped (MAS, 5 Oct) —
  see section 9.
- [ ] **Quarterly movement in the screen grid.** Show companies entering and
      leaving compliance quarter by quarter, with a year marker. Needs NSE
      index constituent lists at each rebalance date.
- [x] ~~**Market-cap treemap.**~~ REPLACED 1 Oct by the "by market value"
      switch above, which makes the same point — 41% of companies pass, but
      only about 31% of the market's value — from NSE's own factsheets. A
      company-by-company treemap would need every company's market value,
      which NSE does not publish in a form the site can use.
- [x] ~~**Share-card button**~~ — built 30 Sep. A "Share as image" button
      sits under every answer box and every table (the code is
      `assets/share-card.js`, loaded on every page). It draws a 1080-pixel-wide
      picture — logo, heading, the answer or table, its source line, the page
      address and "not investment advice" — and opens the phone's share
      sheet; on a computer it downloads instead. Long tables show as many
      rows as fit and end with "…and N more rows on the page". Tables with
      more than five columns (the compare page's returns table has six) get
      no button. When a source note is too long for the picture, it keeps
      the part from "Source" onwards.
- [x] ~~**Share cards for the compare page's two big tables**~~ — DONE
      5 Oct. Cards now take tables up to 6 columns. A column can be left
      off a card with `data-share="skip"` on its heading (the first table
      drops "Fund house", which repeats the fund's name), a cell can say
      something shorter on the card with `data-share-text`, and a table
      with several source notes under it gets every source on the card.
      The card always uses the page's own row order (fund size).
- [x] ~~**Tap a number to see its source and date**~~ — DONE 5 Oct, on every
      page, by `assets/site.js` (section 2 of that file explains it). Each
      figure takes the source note nearest to it; `data-src` points a
      figure, a column or a table at a specific note instead, and
      `data-src="none"` marks something that isn't a sourced figure (the
      calculators' answers). Without JavaScript the figures are plain text
      and nothing changes.
- [x] ~~**Count-up**~~ — DONE 5 Oct: the home page's 204 counts up once, but
      only if it starts below the screen's edge; a number already on screen
      never animates. Mark any other whole number with `data-count`.
- Not built, on purpose (5 Oct): **table sorting** — six rows fit on one
  screen, and sorting by return is the one view the compliance rules
  warn against (a shared screenshot of it reads as a ranking); and the
  **ticker strip** — it would add movement without adding information.
  Both were allowed by the brief, not required.
- [x] ~~**Source chips**~~ — built and in use on the EPF page: tap a scholar's
      position to read the exact wording it was issued in. Note the constraint:
      `<details>` cannot go inside a `<p>`, so a source chip sits between
      paragraphs, not mid-sentence.
- [x] ~~**Corrections log**~~ — built 30 Sep at `/corrections/`, linked in
      the footer of every page and from the "Found something wrong here?"
      line on every instrument page and the methodology page. First entries
      logged 1 Oct (EPF, NPS, digital gold, and the compare and home pages)
      and 2 Oct (compare: ShariahCap; digital gold: storage), each with a
      "Corrected" line under the page's "Last updated" date. For the next:
      (1) fix the page; (2) add a card at the top of the log (the page has
      a ready-made example block to copy); (3) put a "Corrected on [date]"
      line next to the corrected page's "Last updated" date, linking to
      the log.
- [x] ~~**Purification calculator**~~ — built 30 Sep as its own page,
      `/purification-calculator/`, rather than inside the instrument pages:
      people search for it by name, and a page of its own can be shared.
      Linked from the methodology page's purification section and from the
      home page's "By goal" list. It shows the three common methods side by
      side (dividend-based, AAOIFI, and TASIS's modified AAOIFI), with the
      formulas as TASIS sets them out.
- [x] ~~**Feedback form and "Ask a question" form (MAS, 30 Sep)**~~ —
      built 30 Sep at `/ask/`, linked from the footer of every page, the home
      page's "By question" list and the corrections page. Both forms go
      through Web3Forms (free up to 250 messages a month), which emails each
      one to the address that owns the access key. A hidden trap box catches
      simple spam robots. The question form says plainly that personal "should
      I buy this" questions can't be answered, and that questions may be
      answered publicly without the asker's name.
- [x] ~~**Connect the two forms to Web3Forms.**~~ DONE 2 Oct: MAS made the
      Web3Forms account with salam@purevesting.com, and its access key is in
      both forms in `ask/index.html`. The key is meant to be public — it only
      lets people send messages to that inbox. Still to do after the push:
      the test in section 0, and the shorter retention setting.
- [ ] **Halal finance near you: loans, cooperatives, by city (MAS, 30 Sep).**
      The site so far covers investing. This adds borrowing and saving
      without interest:
      - **Loans and credit without interest** — Islamic cooperative credit
        societies, interest-free loan (qard hasan) groups, halal wallets,
        and whatever else actually exists and can be checked.
      - **By city** — a visitor picks their city and sees the options near
        them, as a map or a list.
      - **Every Islamic cooperative in India, mapped** — name, city, what it
        offers, its registration number and the law it is registered under.
      Before building it:
      - The data is the whole job. There is no official list of Islamic
        cooperatives. Places to start: each state's Registrar of Cooperative
        Societies, the Central Registrar's list of multi-state cooperative
        societies, and known networks of Islamic cooperatives — then confirm
        every entry directly before it goes up.
      - List only what can be checked, and describe rather than recommend,
        like the rest of the site. To many visitors a listing reads as an
        endorsement. Schemes sold to Muslims as halal have collapsed before
        and taken people's savings — IMA in Bengaluru, 2019, is the
        best-known — so each listing shows its registration and regulator.
      - Explain what protects a member's money. A credit cooperative society
        is not a bank, and deposit insurance (DICGC) covers banks, not these
        societies. Confirm this and say it plainly on the page.
      - Never take a fee from a listed cooperative without disclosing it on
        the page (see section 6).

## 3b. Visual polish

Things MAS flagged while reviewing pages. Both done.

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
- [x] ~~**Bring back the green dot**~~ — DONE 2 Oct. The logo icon now
      sits where the dot used to be, so the dot moved to the end of the
      wordmark, on the baseline like a full stop: "Purevesting." with a green
      dot. It is one rule in `site.css` (`.site-logo::after`), so the header
      HTML is unchanged, and the social preview image has it too. If MAS
      remembers it somewhere else, it's a one-line change.

## 4. Pages not built yet

- [x] ~~`/methodology/`~~ — built 24 Sep. The two screening steps, the
      AAOIFI and NSE limits with sources, a worked example you can change,
      purification, what the screen does to the real market, and why halal
      stock lists disagree. Linked from the home page's "By goal" list. Its
      header link is still switched off — see the nav item below.
- [x] ~~`/instruments/epf/`~~ — built. Source links filled 1 Oct.
- [x] ~~`/instruments/ppf/`~~ — built. Source links filled 1 Oct.
- [x] ~~`/instruments/nps/`~~ — built 18 Sep. Source links filled and
      page brought up to date 1 Oct; the annuity question is genuinely open.
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
- [x] ~~`/newsletter/`~~ — built 24 Sep. What an issue contains, the
      sign-up form, and links to the methodology, instruments and compare
      pages. Once issues exist, add a link to the Beehiiv archive of past
      issues.
- [x] ~~`/about/`~~ — built 5 Oct. What Purevesting is (the one-line
      description Google should use), what it covers, how every page is
      made, who runs it, and where else Purevesting lives. Linked from every
      byline and from the footer.
- [x] ~~`/halal-stocks/`~~ — built 5 Oct: "How many Indian stocks are
      halal?" as its own page, so that search lands on a page made for it
      instead of the home page. Built only from figures the site already
      sources (NSE's factsheets and methodology). Linked from the home
      page, the methodology page and the footer.
- [ ] **Pages worth adding next** — each needs a session that can open
      websites (the 5 Oct one couldn't), because every Shariah position
      has to be quoted from the ruling itself:
      1. **Zakat on shares and mutual funds** — the channel already covers
         Zakat, and people search for it by name, especially before
         Ramadan;
      2. **Is a mutual fund SIP halal?** — the home page's "soon" line;
      3. **The full list of the 204 companies** on /halal-stocks/, from
         NSE's monthly constituent file (adds a monthly job);
      4. **Interest in loans and EMIs** — on the channel, not on the site;
      5. **Purevesting GPT** — once MAS sends the link (section 0).
- [ ] When each page goes live: turn its greyed-out "soon" line on the home
      page into a real link, turn its row on `/instruments/` into a link,
      uncomment its link in the header nav if it is a top-level section, and
      add it to `sitemap.xml` (the file explains how).
- [x] ~~**Header nav.**~~ DONE 24 Sep. Every page now shows Instruments |
      Compare | Methodology | Newsletter in the header, and the same four in
      the footer. The compare page and `_template.html` got the missing
      "Shariah positions are quoted…" sentence in the same batch, so the
      header and footer are now identical on every page.

## 5. Analytics and tracking

- [x] ~~**Cloudflare Web Analytics**~~ — DONE 30 Sep, automatic setup:
      Cloudflare adds the counting script to every page by itself. The old
      commented-out snippet at the bottom of every page was removed on
      30 Sep and replaced with a one-line note saying so. Never paste a
      Cloudflare snippet into a page — it would count every visit twice.
- [x] ~~**Google shows a blank icon instead of the logo (MAS, 30 Sep).**~~
      Site side FIXED 30 Sep (`favicon-192.png` listed first, plus
      `favicon.ico`), indexing requested by MAS 5 Oct, and the logo and site
      name added as structured data 5 Oct. What's left is waiting for
      Google — see section 0, item 9.
- [x] ~~**Google Search Console**~~ — DONE 30 Sep. Once a week, open the
      Performance report (which searches found the site) and the Sitemaps
      page (`sitemap.xml` should show status "Success"). The first search
      data takes a few days to appear.
- [x] ~~**Google Analytics (GA4).**~~ DECIDED 25 Sep: not now. Cloudflare Web
      Analytics plus Search Console cover what the site needs at this stage.
      GA4 uses cookies, so it would need a consent banner for European
      visitors, and it adds a heavy script to every page. Revisit when a
      sponsor asks for audience detail Cloudflare can't give, or when paid
      campaigns start and sign-ups need tracking to their source.
- [x] ~~**Structured data (SEO), 5 Oct.**~~ Every page now carries a
      JSON-LD block that Google reads: the home page says the site is
      called "Purevesting" (so results stop saying "purevesting.com"), gives
      the logo (`/assets/img/logo-512.png`), the one-line description, the
      founder, and links the YouTube channel, Instagram and the newsletter
      as the same organisation; every article page names its author, its
      dates and its place in the site (breadcrumbs). The one rule to
      remember: when a page's "Last updated" date changes, change
      `dateModified` in its block to the same date.
- [ ] **Bing Webmaster Tools — after Search Console has run for a week.**
      Bing's results also feed other search engines, such as DuckDuckGo and
      Yahoo. Sign in at bing.com/webmasters and use the option to import from
      Google Search Console — it copies the site and the sitemap across.
- [x] ~~**Fix www.purevesting.com**~~ — CHECKED 30 Sep: www.purevesting.com
      now opens the site instead of the Cloudflare 522 error page.
- [ ] **purevesting.in redirect is still "temporary" (302).** It works, but
      a "permanent" redirect (301) is the correct signal to Google. MAS added
      a 301 Redirect Rule in Cloudflare, but on 2 Oct the address still
      answered 302, and www.purevesting.in didn't respond at all. What to
      check is in section 0, item 4.

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

- [x] ~~**Photo for the byline**~~ — DONE 2 Oct from MAS's photo:
      `byline-96.webp` and `byline-192.webp` in `assets/img/`, and the byline
      image switched on in every page that has a byline.
- [x] ~~**Social preview image**~~ — DONE 2 Oct: `assets/og/default.jpg`,
      1200×630, 70 KB, JPG (WhatsApp previews are unreliable with WebP). The
      logo, "Purevesting." with the green dot, "Halal finance in India, made
      better", and a small grid like the home page's. Every page already
      points to it.
- [x] ~~Per-page preview images~~ — DONE 5 Oct: every page has its own
      1200×630 JPG in `assets/og/`, named after its address (e.g.
      `instruments-epf.jpg`), all under 80 KB. They are made from
      `og-template.html` (never published): ask the website chat to make
      one for each new page. The home page keeps `default.jpg`.
- [x] ~~Eventually, a different preview image per page type rather than one
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
      `.assetsignore`. CHECKED 24 Sep after the push: TODO.md, README.md,
      index-old.html, _template.html and the .git folder all give "page not
      found" on a fresh request.
- [x] ~~Fill the Beehiiv publication address~~ — DONE 30 Sep: every sign-up
      form (the footer on every page, and the top of `/newsletter/`) now
      goes to https://halaledge.beehiiv.com/subscribe.
- [x] ~~**Sign-up form test — FAILED (MAS, 1 Oct).**~~ FIXED 1 Oct: the
      email box is gone from the footer (it now has a "Subscribe to
      HalalEdge" button that goes to /newsletter/), and /newsletter/ has a
      "Subscribe on Beehiiv" button, so the email is typed once, on Beehiiv.
- [x] ~~**Beehiiv's embedded sign-up form.**~~ DONE 2 Oct: Beehiiv's own
      sign-up box now sits on `/newsletter/`, so people sign up without
      leaving the site. It loads only on that page; the footer button on
      every other page leads there. Without JavaScript, the page shows a
      "Subscribe on Beehiiv" button instead, and the line under the box links
      to Beehiiv's own sign-up page in case a browser's blocker stops the box
      from loading. Test it — section 0, item 2.
- [x] ~~Paste three real YouTube video IDs into the home page video
      cards.~~ DONE 2 Oct with three published videos: "Halal (ethical)
      investing kya hai?", "Muslims ne banaya tha duniya ka pehla bank" and
      the Zakat basics Short. Titles taken from YouTube itself.
- Swapping in the flagship videos is now a monthly job (MAS, 5 Oct) —
  see section 0b.

## 9. Obsolete — decided against

Kept here so nobody re-plans them by accident. Each says who decided and
why.

- ~~**Screen grid — one switch per screening rule.**~~ DROPPED by MAS,
  5 Oct. Turning the business test or the debt test on and off needs, for
  each company, which rule it fails. NSE and TASIS publish only the final
  list of companies that pass, not the reasons, so it would mean buying
  TASIS's screening data (or a market-data vendor's) — not worth it. The
  grid keeps its "by companies / by market value" switch, which is built
  from NSE's free factsheets.