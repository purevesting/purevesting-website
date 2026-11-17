# Fable website new version check — what is still left

Written 17 November 2026, right after step 0.1 went live. A short list of
everything still open, so nothing gets lost. The full details are in
TODO.md (section numbers given below). Not published on the site
(.assetsignore keeps it off).

## Where we are

- **Live:** step 0.1 — the house rules (CLAUDE.md) and the checker
  (`python3 scripts/check_site.py`). Last run: 0 ERROR, 4 WARN.
- **Next:** step 0.2, red-team fixes.

## 1. The plan's steps still to build (TODO.md, "Website plan")

- [ ] 0.2 Red-team fixes
- [ ] 0.3 The join page
- [ ] 0.4 Monthly update and history
- [ ] 1.1 Rates and Nisab today
- [ ] 1.2 Zakat calculator
- [ ] 1.3 Zakat answers and interest tool
- [ ] 1.4 Ramadan switch
- [ ] 1.5 Scholar's edits and launch

## 2. New from step 0.1 — for MAS (TODO.md, section 0)

- [ ] **Item 15. Switch on preview links in Cloudflare.**
      dash.cloudflare.com → Workers & Pages → purevesting-website →
      Settings → Build → Branch control → tick "Enable Preview Builds" →
      Save. Then the Domains tab → Worker URL → Preview on (older
      screens: Settings → Domains & Routes → Version URLs → Enable).
      Don't press "Set up Worker Previews". Full steps in TODO.md.
- [ ] **Item 16. Four page titles over 60 letters — decide.** EPF (63),
      /instruments/ (61), /newsletter/ (61), SIP calculator (63). Send
      new words, or say "leave the titles".

## 3. Older items for MAS, still open (TODO.md, section 0)

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

## 4. Jobs that repeat (TODO.md, section 0b)

Monthly NSE figures and the screener update, a new video in
`videos/list.js`, quarterly fund returns and small savings rates, digital
gold terms, the boycott list, the loan calculator's typical rates.
After any of them: run the checker before it goes live.

## 5. Ideas for later (TODO.md, sections 0c and 3–4)

MAS's own full screener, halal finance by city, and the other parked
ideas — none started yet.
