# Purevesting website — open items

**Writing rules: see the top of README.md (set by MAS, 6 November 2026).**
They replace any older rule in this file that says otherwise. Each old
rule they replace is marked **REPLACED 6 Nov** below.

**Phase 1 closed on 12 October 2026.** What that session built is in
section 0c ("Built 12 Oct"); what it noticed but left alone is in
section 0d.

Everything the site still needs. Add to this file whenever something gets
parked. Delete a line when it's actually done.

Last updated: 8 November 2026 (part 4 of 4, the last: the five
instrument pages with the answer drawn, how each works as a drawing, the
fatwas as cards; /instruments/ as one-line cards; the hub, people and
legal pages much shorter; the ₹ sign in our fonts; the calculators'
whole answer on a small phone's first screen; the video's new title; the
steps for an automatic reply on /ask/ (section 0, item 14); clear code
and a README guide; see section 0h). On 7 November: part 3 of 4, fewer
words, more graphics — the screener's big answer, the long lists behind
one button, the fund cards, the two-step drawing, the calculators on one
screen, a video near the top where one fits (section 0g). Before that, on
6 November: part 2 of 4, the look — sky blue, drawings, light motion,
two fonts, the new menu, footer and home page (the look's rules are in
README.md under the writing rules; section 0f); and part 1 of 4, the cuts —
every page rewritten to MAS's writing rules (section 0e). Before that,
12 October 2026 (phase 1 closed: privacy, disclaimer and "page not
found" pages, /tools/ and /learn/, one menu for every screen, the
screener first, sourced SIP start, the boycott list trimmed to names,
reasons and sources, two missing sources — steps 1 to 7)

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
      (6 Nov: the footer and the About page now go on "…halal finance:
      investing, saving and borrowing", because Purevesting covers all of
      finance, not only investing. The bios can say the same.)
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
- [ ] **10. Install the app on your own phone (after the 6 Oct batch is
      live).** On Android: open purevesting.com/app in Chrome and tap
      Install. On an iPhone: open it in Safari, Share, Add to Home Screen.
      Open it from the home screen, open two or three pages, turn on
      airplane mode and open them again — they should still work, with a
      "You're offline" note at the bottom. Then tell people about it: say
      "purevesting.com/app" in videos and put it in the Instagram bio.
- [ ] **11. Ask Tech for Palestine before the boycott list gets big
      attention.** The /stop-the-genocide/ list is copied from their open
      dataset on GitHub (it credits them and links back), but the dataset has
      no licence file, so permission isn't written down anywhere. Open an
      issue on their GitHub repository, or email them, saying Purevesting
      shows their list with credit and asking if that's fine. If they say no,
      tell the website chat and the list comes down.
- [ ] **12. A lawyer's look at /stop-the-genocide/.** The page only repeats
      what the dataset says, in the dataset's words, with its sources ("listed
      by Tech for Palestine because…"), never a Purevesting verdict of its
      own. Even so, naming companies carries some risk: ask a lawyer to read
      the page once. **Since 6 Nov** each entry says "Why it's listed:"
      instead of "Listed by Tech for Palestine for:", and the "we add no
      judgement of our own" note is gone (README rule 4). The page still
      says at the top that the list comes from an open boycott dataset, and
      its Sources part names and links Tech for Palestine. Show the lawyer
      this version.
- [ ] **13. boycottisrael.org — send the right link.** That address is
      parked (checked 6 Oct: it forwards to a "domain for sale" style page),
      so the page doesn't link it. If MAS meant a different site, send its
      exact address and it can be added under "More lists and research".
- [ ] **14. Switch on the automatic reply for /ask/ (added 8 Nov, part 4).**
      MAS asked that someone who sends a question gets an automatic email
      back. The simplest way is Web3Forms' own **Autoresponder**: the forms
      on /ask/ already go through Web3Forms, and they already have the box
      it needs (named `email`), so **nothing on the site has to change**.
      But it is a paid feature: it needs the Pro plan (checked 8 Nov: about
      US$149 a year, shown as $12 a month paid yearly — check the price on
      web3forms.com/pricing before paying). Steps:
      1. Go to **app.web3forms.com** and log in with salam@purevesting.com.
      2. Upgrade to a plan whose list includes **Autoresponder** (Pro or
         higher; the free plan doesn't have it).
      3. Open the form whose access key starts **c8aa73dd** (the one /ask/
         uses) → **Settings** → **Autoresponder** → switch it on.
      4. Fill in: **From Name**: Purevesting. **Subject**: Got your message
         — Purevesting. **Intro text** (change any words you like):
         "Assalamu alaikum, and thank you for writing to Purevesting. Your
         message has reached me, and I read every one. If you left your
         email for a reply, I'll write back from salam@purevesting.com.
         Good questions may be answered in a video, the newsletter or on
         the site, but never with your name. — Moin Ali Syed".
         **Show a copy of their message**: Yes. **Logo**:
         https://purevesting.com/assets/img/logo-512.png
      5. Save. Test it on the live site (it doesn't work on a test copy):
         send a question on purevesting.com/ask/ with a personal email
         address (not salam@), and look in that inbox, and in spam.
      6. Then tell the website chat **"the auto-reply is on"**: it adds one
         sentence to /privacy/#forms (Web3Forms then also sends you one
         email) and changes the line under the email box to say you'll get
         a short note that it arrived.
      Good to know: the feedback form uses the same key, so people who
      send feedback get the note too — the wording above fits both. Only
      people who type an email address get it (the box is optional).
      Not used, and why: **Zoho Mail's out-of-office reply** answers the
      sender of each email, and Web3Forms' emails come from Web3Forms'
      address, not the asker's — so the reply would never reach them.
      **FormSubmit** (formsubmit.co) has a free auto-reply, but not for
      messages sent without leaving the page, and it makes every visitor
      pass a "not a robot" page on its site first; the forms would need
      rewiring. Say "use FormSubmit instead" if the price matters more.

---

## 0b. Monthly to-do — and the other jobs that repeat

Jobs that never finish, because the data or the videos keep changing.
Each one says what to send or change, and where.

### Every month

- [ ] **New video? One line in `videos/list.js` (since 24 Oct).** Every
      time a video goes up, add a line at the TOP of that file: the link,
      a `|`, then the title (the top of the file shows an example). The
      home page shows the newest three, and /videos/ shows every one —
      nothing else to change. To feature an older video on the home page,
      move its line to the top. The list was filled on 24 Oct with the 15
      newest uploads from the channel's feed plus two older ones; videos
      older than that can be added at the bottom. **Due now (8 Nov):** four
      Shorts are newer than the list (section 0h, "Noticed"). If a new
      video fits a page's topic, ask the website chat to put it near the
      top of that page too (as on NPS and digital gold).
- [ ] **NSE factsheet figures.** NSE replaces its factsheets at the same web
      address at the start of each month. DONE for 30 September 2026 (in the
      1 Oct batch): 204 of the 501 companies pass (the Nifty 500 listed 501
      that month, so the grid has 501 squares). **Due now:** the October
      factsheet (dated 30 October 2026) was already up on 6 Nov — it still
      lists 204 companies, but the weights and dates change. Each month,
      from the two factsheets (Nifty500 Shariah, and Nifty 500 at
      niftyindices.com/Factsheet/ind_nifty_500.pdf), update (changed
      6 Nov, part 2):
      - home page: the og:description (it quotes the count), and the date
        in the Sources part at the bottom.
        The big 204, the 501, the squares and the date in the search box
        are rewritten by the screener update (last item);
      - /halal-stocks/ (the "by market value" switch lives here since
        6 Nov): the answer box, the two big figures above the squares
        (since part 3 they sit straight under the answer; 40.7% = count ÷
        companies; 31.4% = Infosys's weight in the Nifty 500 ÷ its weight in
        the Shariah index), VALUE_SQUARES in the script at the bottom of the
        page (31.4% × number of squares), the financial services figures
        (two bars: change each number and the `--to` in its style), every
        "as of" date (the Sources part at the bottom has them), the meta and
        og:title, and the page's "Last updated" date and dateModified;
      - methodology page: the "204" mentions and the sector chart (each
        bar: its figure, and `--to` = its share ÷ the biggest share × 100,
        as the comment above the chart says);
      - the preview images don't show the count, so they never need
        remaking for this.
      - **the screener**: in the website chat, say "run the screener
        update". It runs `python3 scripts/update_screener.py`, which
        downloads NSE's two lists and rewrites /screener/ and the home
        page's search box with the new date (including the date in the
        screener's Sources part) and, since 6 Nov, redraws the squares —
        one per company, A to Z — on the home page and /halal-stocks/,
        with their two counts. Since part 3 the screener's list has two
        columns (the company and the answer; the NSE symbol rides on each
        row for the search), and the script also writes the "not halal"
        count. Then set the screener page's dateModified
        to the day of the update. The counts it prints must match the
        factsheet (204 of 501 for 30 Sep 2026). If NSE renames a company
        (as Zomato became Eternal), add the old name to the `ALSO` list in
        the script at the bottom of screener/index.html so people searching
        the old name still find it, and to `OLD_NAMES` just below it so the
        answer says "(Zomato is now Eternal)".

### Every quarter

- [ ] **The compare page's returns — six fund cards since part 3.** After
      each quarter-end, redo them the same way: one end date for every
      fund, the same date one, three and five years before, Direct plan
      Growth. In each card change the figure and its bar: the bar's
      `--from` and `--to` are 50 ± (return ÷ 15 × 50), so a loss goes left
      of the middle (the comment above the cards says the same). If any
      return goes beyond ±15%, widen the scale for every card, never one.
      A fund with no 1-year return yet says "Too new". Update fund sizes
      (in the cards) and expense ratios (under "Read more: what each fund
      costs") at the same time, re-check the card order (largest fund
      first), and change the "Returns to …" line above the cards and the
      dates in the page's Sources part. (The "nearly nine times" sentence
      went with "How to read this table" on 6 Nov.)
- [ ] **When the compare page's index figures change, change the SIP
      calculator's too (added 12 Oct).** The two quick-pick buttons on
      /sip-calculator/ use the compare page's index chart (#index-returns,
      a chart since part 3: each bar's `--from` and `--to` are
      50 ± (return ÷ 10 × 50)): Nifty500 Shariah 5.52% and Nifty 500
      9.04% a year over the last 5 years, as of 30 Sep 2026. Whenever
      those change, change these too, in `sip-calculator/index.html`: both
      buttons, the starting value of the "Return a year" box and its
      slider, the answer written out for the starting numbers (the value,
      its chart's ten columns and the year-by-year table under "Read
      more"), and the index line in the Sources part at the bottom (the
      comment above the buttons lists them). Ask the website chat to
      recompute the written-out answer.
- [ ] **Small savings rates.** Around 31 Mar, 30 Jun, 30 Sep and 31 Dec the
      Ministry of Finance announces the next quarter's rates. Open the
      Department of Economic Affairs link (in the PPF page's Sources part),
      then update the rate in "What you get" (the third card of "How PPF
      works" and of "How Sukanya Samriddhi works", since 8 Nov), the
      quarter in the Sources part, and the "Last updated" date and
      dateModified on the PPF and Sukanya pages (and their dates in
      `sitemap.xml`).

### Every few months

- [ ] **Digital gold storage terms.** Providers change these without
      notice. Re-open the three terms pages linked in the gold page's
      Sources part and check the free periods (2 / 5 / 5 years) and the
      10-year delivery rule (both under "Read more: storage, delivery and
      who regulates it", since 8 Nov).
- [ ] **The "Stop the genocide" list.** Check
      github.com/TechForPalestine/boycott-israeli-consumer-goods-dataset for
      new changes (last changed 19 Feb 2024 when copied on 6 Oct 2026;
      checked again 12 Oct 2026, unchanged). If it changed, say "run the
      boycott update" in the website chat: it runs
      `python3 scripts/update_boycott.py` and updates the page's counts, the
      "copied on" date and the "Last updated" date. Since 12 Oct the script
      writes only names, reason tags and source links — never the dataset's
      paragraphs (the top of the script says why).
- [ ] **Typical loan rates on the loan calculator.** The five quick-pick
      buttons (home 8.5%, car 9.5%, education 10.5%, personal 13%, credit
      card 42% a year) are rough typical rates, labelled as such, not quotes.
      Once or twice a year, check they still look typical; change them in
      the `TYPICAL` list in the script at the bottom of
      loan-calculator/index.html, and in the closed "Read more: the typical
      rates, and what is left out" under the answer (the comment above the
      calculator says the same).

---

## 0c. MAS's ideas — decided 6 Oct

### Built 6 Oct (steps 1 to 6, each pushed to main as its own commit)

- [x] ~~**Menus in the header, by topic.**~~ DONE (step 1). On a computer,
      hovering (or tabbing to) Instruments, Compare, Methodology or
      Newsletter opens a short menu; a new **Tools** menu and a highlighted
      **Stop the genocide** link show on computers only. Phones and tablets
      keep exactly the old header: a tap goes to the topic's page. Nothing
      was removed. All the menu links are plain links in the HTML of every
      page, so Google sees them and they work without JavaScript.
      REPLACED 12 Oct by one menu for every screen size (below).
- [x] ~~**Topic panels on the home page — only what exists.**~~ DONE
      (step 2). "Start here" right under the opening: **Invest**, **Save and
      retire**, **Tools**, **Learn and ask**. Add a panel (Loans, Zakat…)
      only once its pages exist. **REPLACED 6 Nov (part 2)** by six
      question tiles with icons; the link lists and the "soon" items are
      gone (MAS).
- [x] ~~**SIP calculator**~~ DONE (step 3): /sip-calculator/, monthly SIP or
      one-time lump sum, starts at ₹5,000 a month, 12% a year, 10 years;
      brand greens; year-by-year table; says plainly it's an illustration.
      Since 12 Oct it starts on a sourced past return, 5.52% (below).
- [x] ~~**Loan calculator**~~ DONE (step 4): /loan-calculator/, with quick
      picks for home, car, education, personal and credit-card loans
      (typical rates, labelled as rough), an **interest meter** that fills
      as interest grows against the loan, and the interest drawn in warning
      red. The red is used only on this page.
- [x] ~~**Screener, version 1**~~ DONE (step 5): /screener/ plus a search
      box at the top of the home page. All 501 Nifty 500 companies: 204 are
      in NSE's Nifty500 Shariah index, 297 aren't; anything outside the
      Nifty 500 shows "not screened yet — coming soon". Data as of NSE's
      30 Sep 2026 list. Monthly refresh: section 0b.
- [x] ~~**"Stop the genocide" page**~~ DONE (step 6): /stop-the-genocide/,
      426 entries from Tech for Palestine's dataset, searchable, each with
      the dataset's reason and sources; highlighted link in the computer
      menu, a card on the home page, a footer link. Open points for MAS:
      items 11 to 13 in section 0. Since 12 Oct each entry shows names,
      reason tags and source links only (below).
- Colour note: the brief's rule — never colour a real fund's returns —
  still holds for every table of real data. The calculators only colour
  the reader's own made-up numbers, which is not a verdict on any product.

### Built 12 Oct — phase 1 closed (steps 1 to 7, each pushed to main as its own commit)

- [x] ~~**Privacy, disclaimer and "page not found" (step 1).**~~ DONE.
      /privacy/ says in plain words what can leave a reader's phone and
      why: the /ask/ forms (Web3Forms), the newsletter box (Beehiiv), the
      three YouTube pictures on the home page, Cloudflare (hosting, and
      visit counting without cookies), and the pages the app saves on the
      phone; that nothing is sold; and how to ask for deletion. Written
      from what the code does — if a page starts loading something from
      another website, add it there. /disclaimer/: the footer disclaimer in
      full, plus Shariah positions quoted not issued, calculators as
      illustrations, figures changing after their date, outside links not
      endorsements; nothing about MAS's own investments (his call, 12 Oct).
      (**REPLACED 6 Nov:** the footer now has one short line; /disclaimer/
      is the one page that says it all.)
      404.html answers any address that doesn't exist (wrangler.jsonc:
      "not_found_handling"); hidden from Google, kept out of the sitemap.
      One line under each form on /ask/ and /newsletter/ links to /privacy/.
- [x] ~~**/tools/ and /learn/ (step 2).**~~ DONE. /tools/: one card per
      tool, plus "Check what I already hold — soon". /learn/: three groups
      of links. The home page's Tools panel heading links to /tools/ (its
      id="tools" stays, so old links still land there).
- [x] ~~**One menu for every screen size (step 3).**~~ DONE. Screener ·
      Instruments · Compare · Tools · Learn, on phones and computers; a
      green Subscribe pill (phones: the logo row; computers: just before
      "Stop the genocide"); no drop-downs on phones. The five words fit on
      one line at 360px and 390px; on a narrower phone that row scrolls by
      itself, never the page. Footer: Tools, Learn, Privacy and Disclaimer
      added. To add a page to a menu: one line in the right list, on every
      page — the header must stay identical everywhere. **REPLACED 6 Nov
      (part 2):** the words are now Stocks · Mutual funds · EPF & more ·
      Tools · Learn (one line from 320px up), and the footer is short —
      section 0f.
- [x] ~~**The screener first (step 4).**~~ DONE. Home page: the box right
      under the heading and badge, bigger and easier to tap, no autofocus;
      the long paragraph is now the one sentence the structured data uses.
      /screener/: the search and its answer straight under the heading,
      the introduction and byline below. Both on the first screen at
      390×844. (The byline is **REPLACED 6 Nov**: tools pages carry no
      name line.)
- [x] ~~**The SIP calculator's starting rate (step 5a).**~~ DONE. Quick
      picks: "Nifty500 Shariah, last 5 years: 5.52% a year", "Nifty 500,
      last 5 years: 9.04% a year" (the compare page's index table, same
      sources and date) and "Your own guess"; starts on 5.52%, labelled "a
      past return, not a forecast". Keeping them in step: section 0b.
      (The label is **REPLACED 6 Nov**: just "A past return", or "Your own
      guess" — README rule 4.)
- [x] ~~**"Stop the genocide": names, reasons and sources only (step
      5b).**~~ DONE. Each entry: the company and brand names, then "Listed
      by Tech for Palestine for:" with the dataset's reason tags, and the
      sources it cites. (**REPLACED 6 Nov:** each entry now says "Why it's
      listed:"; the top of the page says the list comes from an open
      boycott dataset, and its Sources part names and links Tech for
      Palestine — README rules 4 and 5.) The dataset's paragraphs are gone (they told
      readers what to do, and were its unlicensed wording); the page links
      the dataset once for its full wording. scripts/update_boycott.py
      writes the same, so an update can't bring them back. Search still
      finds all 901 names.
- [x] ~~**Two missing sources (step 6).**~~ DONE. The compare page's launch
      years now have sources, and the methodology page now cites NSE's
      current methodology, whose income limit is 2.5% — corrected and
      logged. Details in section 1.
- [x] ~~**Tidy-up (step 7).**~~ DONE. The six long titles shortened and
      every description cut to 160 characters or fewer, search phrase
      first; index-old.html deleted (git keeps its history). Final check:
      no broken links inside the site; every page fits at 360px and 390px
      with nothing sliding sideways; header and footer identical on all 27
      pages; every JSON-LD block parses; the sitemap lists every page
      except /offline/ and 404.html. Links to other sites: section 0d.
- Dates: a page's "Last updated" date changed only when its own content,
  title or description changed — not for the new menu and footer, which
  changed on every page (same as the 6 Oct menu batch).

### Later (needs research, data or decisions first)

- [ ] **Full screener (MAS's own).** MAS screens companies himself with a
      Python script (AAOIFI and NSE ratios from company accounts), checks
      the results by hand against apps such as Musaffa, and keeps a dated
      record. The site's screener then grows from NSE's 500 to every company
      MAS has screened. Claude can write the Python; the open question is
      where the company accounts come from (free exports or a paid feed).
- [ ] **Halal finance near you, by city** — merges with section 3's
      "loans, cooperatives, by city" item. A reader picks a city and sees
      halal options near them: Islamic cooperatives and interest-free
      credit societies, local halal products and services. **Needs deep
      research first** (a session with web access): which cooperatives
      exist, where, under which law and registration — every entry
      confirmed before it goes up.
- [ ] **Earning from it: referrals** (MAS, 6 Oct) — e.g. sending readers
      to a local mutual fund distributor, or to Zamzam Capital, for a
      referral fee. **Check before any deal**, because the rules here are
      strict: as far as known, a mutual fund distributor may not share its
      commission with someone who has no AMFI registration (ARN), and since
      2024 SEBI bars the firms it regulates from paid tie-ups with
      unregistered people who give advice or quote returns — education-only
      creators are the exception. So: confirm Zamzam Capital's SEBI
      registration and what it may pay; ask a lawyer; consider getting an
      ARN (the NISM V-A exam). Every paid link labelled as paid, on the page
      (section 6).
- [ ] **Portfolio checker** (later, MAS's idea): a reader loads the
      holdings file from their broker app (Zerodha, Groww…) and the page
      checks each holding against NSE's Shariah list (and later MAS's own
      screening and the boycott lists). Built to run entirely on the phone —
      the file is never uploaded anywhere — which is also the easiest way to
      keep it private and legal.

### Web access for this session (MAS asked, 6 Oct)

Turned on by MAS on 6 Oct: the session can now reach niftyindices.com and
other sites. nseindia.com itself still refuses scripts (NSE blocks them, not
the session), so the screener uses niftyindices.com's files instead. MAS
asked to keep web use to what's necessary, because it costs credits. If a
new session can't reach a site: in the Claude Code app, open the cloud
environment's settings → **Network access** → a broader level, or
**Custom** with the sites added. Steps:
https://code.claude.com/docs/en/cloud-environments#network-access

---

## 0d. Noticed on 12 Oct — not changed

The 12 Oct session did only what its brief listed. These turned up along
the way; each needs a decision, or a session of its own.

- [x] ~~**NSE's income limit on /halal-stocks/**~~ — DONE 6 Nov
      (section 1).
- [ ] **Five titles are still 61–63 characters.** Step 7 shortened the six
      it listed. Also over 60: EPF (63), /instruments/ (61), PPF (61),
      /newsletter/ (63) and the SIP calculator (63). Shorter versions,
      search phrase first: "Is EPF halal? What scholars say, and where
      they differ" (54); "Is it halal? Indian financial instruments, one
      by one" (53); ~~"Is PPF halal? What Deoband ruled, and why it
      differs" (52)~~ — REPLACED 6 Nov: never name a madrasa (README
      rule 1), so the PPF title no longer names one; "HalalEdge: a free weekly email on halal investing
      in India" (58); "SIP calculator with lump sum: free, year by year"
      (48). Say "shorten the other five titles" to have it done.
- [ ] **Dead source links on /stop-the-genocide/ (checked 12 Oct).** Seven
      sources the dataset cites no longer open (page not found, or a broken
      certificate on the other site), under 17 entries: Adidas, Bershka,
      Diesel Frangrances, Giorgio Armani Beauty, Indigo Books, Loreal,
      Massimo Dutti, Mugler Beauty, Oracle, Prada Beauty, Pret-a-manger,
      Pull&Bear, Ralph Lauren Frangrances, Sudocrem, Viktor & Rolf Beauty,
      YSL Beauty and Zara. They are the dataset's own links, so they stay
      as copied; if Tech for Palestine fixes them, the next "run the
      boycott update" brings the new ones. The 134 links to
      buyisraelitech.com couldn't be checked from the session at all (that
      site's security certificate fails the session's checks): open one or
      two in a browser. Checked again 8 Nov (part 4): 8 of the dataset's
      links don't open (adidasunderwear.com twice, bdsmovement.net's
      L'Oréal page, heseg.com, jnjcareers.co.il, calcalistech.com,
      foa.org.uk's Pret page, tevauk.com), and buyisraelitech.com's 134
      still fail the certificate check here.
- [ ] **Two government links couldn't be checked from the session**, for
      the same certificate reason: the Department of Economic Affairs'
      small savings page (dea.gov.in, on the PPF and Sukanya pages) and the
      Sukanya scheme rules (nsiindia.gov.in). Open each once in a browser.
      Still the same on 8 Nov; and India Code (indiacode.nic.in, the Code on
      Social Security on the EPF page) took too long to answer from here —
      open that one too.
      About 60 other outside links (Reuters, Instagram, Bloomberg, Value
      Research and others) refuse automated checks; that is normal for big
      sites and doesn't mean they're broken. Every other outside link
      opened, and every link inside the site works.
- [x] ~~**/ask/ still has its own "What happens to what you send" section**
      at the bottom, which now repeats /privacy/. It could link to
      /privacy/, or shrink to one line.~~ DONE 6 Nov: it is one line now,
      "Rather write directly? Email me at salam@purevesting.com".
- [x] ~~**Home page: the "Learn and ask" panel heading** could link to
      /learn/, the way the Tools panel heading now links to /tools/.~~
      Gone with the panels (6 Nov, part 2).
- [ ] **Disclaimer — MAS's own investments.** MAS chose on 12 Oct to leave
      this out for now. If he later wants a line (for example, that he may
      hold some of what the site covers), it goes on /disclaimer/.
- [ ] **Boycott entries that no longer say who owns a brand.** A few
      brands are entries of their own because their owner was named only
      in the dataset's paragraphs (AERIN, owned by Estee Lauder, is one).
      With the paragraphs gone, those entries don't say who owns them. The
      dataset also records owners in a structured field ("stakeholders"),
      which the script could use to add "Owned by …" without copying any
      of the dataset's wording.
- [x] ~~**A computer window between 736 and about 767 pixels wide** (with a
      mouse): the header menu drops under the logo instead of sitting
      beside it.~~ FIXED 6 Nov (part 2): a smaller gap between the menu
      words below 1024px; the menu sits beside the logo from 736px up.

---

## 0e. Part 1 of 4 — the cuts (6 Nov 2026)

MAS's brief: the site read like a research paper written for AI. Part 1
removed the unnecessary stuff from every page, following the writing
rules now at the top of README.md. No fact, figure or fatwa wording was
changed. Part 2 is the design; parts 3 and 4 are for MAS to set.

### Done (one commit per page or group of pages, pushed to main)

- [x] Writing rules at the top of README.md; the old rules here they
      replace are marked REPLACED 6 Nov.
- [x] Every page: the footer's disclaimer is one short line (the full
      text is on /disclaimer/ only); the footer, About page, home page and
      app description say Purevesting covers investing, saving and
      borrowing; "Share as image" only under the main answer, and the
      picture no longer carries the disclaimer; sources moved into one
      closed "Sources" part at the bottom of each page (tapping a figure
      still shows its source); no "min read", "Corrected · see the
      corrections log" lines or "Found something wrong here?" boxes.
- [x] Articles (the five instruments, mutual funds, halal stocks,
      methodology): the answer first in 2–3 short sentences; byline =
      photo, name, date; "Still have a doubt? Ask me" at the end. Tools,
      hub and legal pages have no name line (Privacy and Disclaimer keep a
      date line).
- [x] No madrasa, school of thought, mufti, Shariah board, standard-setter
      or index company is named in page text, titles, descriptions or
      link-preview images: "a fatwa from India", "a Shariah board", "the
      international Shariah standard", "a big US index company". Each
      fatwa's exact words stay in its closed box. Two quotes had a name
      replaced in square brackets ("[the standard's]", "[year-end]"), and
      one NSE quote now starts after the sentence naming its Shariah
      adviser.
- [x] Cut, as MAS listed: the mutual funds page's "What each fund is"
      table, intro, Shariah board note, Nippon note, launch-dates note and
      "How to read this table"; "What every instrument page contains";
      the screener's "What the answer means"; every "not a recommendation
      / not a ruling / question for your scholar" line outside the footer
      and /disclaimer/. Facts that sat in long notes became one short
      sentence in the text, or a closed "Read more".
- [x] Ten link-preview images remade with the new words (PPF's said
      "What Deoband ruled"; Sukanya's named Jamiat Ulama-i-Hind and TASIS).

### Noticed on 6 Nov — not changed

- [x] ~~/halal-stocks/ still gives NSE's old 3% income limit, and the
      purification calculator still cites NSE's January 2020 document~~ —
      both DONE 6 Nov, after part 1 (section 1).
- [x] ~~**Retake the three app screenshots** in `assets/img/app/`~~ DONE
      6 Nov (part 2): all four retaken from the new pages.
- [x] ~~Wide tables still scroll sideways on a phone~~ DONE 6 Nov (part
      2): they turn into small cards on a phone, or became charts and
      cards; no table slides sideways at 360px.
- [x] ~~The byline photo stays on articles~~ — MAS, 6 Nov: keep the photo
      next to the name, styled in the new look. Done (part 2).
- [x] ~~Searching "Zomato" in the screener~~ DONE 6 Nov (part 2): the
      answer adds "(Zomato is now Eternal)" — section 0f.
- [x] ~~The Sources parts' links still show the names in their web
      addresses~~ — MAS, 6 Nov: keep the source links at the bottom as
      they are.
- [ ] The rewording was not logged in /corrections/: the log's own rule
      (now written on that page) is that rewording which keeps the facts
      the same isn't logged.

---

## 0f. Part 2 of 4 — the look (6 Nov 2026)

MAS's brief: make the site look youthful, interesting and professional;
it looked flat — the same cream and green everywhere, like a research
paper. The rules are in README.md, under the writing rules ("The look").
Part 2 changed how things look and are arranged, not what they say: no
fact, figure or fatwa wording changed (checked by script — every number
in each page's old text is still on the page).

### Done (one commit per step, pushed to main)

- [x] First, the two fact items from section 1: NSE's 2.5% income limit
      on /halal-stocks/ (logged in /corrections/) and the current NSE
      document on the purification calculator.
- [x] README.md: the look rules, the colours with their names, and the
      class names that build them. (README.md is plain UTF-8 now; it was
      still UTF-16, so GitHub couldn't show its changes.)
- [x] The new look, in `assets/site.css`: sky blue (`--sky` #2A9AE0,
      `--sky-deep` #0B6FAA, `--sky-ink` #0C4766, `--sky-tint` #E4F2FB,
      `--sky-soft` #C8E6F8), checked against the green for colour-blind
      readers and for contrast; two fonts (DM Mono gone); blue bands,
      icons, tiles and bar charts; the answer as a white card with a green
      edge; the byline as a pill with MAS's photo in a blue ring; "On this
      page" as blue chips; Read more and Sources as blue info parts;
      "Still have a doubt? Ask me" as a bubble with MAS's photo. Light
      motion — cards rise, bars and squares fill, numbers count up,
      buttons give way on a tap — all off when a phone asks for less.
- [x] Menu: Stocks · Mutual funds · EPF & more · Tools · Learn, on one
      line from 320px up; the word for the page you are on is marked.
      Footer: the newsletter sign-up, 11 links (was 21), YouTube,
      Instagram and email, the line on what Purevesting is, and the one
      disclaimer line.
- [x] Home page, as MAS listed it: headline, one short line, the stock
      search ("Try Infosys · Zomato · Reliance"); six question tiles with
      icons; the 500 squares (filling in, 204 counting up) linking to
      /halal-stocks/; the videos (bigger pictures with a play button, a
      row you can swipe on a phone, Subscribe); "Got a doubt? Ask me" with
      MAS's photo; the newsletter sign-up.
- [x] The squares now follow the screener's A-to-Z list, and
      `scripts/update_screener.py` redraws them every month on the home
      page and /halal-stocks/ (between the GRID markers), with their
      counts.
- [x] Inner pages: /halal-stocks/ shows the squares with the "by
      companies / by market value" switch, financial services as two bars,
      and the screen as two steps with its limits as bars; EPF's "where the
      money goes" is a range chart; the methodology page's sectors are a
      bar chart; the purification calculator has a live bar per method;
      /instruments/ is one card per instrument; /learn/ is tiles; icons on
      /tools/ and on the "What people do", "Good to know", About,
      newsletter and app cards; blue bands for rhythm; MAS's photo on
      /ask/. Wide tables become small cards on a phone.
- [x] Screener: "(Zomato is now Eternal)" for old names (`OLD_NAMES` in
      the screener's script). Six full old names that wrongly answered
      "Don't know yet" now find their company.
- [x] The four app screenshots retaken; the home picture's label in
      `manifest.json` updated.
- [x] Checked: every page at 360px, 390px and 1280px — nothing slides
      sideways, no script errors; with less motion asked for, everything
      shows at once; every link and anchor inside the site works; every
      JSON-LD block parses; header and footer identical on all 28 files.

### Decided along the way — say if you want any of these the other way

- The "Stop the genocide" card stays on the home page, under the tiles:
  it wasn't one of the "Start here" link lists or "soon" items.
- The "by market value" switch moved from the home page to
  /halal-stocks/, because the home page now has "one short line"; its 31%
  lives there.
- "Stocks" in the menu opens the screener, which answers "Is my stock
  halal?" and lists all 501 companies; /halal-stocks/ is in its list.
- Words that are mine, not MAS's: the home page's short line ("India's
  one-stop destination for halal investing, saving and borrowing"), the
  tiles heading ("What's your question?"), the videos heading ("Halal
  money, explained simply") and "I'm Moin Ali Syed, and I run
  Purevesting" before MAS's own words from /ask/. Change any of them.
- The footer no longer lists Home, Halal stocks, Methodology, the two
  calculators, Newsletter, Corrections and Disclaimer on their own: each
  is one tap away (logo, menu, /learn/, /tools/, or the disclaimer line).
- Pages' "Last updated" dates were not changed for the new look (the same
  rule as for the menu batches): only what a page says moves its date.

### Noticed on 6 Nov (part 2) — not changed

- [ ] **The October NSE factsheets are out** (dated 30 Oct 2026; still
      204 companies): the monthly update in section 0b is due.
- [x] ~~/tools/ still has its "Check what I already hold — soon" card.~~
      DONE 8 Nov (part 4): gone, as MAS asked.
- [ ] The screener sends "Jio" to Jio Financial Services (JIOFIN). Someone
      typing "Jio" may mean Reliance Jio, the phone company, which belongs
      to Reliance Industries. The answer names the company it found, so it
      isn't wrong — but "jio" could point to RELIANCE instead, or to
      neither. MAS's call.
- [ ] The link-preview images (`assets/og/`) and the "Share as image"
      picture still use the old cream-and-green look, without blue. They
      work as they are; remaking them is a small job for later
      (`og-template.html` no longer uses DM Mono).
- [x] ~~The two fonts don't contain ₹ or →~~ — ₹ DONE 8 Nov (part 4): two
      tiny files (`assets/fonts/…-rupee-wght.woff2`, 1 KB each) hold the ₹
      from the same two fonts, used for ₹ alone. The → is in neither font
      at all (Google's files don't have it), so the three small "→" links
      (the home page's "See the full picture →" and "See all videos →",
      and the boycott card) still use the phone's own arrow. They could
      become small drawings if wanted.
- [x] ~~Charts that could come next: NPS's three asset classes, the gold
      formats.~~ DONE 8 Nov (part 4): the gold formats are four small cards;
      NPS's three classes sit in its "How NPS works" drawing. (Done in
      part 3: the compare page's index returns, as a chart; and its fund
      returns, as small bars on each fund's card — MAS asked for them,
      6 Nov. They stay in fund-size order, one colour, one
      scale for every card, so they don't read as a ranking.)

---

## 0g. Part 3 of 4 — fewer words, more graphics (6–7 Nov 2026)

MAS's brief (6 Nov): give these pages the new look, with fewer words and
more graphics; no table should need sideways scrolling on a phone; where
there is a video on the same topic, show it near the top. Part 3 changed
how things are shown and arranged, not what they say: no fact, figure or
fatwa wording changed (checked by script — every number in each page's
old text is still on the page, except the screener's weight column,
which MAS asked to drop).

### Done (one commit per page, pushed to main)

- [x] **Screener:** the answer first and big — a drawn mark and the word
      (✓ Halal, ✗ Not halal in grey, ? Don't know yet), the company's name
      and only a small date; "Try Infosys · Zomato · Reliance" under the
      box. All 501 companies behind one button, "See all 501 companies"
      (a `<details>`, so every name is still in the page for Google), with
      two columns, the company and the answer, and All / Halal / Not halal
      inside. A link to /screener/#list opens it (site.js, part 7 since
      8 Nov).
      `scripts/update_screener.py` writes the new rows (checked: fed the
      same data, it rewrites the page with no difference).
- [x] **Privacy:** the video pictures now also show on the screener, halal
      stocks, methodology and mutual funds pages and the purification
      calculator; the page says so (its date moved to 6 Nov).
- [x] **Stop the genocide:** one short line, then the search; the answer
      under it, big — "On the boycott list" (an amber flag) with the
      matching entries open, or "Not on this list". The source line once,
      under the search. All 426 entries behind "See all 426 entries".
      `scripts/update_boycott.py` unchanged (checked).
- [x] **Mutual funds:** the page starts with the six funds as cards: Type
      (Active / Index), Shariah board (✓ Yes / ✗ No), Size, and the 1-, 3-
      and 5-year returns as small bars, one colour, one scale for every
      card, 0 in the middle. Expense ratios under "Read more: what each
      fund costs". The index comparison is a small chart (two blues). The
      app's install-sheet picture of the page retaken.
- [x] **How many stocks are halal:** a two-line answer, then straight away
      the squares with the two big figures and the switch; the byline
      after them. "Why less of the value passes" (financial services as
      two bars). Other screens' limits under "Read more"; "Where to see
      the companies" is four links.
- [x] **How a stock is checked:** a two-step drawing — a company goes in;
      step 1 (what it does: NSE's list as short words) and step 2 (how it
      borrows and keeps its cash: NSE's three limits as bars) each have a
      way out ("✗ Out"); what gets through ends on NSE's Shariah list. The
      old paragraphs are word for word under three closed "Read more"s.
      "Try it" is two bars against their limits; "Three things stand out"
      three cards; "Why halal stock lists disagree" five cards.
- [x] **SIP, loan and purification calculators:** the boxes and the answer
      on the first screen of a 390×844 phone, the answer drawn — the SIP
      as one column per year (put in, and growth), the loan as the
      interest meter with the four amounts, purification as three bars.
      The year-by-year tables and the three purification methods are
      under "Read more". On a computer the boxes and the answer sit side
      by side.
- [x] **Videos near the top:** the screener and the methodology page show
      "Same Stock, Opposite Answer for Halal Stocks"; /halal-stocks/
      "Only 13 Nifty 50 stocks are halal?"; the mutual funds page "Is
      Sensex halal or not?"; the purification calculator "Invested in
      haram stocks? Do this!". Each is a small card linking to YouTube
      (no player loads). No video fits the SIP or loan calculator or the
      boycott list, so they have none.
- [x] Checked: every page at 360px, 390px and 1280px — nothing slides
      sideways, and no table needs sideways scrolling, with every "Read
      more" and list opened; no script errors; every link and anchor
      inside the site works; every JSON-LD block parses; header and footer
      identical on all 27 pages.

### Decided along the way — say if you want any of these the other way

- **Mutual funds:** the Sensex Short sits right after the six cards, not
  at the top, because the page starts with the funds — and the video is
  about a close topic (a Sensex index fund) rather than the six funds.
- **Purification calculator:** its answer box became the opening line, as
  the template has it for tools pages (and as on the SIP and loan
  calculators); that made the room for the boxes and the bars. So it has
  no "Share as image" button any more.
- **SIP calculator:** no opening line, so it all fits; the heading says
  what it is.
- **Screener:** the weight in the Shariah index (and the symbol and
  industry) no longer show anywhere, as two columns were asked for. The
  weight could come back as one small line in the answer ("5.83% of the
  Shariah index") if wanted.
- **"On this page" chips** are gone from the methodology page and the
  purification calculator: the drawing and the "Read more"s replace them.
- **Words:** the screener says "In NSE's Shariah list, as of …" / "Not in
  NSE's Shariah list, as of …" under the big answer; the boycott search
  says "On the boycott list" / "Not on this list"; the fund cards say
  "Too new: no 1-year return yet."; the drawing's steps are "What the
  company does" and "How it borrows and keeps its cash", ending "On NSE's
  Shariah list". Change any of them.
- **Dates:** pages' "Last updated" dates were not moved for part 3 (it
  changed how things are shown, not what they say), except the privacy
  page, whose content changed.

### Noticed on 6–7 Nov (part 3) — not changed

- [x] ~~`videos/list.js` calls the long video "Same Stock, Opposite Answer
      for Halal Stocks"~~ — DONE 8 Nov (part 4): "One Number Can Make a
      Halal Stock Haram" in the list and on /screener/ and /methodology/.
- [x] ~~On a small 360×800 phone, the last line of the SIP and
      purification answers sits just under the first screen~~ — DONE
      8 Nov (part 4): all three answers end on the first screen (section
      0h).
- [ ] Still open from part 2: the October NSE factsheets (the monthly job
      is due) and "Jio" in the screener. (The "soon" card, the preview
      images' old look and ₹: see section 0f — the "soon" card and ₹ are
      done; the preview images are still open.)

---

## 0h. Part 4 of 4 — the instrument pages, shorter pages, clear code (8 Nov 2026)

MAS's brief (8 Nov): the five instrument pages start with the answer as a
simple graphic, show how each works as a small drawing, the fatwas as
short cards and what people do as icon cards, with a matching video near
the top; /instruments/ as one card per instrument; the hub, people and
legal pages in the new look and much shorter; an automatic reply on
/ask/; clear code and a README guide; and four items from the "Noticed"
lists. Part 4 changed how things are shown and arranged, and the code's
names and comments — no fact, figure or fatwa wording changed (checked by
script: every number and every quote in each old page is still on the
page; the corrections log's entries and the legal pages' paragraphs are
word for word under "Read more").

### Done (one commit per step, pushed to main)

- [x] **₹ in our fonts.** Two 1 KB files hold the ₹ from each font
      (`assets/fonts/…-rupee-wght.woff2`), used for ₹ alone and fetched
      only on a page that shows one.
- [x] **The long video's new title**, "One Number Can Make a Halal Stock
      Haram", in `videos/list.js` and on /screener/ and /methodology/.
- [x] **Calculators on a small phone:** the whole answer now ends on the
      first screen of a 360×800 phone — SIP at 770px, loan at 781px,
      purification at 781px (they were 853, 970 and 881). The loan's dial
      sits beside its sentence on a phone; its colour squares moved onto
      "You borrow" and "Interest you pay".
- [x] **EPF, PPF, NPS, Sukanya Samriddhi, digital gold:** the answer drawn
      (the parts side by side, each with a sign — ✓ ✗ ⚖ ? ! — and the
      answer in a word or two); "How … works" as a drawing, your money →
      where it goes → what you get (EPF's ranges as bars inside it); "What
      scholars say" as one short card per fatwa ("a fatwa from India", no
      names), its exact words under "What the fatwa says"; "What people
      do" as shorter icon cards; long details under "Read more"; Sources
      closed. NPS has my Short "Kya Muslim NPS me invest kar sakte hai? Is
      it halal?" near the top, digital gold "Dhanteras pe gold lene se
      pehle ye dekh lo!". On a 360px phone: EPF 9,332 → 6,183 pixels, PPF
      7,981 → 5,799, NPS 11,320 → 5,851, Sukanya 7,892 → 5,810, gold
      11,098 → 7,588. The gold page's five-column table became four cards.
- [x] **/instruments/:** one card per instrument — its name, its answer as
      the same small signs, and one line.
- [x] **Shorter pages:** Tools (the "soon" card gone; question tiles),
      Learn, Videos (half as long on a phone), Newsletter, Ask (feedback
      behind "Send feedback instead"), About, App (each phone's steps
      behind a toggle, the reader's own opened), Corrections (one line per
      fix, 8,678 → 4,015 pixels), Disclaimer, Privacy and the 404 page.
- [x] **The automatic reply on /ask/:** the steps are section 0, item 14
      (it needs MAS's Web3Forms login and its paid plan).
- [x] **Clear code:** plain names everywhere (sc-… → search-…, bc-… →
      boycott-…, calc-… → calculator-…, the calculators' p, r, y → amount,
      yearlyReturn, years…), a "Shows on:" comment on every part of
      site.css and site.js, and README.md as a guide (what each file does,
      how to add a page, change a colour, change a number, the building
      blocks). Checked: every page's screenshot the same pixel for pixel
      before and after, the tools' answers the same (31 checks), and both
      monthly scripts rewrite their pages exactly as they are.
- [x] **Final check:** every page at 360, 390 and 1280px with everything
      opened — nothing slides sideways or sticks out, no script errors;
      every link inside the site works; structured data parses; one
      header and one footer on all 28 files; dates and `sitemap.xml`
      updated (8 Nov for the 21 pages whose words changed).

### Decided along the way — say if you want any of these the other way

- **The answers' short words are mine:** EPF "Compulsory EPF — Scholars
  differ" and "VPF, by choice — Most say riba"; PPF "The interest — Riba"
  and "The account — You may keep it"; NPS "You may take them", "Give it
  to the poor", "No fatwa found"; Sukanya "Against Shariah" and "Interest
  keeps coming"; gold "The question is possession, not interest", then
  "Gold on the spot" and "Raise concerns". On gold, the ✓ marks what the
  standard accepts, not any app. The line under each is the old answer's
  own words, and "Share as image" still shows the old answer word for
  word (it is kept in the card's `data-share-text`: change both together).
- **The signs:** ✓ green = you may; ✗ grey = riba (never red); scales =
  scholars differ; dashed ? = no fatwa found; blue ! = good to know; – =
  not asked.
- **EPF:** the "where they agree" table became the two small signs on
  each fatwa card; "Which part did you choose?" became the list in "Your
  money"; "India's EPF has no Shariah option" stays on show.
- **Videos:** for gold, the Dhanteras Short (about buying on the spot, and
  digital gold apps) rather than "Can Muslims Invest in Gold?" (22
  seconds, general). The channel has no EPF, PPF or Sukanya video, so
  those pages have none.
- **Cut from the hub and people pages** (all still one tap away): the
  "Who decides you hold it" lines and the "Start with EPF / Then PPF"
  cards on /instruments/; the YouTube and Instagram tiles on /learn/ (in
  every footer); "On this site" on /about/; "New here? Start with these"
  on /newsletter/.
- **Words that are mine:** the tool tiles' questions ("What could my SIP
  grow to?"…), the nine one-line titles in the corrections log, the
  one-line summaries on the disclaimer and privacy cards (the full
  paragraphs are word for word under "Read more"; "The first sentence
  sits at the foot of every page" went, as it only explained the page).
- **Calculators:** purification's "Three common ways to work it out can
  differ a lot" moved from the opening line to the note under the bars,
  and "to start" went from the line above the boxes. The fit was checked
  the way parts 2 and 3 measured it (the whole 360×800 screen). On a real
  phone the browser's own bars take about 60–80 pixels, so on the smallest
  phones the last line may still sit just under the address bar; fitting
  under that too would need a shorter header on the calculator pages.
- **On a phone, an icon card puts its icon beside its title** (every page).
  /videos/ cards are white now: the dark green is for the footer and the
  home page's videos band only.
- **Dates:** 8 Nov on every page whose words changed (the screener and
  methodology pages too, for the video's new title; the home page in the
  sitemap). The SIP, halal stocks, mutual funds and boycott pages kept
  theirs.
- **Names:** the service worker's `pv-…` storage names were left as they
  are: renaming them would strand phones' saved copies.

### Noticed on 8 Nov (part 4) — not changed

- [ ] **Four Shorts are newer than `videos/list.js`.** To show them, paste
      these lines at the top of the list — the home page then shows the
      first three of them instead of "One Number Can Make a Halal Stock
      Haram"; to keep that one on the home page, paste them just under it:
      ```
      https://www.youtube.com/shorts/yeVK3mEt4-4 | First salary ka kya karein? 3 steps (halal)
      https://www.youtube.com/shorts/fNwefBr3kcA | Dhanteras pe gold lene se pehle ye dekh lo!
      https://www.youtube.com/shorts/jwVKARVdacI | Halal investors will survive the AI bubble?
      https://www.youtube.com/shorts/C6ozSMDB9bw | Muslim investing is very big market now!
      ```
- [ ] **No video yet for EPF, PPF or Sukanya Samriddhi** — three topics for
      Shorts. Once one is up, a card goes near the top of its page.
- [ ] **→ isn't in either font** (section 0f): three small links still use
      the phone's own arrow.
- [ ] **India Code** (the EPF page's Code on Social Security link) didn't
      answer from here; open it once (section 0d, with dea.gov.in and
      nsiindia.gov.in).
- [ ] Still open from earlier parts: the October NSE factsheets (the
      monthly job is due), "Jio" in the screener, the link pictures' old
      look, the five titles over 60 characters (section 0d).

---

## 1. Missing data and missing sources

Every figure on the site is supposed to carry a source link and an "as of"
date. These are the places that don't yet.

- [x] ~~**Do next: /halal-stocks/ still gives NSE's old 3% income limit
      (found 12 Oct).**~~ DONE 6 Nov. Checked against NSE's Methodology
      Document for Equity Indices, September 2026, section 34
      (niftyindices.com/Methodology/Method_NIFTY_Equity_Indices.pdf):
      interest income plus returns from interest-based investments up to
      2.5% of total income, with no assumed 7.5% return; debt (25%) and
      cash (90%) unchanged; the purification sentence word for word the
      same. /halal-stocks/ now says 2.5%, and its Sources line cites that
      document for the screen and purification, plus the Nifty500 Shariah
      factsheet for the monthly review (the new document says "monthly"
      only in its Nifty Shariah 25 list; the factsheet says "Monthly
      shariah compliance screening" for the Nifty500 Shariah). Logged in
      the corrections log. /purification-calculator/'s NSE line now points
      to the same document; its wording didn't change, so that one is a
      routine source update and not logged.

- [ ] **Compare page — ShariahCap Advisors for Taurus and Quantum (6 Oct).**
      Restored as MAS set it on 17 Sep (the 2 Oct "None named" change was
      undone; logged on /corrections/). It now rests on ShariahCap's own site
      (a Taurus CEO quote about the fund's launch) and Shariah Securities'
      list (8 Apr 2025). A stronger source would be a Taurus or Quantum
      document, or a ShariahCap certificate, naming the board — if MAS has
      one, send the link and it replaces these.

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
      answer box and the line in the page's Sources part (since 6 Nov the
      board table and its chips are gone, and boards are never named).
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
- [x] ~~**Compare page — the "Launched" column has no source link (found
      5 Oct).**~~ DONE 12 Oct. All six years were right. Tata Ethical Fund:
      its own scheme information document (28 Nov 2025) says the new fund
      offer opened 9 April 1996. The other five: AMFI's scheme data file,
      which lists each scheme's launch date (Taurus 19 Feb 2009, Nippon ETF
      4 Feb 2009, Quantum 2 Dec 2024, The Wealth Company 24 Sep 2025, UTI
      5 Feb 2026) — AMFI gives Tata only as 2013, when today's plans began.
      The column heading now points at the new note (`data-src="src-launched"`),
      so the years are tappable like the rest.
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
- [x] ~~**Methodology page — confirm NSE's methodology is the latest.**~~
      DONE 12 Oct. It wasn't: niftyindices.com now points all three Shariah
      indices to its "Methodology Document for Equity Indices", September
      2026, section 34. One limit changed — interest income plus returns
      from interest-based investments is now up to 2.5% of total income (it
      was 3%, with an assumed 7.5% return). Debt (25% of total assets) and
      cash (90%) are unchanged, so the worked example and its script's 25%
      stand. Step 2, its source note and its quote were updated, every NSE
      link on the page now points to the current document, and the change
      is in the corrections log. /halal-stocks/ and the purification
      calculator followed on 6 Nov (the first item in this section).
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
      whole. This takes the place of the market-cap treemap. **Moved 6 Nov
      (part 2)** to /halal-stocks/, above its two figures; the home page
      keeps the squares with one short line.
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
      **REPLACED 6 Nov (MAS):** the button now sits only under the main
      answer of a page (the first answer box), never under a table, and the
      picture no longer says "not investment advice". The table-drawing
      code is still in the file, unused, in case it is wanted again.
- [x] ~~**Installable site — the "app" (MAS, 6 Oct)**~~ — DONE 6 Oct, free.
      People install it from the browser: Chrome on Android shows an
      Install button on /app/ (or in its own menu); an iPhone uses Safari's
      Share → Add to Home Screen. It opens full-screen from the home screen,
      pages a reader has opened work offline (with a "You're offline" note,
      because a saved copy can be older than the live page), and it is
      always the live site when online. The pieces:
      - `manifest.json` — the app's name, icon, colours, the page it opens
        on, four long-press shortcuts on Android, and screenshots for
        Android's install sheet (`assets/img/app/`);
      - `sw.js` — the service worker that saves pages and answers offline
        (its comments explain the rules); `/offline/` is the page it shows
        for a page that was never saved (hidden from Google);
      - `/app/` — the install page, to share as purevesting.com/app;
      - `assets/img/icon-maskable-*.png` — the icon Android crops into its
        own shapes; every page's head has four "THE APP" lines, and the
        footer an "Install the app" button.
      **Day to day there is nothing to do:** new pages are saved
      automatically as people open them. Only if the PRECACHE list in
      `sw.js` changes, raise its VERSION by one.
      **If the app ever misbehaves** (say, people keep seeing an old page),
      replace everything in `sw.js` with the lines below and push. Every
      phone deletes its saved copies and goes back to being a plain
      website; the old `sw.js` can be put back once the problem is found.
      ```
      self.addEventListener('install', function () { self.skipWaiting(); });
      self.addEventListener('activate', function (e) {
        e.waitUntil(caches.keys().then(function (names) {
          return Promise.all(names.map(function (n) { return caches.delete(n); }));
        }).then(function () { return self.registration.unregister(); }));
      });
      ```
- [ ] **The app, later (only if wanted):** listing it in the **Microsoft
      Store** for laptops (free, packaged with PWABuilder); in the **Google
      Play Store** ($25 once; a personal account needs a government ID
      check and a 14-day test with 12 testers first); and **notifications**
      ("new video", "monthly update") — they need a small sender running
      somewhere, which Cloudflare's free tier can do. Not the Apple App
      Store: it usually rejects apps that are just a website.
- [x] ~~**Share cards for the compare page's two big tables**~~ — DONE
      5 Oct. Cards now take tables up to 6 columns. A column can be left
      off a card with `data-share="skip"` on its heading (the first table
      drops "Fund house", which repeats the fund's name), a cell can say
      something shorter on the card with `data-share-text`, and a table
      with several source notes under it gets every source on the card.
      The card always uses the page's own row order (fund size).
      **REPLACED 6 Nov:** tables get no share button any more (see the item
      above), and the "What each fund is" table is gone from the page.
- [x] ~~**Tap a number to see its source and date**~~ — DONE 5 Oct, on every
      page, by `assets/site.js` (part 3 of that file explains it, since
      8 Nov; it was section 2). Each
      figure takes the source note nearest to it; `data-src` points a
      figure, a column or a table at a specific note instead, and
      `data-src="none"` marks something that isn't a sourced figure (the
      calculators' answers). Without JavaScript the figures are plain text
      and nothing changes.
      **Changed 6 Nov:** the source notes moved into one closed "Sources"
      part at the bottom of each page (README rule 5). Each line in it has
      an id, and the figures point at it with `data-src` — on the figure,
      its table, or now also the paragraph or section around it.
- [x] ~~**Count-up**~~ — DONE 5 Oct: the home page's 204 counts up once, but
      only if it starts below the screen's edge; a number already on screen
      never animates. Mark any other whole number with `data-count`.
      Since 6 Nov (part 2) decimals count up too ("40.7%" on
      /halal-stocks/), and bars and squares fill in the same way.
- Not built, on purpose (5 Oct): **table sorting** — six rows fit on one
  screen, and sorting by return is the one view the compliance rules
  warn against (a shared screenshot of it reads as a ranking); and the
  **ticker strip** — it would add movement without adding information.
  Both were allowed by the brief, not required.
- [x] ~~**Source chips**~~ — built and in use on the EPF page: tap a scholar's
      position to read the exact wording it was issued in. Note the constraint:
      `<details>` cannot go inside a `<p>`, so a source chip sits between
      paragraphs, not mid-sentence.
      **REPLACED 6 Nov in part:** the chips ("What the fatwa says") stay,
      but no longer say who issued the fatwa (README rule 1); the link to
      each fatwa is in the page's closed Sources part. The same `<details>`
      also makes the closed "Read more" and "Sources" parts.
- [x] ~~**Corrections log**~~ — built 30 Sep at `/corrections/`, linked in
      the footer of every page and from the "Found something wrong here?"
      line on every instrument page and the methodology page. First entries
      logged 1 Oct (EPF, NPS, digital gold, and the compare and home pages)
      and 2 Oct (compare: ShariahCap; digital gold: storage), each with a
      "Corrected" line under the page's "Last updated" date. For the next:
      (1) fix the page; (2) add a card at the top of the log (the page has
      a ready-made example block to copy); ~~(3) put a "Corrected on [date]"
      line next to the corrected page's "Last updated" date, linking to
      the log.~~
      **REPLACED 6 Nov (MAS):** pages no longer carry a "Corrected · see the
      corrections log" line or a "Found something wrong here?" box. Steps 1
      and 2 stay; the log is linked from the Learn menu, /learn/ and
      /about/ (since 6 Nov, part 2, no longer from the shorter footer).
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
      **REPLACED 6 Nov in part:** the "can't be answered… not registered to
      give it" note is gone (README rule 4); the line saying questions may
      be answered publicly, without a name, stays.
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
      2. **Is a mutual fund SIP halal?** (it was a "soon" line on the
         home page until 6 Nov);
      3. **The full list of the 204 companies** on /halal-stocks/, from
         NSE's monthly constituent file (adds a monthly job) — note that
         /screener/'s "See all 501 companies" already lists them, with a
         "Halal" filter, so this may not be needed: MAS's call;
      4. **Interest in loans and EMIs** — on the channel, not on the site;
      5. **Purevesting GPT** — once MAS sends the link (section 0).
- [ ] When each page goes live: follow "How to add a page" in README.md
      (since 8 Nov) — a card on its hub page (`/instruments/`, `/tools/`
      or `/learn/`), one line in the right menu list on every page,
      `sitemap.xml`, and its link picture. (There are no "soon" lines or
      table rows any more.)
- [x] ~~**Header nav.**~~ DONE 24 Sep. Every page now shows Instruments |
      Compare | Methodology | Newsletter in the header, and the same four in
      the footer. The compare page and `_template.html` got the missing
      "Shariah positions are quoted…" sentence in the same batch, so the
      header and footer are now identical on every page. Menu REPLACED
      12 Oct — section 0c. Footer disclaimer **REPLACED 6 Nov (MAS)** by one
      short line; the full wording lives on /disclaimer/ only.
- [x] ~~`/privacy/`, `/disclaimer/`, `/tools/`, `/learn/` and the "page not
      found" page (`404.html`)~~ — built 12 Oct (section 0c).

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
      one for each new page. The home page keeps `default.jpg`. The four
      pages of 12 Oct have theirs too (privacy, disclaimer, tools, learn);
      the "page not found" page uses `default.jpg`.
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
      found" on a fresh request. (index-old.html was deleted on 12 Oct; git
      keeps its history.)
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