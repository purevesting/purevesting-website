# Purevesting website — open items

Everything the site still needs. Add to this file whenever something gets
parked. Delete a line when it's actually done.

Last updated: 1 October 2026

---

## 0. End tasks for MAS — do these last (MAS, 1 Oct)

MAS will do these at the end. Do them in this order, because each one needs
the one before it.

- [ ] **1. Create the hello@purevesting.com address — in Zoho Mail (MAS's
      choice, 1 Oct; he already uses Zoho's free plan).** It is printed on
      every page (footer, corrections page, ask page, instrument pages), so
      until it exists every email sent to it bounces. Outline: in Zoho Mail,
      add the domain purevesting.com; Zoho shows a few DNS records (one to
      prove you own the domain, and the "MX" records that route mail to Zoho);
      add each one in Cloudflare → purevesting.com → DNS; then create the user
      "hello". Ask for the step-by-step version when you sit down to do it.
- [ ] **2. Connect the two forms on /ask/ to Web3Forms** — needs step 1. Full
      steps are in section 3 below ("Connect the two forms to Web3Forms").
- [ ] **3. Optional: Beehiiv's embedded sign-up form.** No longer urgent.
      MAS's test on 1 Oct showed Beehiiv ignores the email typed on our site,
      so people had to type it twice. Fixed the same day without Beehiiv: the
      footer button now goes to /newsletter/, and that page's button opens
      the Beehiiv sign-up page, where the email is typed once. The embed is
      an upgrade on top: people could sign up without leaving the site.
      What it is: a few lines of code, made by Beehiiv, that draw Beehiiv's
      own sign-up box inside our page. Steps (Beehiiv's help page, updated
      27 July 2026; works on the free plan):
      1. Log in to Beehiiv and open the HalalEdge publication.
      2. In the left menu: Subscribers → Subscribe forms.
      3. Click "Create new form". Click the pencil next to its name and call
         it "Website".
      4. On the Style tab, under Embed: Layout = Slim; embed type = Inline.
      5. Click the small arrow next to "Save changes" → "Save & get embed
         code", and copy the code it shows.
      6. Send the code in the website chat. It goes in place of the button on
         `/newsletter/` only — not in the footer, so Beehiiv's code doesn't
         load on every page.
- [ ] **4. Search Console: request indexing of the home page** (for the blank
      icon on Google) — section 5.
- [ ] **5. Bing Webmaster Tools** (after Search Console has run a week),
      **purevesting.in redirect to 301**, **byline photo**, **social preview
      image**, **three YouTube video IDs** — sections 5, 7 and 8.

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
- [ ] **EVERY QUARTER — the compare page's returns table.** After each
      quarter-end, redo it the same way: one end date for every fund, the
      same date one, three and five years before, Direct plan Growth. Update
      fund sizes and expense ratios at the same time, re-check the row order
      and the "nearly nine times" sentence under "How to read this table".
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
      the page still says "Not verified". Check its scheme information
      document for a Shariah board.
- [ ] **Compare page — Taurus and Quantum: ShariahCap has no source link.**
      The page says both are screened by ShariahCap Advisors. ShariahCap's
      site (checked 1 Oct) links itself to Taurus Ethical Fund's launch but
      doesn't mention Quantum. Find each fund's own document naming its
      Shariah board, link it, and confirm Quantum has no other board.

- [x] ~~**EPF page — four source links point at `#`.**~~ DONE 1 Oct. Who
      notifies the pattern and which ETFs EPFO buys: the Labour Ministry's own
      statement (PIB, 2 Dec 2024). It says the pattern is notified by the
      Department of Financial Services, not the Labour Ministry as the page
      said — corrected and logged. Contributions: Code on Social Security,
      2020, section 16(1)(a) (the labour codes replaced the EPF Act on
      21 Nov 2025). Malaysia: KWSP's Simpanan Shariah page.
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
- [ ] **EPF page — Darul Ifta Birmingham's VPF quote not yet checked.** Its
      website refuses automated reading. Open
      daruliftabirmingham.co.uk/is-a-voluntary-provident-fund-vpf-allowed-in-the-shariah/
      in a browser and compare the two sentences on the EPF page word for
      word.
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
- [ ] **EVERY QUARTER — small savings rates.** Around 31 Mar, 30 Jun, 30 Sep
      and 31 Dec the Ministry of Finance announces the next quarter's rates.
      Open the Department of Economic Affairs link on the PPF page, then update
      the rate, the quarter and the "Last updated" date on the PPF and Sukanya
      pages (and their dates in `sitemap.xml`).
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
- [ ] **Digital gold page — two rows still rest on OroPocket.** GST and
      storage. Neither SafeGold's FAQ nor MMTC-PAMP's or Augmont's pages state
      a storage period or fee, and SafeGold's terms page refused automated
      reading. Check each provider's terms in a browser; link them, or drop
      the storage row if no provider states it.
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

- [ ] **EVERY MONTH — NSE factsheet figures.** NSE replaces its factsheets
      at the same web address at the start of each month. DONE for
      30 September 2026 (in the 1 Oct batch): 204 of the 501 companies pass
      (the Nifty 500 listed 501 that month, so the grid has 501 squares). Each
      month, from the two factsheets (Nifty500 Shariah, and Nifty 500 at
      niftyindices.com/Factsheet/ind_nifty_500.pdf), update:
      - home page: the count, the two meta descriptions, the grid (one square
        per company), the "as of" date;
      - home page market-value switch: Infosys's weight in each factsheet,
        the "about 31%" wording (twice: source note and script), and
        VALUE_SQUARES in the script at the bottom of the page (share × number
        of squares);
      - methodology page: the "204" mentions and the sector table;
      - purification calculator: the "204 figure" line.

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
- [ ] **Screen grid — one switch per screening rule (needs data).** Turning
      the business test or the debt test on and off needs, for each company,
      which rule it fails. NSE and TASIS publish only the final list of
      companies that pass, not the reasons. Options: TASIS's paid stock
      screening service, a market-data vendor, or computing the ratios from
      every company's own accounts (a big job). Not built until that data
      exists.
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
- [x] ~~**Source chips**~~ — built and in use on the EPF page: tap a scholar's
      position to read the exact wording it was issued in. Note the constraint:
      `<details>` cannot go inside a `<p>`, so a source chip sits between
      paragraphs, not mid-sentence.
- [x] ~~**Corrections log**~~ — built 30 Sep at `/corrections/`, linked in
      the footer of every page and from the "Found something wrong here?"
      line on every instrument page and the methodology page. First entries
      logged 1 Oct (EPF, NPS, digital gold, and the compare and home pages),
      each with a
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
- [ ] **Connect the two forms to Web3Forms — END TASK, after
      hello@purevesting.com exists (section 0).** Until then, both forms say
      "This form isn't connected yet". Steps: (1) go to web3forms.com and
      click "Create your Form — Free"; (2) sign up with
      hello@purevesting.com — not the Gmail — because every message goes to
      the address that owns the key; (3) open the verification email and
      confirm; (4) copy the access key from the dashboard; (5) in
      `ask/index.html` replace `YOUR-WEB3FORMS-KEY` (it appears twice) with
      the key; (6) send a test question and a test feedback once it's live.
      Web3Forms also keeps a copy of each message — in its dashboard, set the
      retention period shorter than the default.
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
- [ ] **Google shows a blank icon instead of the logo (MAS, 30 Sep).**
      Two likely reasons:
      (1) Time. Google picks up a site's icon when it crawls the home page,
      and for a new site that can take days to weeks. To speed it up:
      Search Console → paste https://purevesting.com/ into the search bar at
      the top → Request indexing.
      (2) Format. Google's favicon guide lists the formats it reads (PNG,
      ICO, GIF, JPEG and a few others) and SVG isn't among them. Our main
      icon is an SVG, the only PNG icon is 32×32 (Google recommends bigger
      than 48×48), and there is no favicon.ico at the site root.
      FIXED 30 Sep on the site's side: `favicon-192.png` and `favicon.ico`
      (made from the logo) are in the main folder, and the 192×192 PNG is
      listed first in every page's head. Still to do: request indexing of the
      home page in Search Console, then wait — Google can take days to weeks
      to show the new icon.
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
- [ ] **Bing Webmaster Tools — after Search Console has run for a week.**
      Bing's results also feed other search engines, such as DuckDuckGo and
      Yahoo. Sign in at bing.com/webmasters and use the option to import from
      Google Search Console — it copies the site and the sitemap across.
- [x] ~~**Fix www.purevesting.com**~~ — CHECKED 30 Sep: www.purevesting.com
      now opens the site instead of the Cloudflare 522 error page.
- [ ] **purevesting.in redirect is "temporary" (302).** It works, but a
      "permanent" redirect (301) is the correct signal to Google. Low
      priority — switch it to 301 wherever that redirect was set up.

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
      The optional embed is end task 3 in section 0.
- [ ] Paste three real YouTube video IDs into the home page video cards.