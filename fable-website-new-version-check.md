# Fable website new version check — what is still left

Updated 17 November 2026, right after step 0.2 and its fixes went live.
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
- **Checker:** 0 ERROR, 4 WARN (the four long titles, item 16).
- **Next:** step 0.3, the join page.

## 1. The plan's steps still to build (TODO.md, "Website plan")

- [x] 0.1 House rules and the checker
- [x] 0.2 Red-team fixes
- [ ] 0.3 The join page
- [ ] 0.4 Monthly update and history
- [ ] 1.1 Rates and Nisab today
- [ ] 1.2 Zakat calculator
- [ ] 1.3 Zakat answers and interest tool
- [ ] 1.4 Ramadan switch
- [ ] 1.5 Scholar's edits and launch

## 2. New from step 0.2 — for MAS (TODO.md, section 0 and section 1)

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
- [ ] **Item 20. A link picture for /official/** (it uses the default).
- [ ] **UTI (section 1).** Waiting for UTI's reply on whether the fund has
      its own Shariah adviser. The card says "Shariah board ✓ Yes" for now.
- [ ] **Boycott page sentence.** Near the top it says: "A brand on this
      list can still pass a Shariah screen for its shares. These are two
      different questions." Say if you want it removed.

## 3. From step 0.1 — for MAS (TODO.md, section 0)

- [ ] **Item 15. Switch on preview links in Cloudflare.**
      dash.cloudflare.com → Workers & Pages → purevesting-website →
      Settings → Build → Branch control → tick "Enable Preview Builds" →
      Save. Then the Domains tab → Worker URL → Preview on. Don't press
      "Set up Worker Previews". Full steps in TODO.md.
- [ ] **Item 16. Four page titles over 60 letters — decide.** EPF (63),
      /instruments/ (61), /newsletter/ (61), SIP calculator (63). Send new
      words, or say "leave the titles".

## 4. Older items for MAS, still open (TODO.md, section 0)

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

## 5. Jobs that repeat (TODO.md, section 0b)

Monthly NSE figures and the screener update (it now writes the red
"✗ Not halal"), a new video in `videos/list.js`, quarterly fund returns
and small savings rates, digital gold terms, the boycott list, the loan
calculator's typical rates. After any of them: run the checker before it
goes live.

## 6. Ideas for later (TODO.md, sections 0c and 3–4)

MAS's own full screener, halal finance by city, and the other parked
ideas — none started yet.
