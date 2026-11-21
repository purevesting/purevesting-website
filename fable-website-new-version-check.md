# Fable website new version check — what is still left

Updated 21 November 2026: step 1.1, the gold and silver rates and the
page "Nisab today" (waiting for "go live"). Before that, 19 November
2026: the screener names every company on NSE (an extra step after 0.4).
A short list of everything still open, so nothing gets lost. The full
details are in TODO.md (section numbers given below). Not published on
the site (.assetsignore keeps it off).

## Where we are

- **Live:** step 0.1 (the house rules and the checker) and step 0.2 (the
  red-team fixes), with MAS's changes the same day:
  - the screener: ✓ Halal (green), ✗ Not halal (red), ? Don't know yet,
    with a small source line under the answer;
  - "Stop the genocide" in the menu, on the home page and in the footer;
  - UTI's card: "Shariah board ✓ Yes";
  - the new page /official/ ("Is it really Purevesting?"), linked as
    "Official channels" in every footer.
- **Live:** step 0.3, the join page: purevesting.com/join, the one place
  to join the email list. Every "Subscribe" button now says "Join" and
  goes there; the footer says "Join free"; nine articles end with "Get
  one answer like this every week. Join free →".
- **Live:** step 0.4, the monthly update and history (see "What step 0.4
  did" below).
- **Ready, not live yet:** the screener names every company on NSE (see
  "What the extra step did" below). Say "go live" to put it on the site.
- **Ready, not live yet:** step 1.1, the gold and silver rates and
  /zakat/nisab-today/ (see "What step 1.1 did" below). Say "go live".
- **Checker:** 0 ERROR, 4 WARN (the four long titles, item 16).
- **Tests:** `node --test tests/`: 17 of 17 pass.
- **Next:** step 1.2, the zakat calculator.

## What step 1.1 did (21 Nov 2026, not live yet)

- New page **purevesting.com/zakat/nisab-today**: "Nisab today: ₹93,402"
  big (612.36 g of silver), then ₹10,83,816 by gold (87.48 g), the
  gold-only line, and "As of 20 November 2026 · Source: IBJA". All of it
  on the first screen of a small phone.
- Under it: how it is worked out, drawn as two small sums; "Silver or
  gold?" in your words; a box for your own jeweller's rate, with the
  fatwa's line on which rate; a tile to the zakat calculator (to /tools/
  until step 1.2); Sources, closed.
- `assets/data/prices.json`: IBJA's closing rates of Friday 20 Nov 2026,
  gold ₹12,389.30 and silver ₹152.528 a gram.
- **Every Sunday** you run one line (TODO.md 0b, README "How to change
  the gold and silver rate"):
  `python3 scripts/update_prices.py --gold … --silver … --date …`
- `assets/calc/nisab.js` (the maths) and `tests/nisab.test.js` (17
  tests). The checker bans five more names. sw.js fetches the rates
  fresh online.
- Fixed on the way: `.assetsignore` kept every folder named `data`
  off the site, so `assets/data/prices.json` would never have gone live.
  Now only the top `data/` folder is kept off.

## What the extra step did (19 Nov 2026, not live yet)

- You searched "Dreamfolks" and got a bare "Don't know yet". Now the
  search names it: **? Don't know yet — Dreamfolks Services Limited
  (DREAMFOLKS).** "On NSE, but not in the Nifty 500, so not screened here
  yet", with NSE's list and its date.
- It knows all 2,135 other companies on NSE, from NSE's list
  (EQUITY_L.csv), in `screener/outside-nifty500.js`.
- That list loads only when a search has no exact Nifty 500 match, so a
  Nifty 500 search never waits for it. If it can't load, the search
  works as before.
- A Nifty 500 company still wins a close call: "apollo" lists Apollo
  Hospitals and Apollo Tyres first. An exact name now wins over part of
  a Nifty 500 name: "Birla Corporation" no longer shows Birlasoft.
- A name found nowhere: "We couldn't find this name in NSE's list of
  companies". Check the spelling.
- The monthly script downloads EQUITY_L.csv as a third file, writes the
  list, and keeps the file in `data/nse/` on GitHub.
- Checked: 4,265 of 4,270 exact searches find the company (before:
  none). The Nifty 500 companies answer exactly as before.

## What step 0.4 did (live 17–18 Nov 2026)

- NSE figures moved to 30 October 2026 on the home page, /screener/,
  /halal-stocks/ and /methodology/.
- Shariah index: **204 of 501** companies pass (six left, six joined).
- Share of market value: **31.1%** (was 31.4%). The squares drawing lights
  156 squares.
- "ICICI Prudential Life Insurance" is now "ICICI Life Insurance". The old
  name still works in the search box.
- The screener update script now also writes `data/shariah-history.csv`,
  one block per month, so the history grows by itself.
- The script keeps NSE's two files in git every month, in
  `data/nse/<date of the data>/` (October's: `data/nse/2026-10-30/`).
  Nothing lives only on your computer. On a day NSE's site blocks it,
  upload the two files on github.com into a new `data/nse/` folder and
  run the script on that folder.
- Seven new Shorts added to `videos/list.js`, newest first.
- README, TODO and sitemap brought up to date.
- Checked: the counts match everywhere, the maths adds up, the script
  works on a test copy, and the pages look right at 360px, 390px and
  1280px.
- Checked again on 18 Nov against NSE's own two files, downloaded fresh:
  the same 204 of 501, the pages came out unchanged. The factsheet PDFs
  still would not load from here.

## 1. The plan's steps still to build (TODO.md, "Website plan")

- [x] 0.1 House rules and the checker
- [x] 0.2 Red-team fixes
- [x] 0.3 The join page
- [x] 0.4 Monthly update and history
- [x] 1.1 Rates and Nisab today
- [ ] 1.2 Zakat calculator
- [ ] 1.3 Zakat answers and interest tool
- [ ] 1.4 Ramadan switch
- [ ] 1.5 Scholar's edits and launch

## 1b. New from step 1.1 — for MAS (TODO.md, section 0)

- [ ] **Say "go live"** for step 1.1, after looking at the screenshots.
- [ ] **Item 28. Check the first rates** on ibjarates.com (PM table, row
      20/11/2026: gold 1,23,893, silver 1,52,528). Both fell sharply since
      9 Nov.
- [ ] **Item 29. "Silver or gold?": the reason for gold — decide.** Its
      fatwa gives a different reason from the card's words.
- [ ] **Item 30. Nisab today in the menu — when?**
- [ ] **Item 31. Two choices for step 1.2:** 14K as 14/24 or 585, and
      IBJA's own 22K rate.
- [ ] **Every Sunday:** the gold and silver rate. Next: 29 Nov 2026.

## 2. New from the extra step — for MAS (TODO.md, section 0)

- [ ] **Say "go live"** for the screener change, after looking at the
      screenshots.
- [ ] **Item 27. "Dummy HEG Ltd." — decide.** NSE's own files put a
      stand-in called "Dummy HEG Ltd." in the Nifty 500 and the Shariah
      index (it looks like the stand-in NSE uses while HEG splits off a
      business). So the screener shows "Dummy HEG Ltd. ✓ Halal", and
      "204 of 501" counts it. Say "leave it as NSE has it" or "skip
      stand-ins" (then 203 of 500).

## 2a. From step 0.4 — for MAS (TODO.md, section 0)

- [ ] **Check one NSE number.** 204 of 501 is now checked against NSE's
      own files. Only 31.1% comes from the factsheet PDFs: open NSE's
      factsheet for 30 Oct 2026 and check it matches the home page.
- [ ] **Item 25. The home page's three videos — decide.** The three
      newest Shorts now show there, so the long video "One Number Can Make
      a Halal Stock Haram" dropped off the home page (it is still on
      /videos/, /screener/ and /methodology/). Say "bring it back" or
      "leave it".
- [ ] **Item 26. Start the history one month earlier? — decide.** The
      history file starts with October 2026. Say "add September to the
      history" or "start from October".

## 2b. From step 0.3 — for MAS (TODO.md, section 0)

- [ ] **Check /join/ on your phone — first.** The website chat couldn't
      load Beehiiv's real box (Beehiiv blocks test browsers). Open
      purevesting.com/join: the heading and the box should show without
      scrolling. Then sign up once with a personal email (not salam@)
      and look for the welcome email, in spam too.
- [ ] **Item 22. Say "purevesting.com/join" in the newsletter Short.**
- [ ] **Item 23. Put purevesting.com/join** in every pinned comment, in
      the YouTube description's first line and in the Instagram bio —
      and on every new video from now on.
- [ ] **Item 24. Write the two lines on /join/ in your own words.** The
      second line ("…my welcome email sends you my free guide") should
      name the guide. Send the words, or edit join/index.html under the
      "MAS: say this your way" notes.
- [ ] **WhatsApp Channel link (item 21).** The button on /join/ is ready
      but hidden. Send the link once the Channel exists; it goes on
      /join/ and /official/ together.
- [ ] **Item 20. A link picture for /join/** (it uses the default, like
      /official/).

## 3. New from step 0.2 — for MAS (TODO.md, section 0 and section 1)

- [ ] **Item 21. Send the Telegram link — most urgent.** /official/ says
      our only official places are four: purevesting.com, YouTube,
      Instagram and salam@purevesting.com. Until Telegram is added, your
      real Telegram can look fake. Send the WhatsApp link too, once it
      exists.
- [ ] **Item 17. Tap the cybercrime.gov.in link on /official/ once.**
      It couldn't be opened from the website chat, so it is unchecked.
- [ ] **Item 18. HalalEdge on /official/?** The newsletter isn't on its
      list of official places. Say "add HalalEdge" or "leave it".
- [ ] **Item 19. Corrections log for step 0.2?** Both fact changes were
      changed back the same day, so probably nothing to log. Say "log
      them" or "no log needed".
- [ ] **Item 20. A link picture for /official/** (it uses the default;
      /join/ too, see section 2).
- [ ] **UTI (section 1).** Waiting for UTI's reply on whether the fund has
      its own Shariah adviser. The card says "Shariah board ✓ Yes" for now.
- [ ] **Boycott page sentence.** Near the top it says: "A brand on this
      list can still pass a Shariah screen for its shares. These are two
      different questions." Say if you want it removed.

## 4. From step 0.1 — for MAS (TODO.md, section 0)

- [ ] **Item 15. Switch on preview links in Cloudflare.**
      dash.cloudflare.com → Workers & Pages → purevesting-website →
      Settings → Build → Branch control → tick "Enable Preview Builds" →
      Save. Then the Domains tab → Worker URL → Preview on. Don't press
      "Set up Worker Previews". Full steps in TODO.md.
- [ ] **Item 16. Four page titles over 60 letters — decide.** EPF (63),
      /instruments/ (61), /newsletter/ (61), SIP calculator (63). Send new
      words, or say "leave the titles".

## 5. Older items for MAS, still open (TODO.md, section 0)

- [ ] 4. Fix the purevesting.in redirect (still 302, should be 301)
- [ ] 6. Bing Webmaster Tools
- [ ] 7. Same one-line description on Instagram and YouTube
- [ ] 8. Purevesting GPT: send the link, or take it off the Instagram bio
- [ ] 9. Google shows a globe instead of the logo: check again
- [ ] 10. Install the app on your own phone and test offline
- [ ] 11. Ask Tech for Palestine about using their boycott list
- [ ] 12. A lawyer's look at /stop-the-genocide/
- [ ] 13. boycottisrael.org: send the right link
- [ ] 14. Automatic reply for /ask/ (Web3Forms Pro, paid)

## 6. Jobs that repeat (TODO.md, section 0b)

Every Sunday, the gold and silver rate (since step 1.1). Monthly NSE figures and the screener update (it now writes the red
"✗ Not halal" and adds the month to `data/shariah-history.csv`), a new video in `videos/list.js`, quarterly fund returns
and small savings rates, digital gold terms, the boycott list, the loan
calculator's typical rates. New video: purevesting.com/join in its
pinned comment and description's first line. After any of them: run the checker before it
goes live.

## 7. Ideas for later (TODO.md, sections 0c and 3–4)

MAS's own full screener, halal finance by city, and the other parked
ideas — none started yet.
