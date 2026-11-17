# HOUSE RULES — for anyone, human or AI, who changes purevesting.com

Read README.md first (the writing rules, the look, the guide). Then follow these. If a task and these rules disagree, stop and tell MAS.

## Who this site is for
- Muslims in India, most of them beginners, on a phone. The first person we serve: a salaried Muslim, 22 to 40, who asks "Is my money halal, and what do I do about it?"
- MAS owns the site. He is a beginner in code and must be able to read every file.

## Never
1. Never name a madrasa, school of thought, council, mufti, Shariah board or standards body in page text. Say "a fatwa" or "scholars". The link lives only in the closed Sources part.
2. Never use advice words: buy, sell, hold, avoid, best stocks, recommend, tip, target, guaranteed, assured. We explain, calculate and compare facts.
3. Never show a price or a return of a stock or a fund that is newer than 30 days. Use the latest month-end that is at least 30 days old, and print its date.
4. Never call a cooperative a "bank". Never say insured, guaranteed or fixed profit.
5. Never ask for or store PAN, Aadhaar, account or card numbers, or statements. Tools keep a visitor's numbers on the visitor's own phone.
6. Never add trackers, ads or widgets from other websites. Allowed today: Cloudflare's visit counter, Beehiiv's sign-up box on /join/ and /newsletter/, YouTube thumbnails.
7. Never repeat "not advice" lines. One footer line and /disclaimer/ are enough.
8. Never change a fact, a number or the words of a fatwa unless the task says so. If you find a wrong fact, stop and tell MAS. Fact fixes are logged in /corrections/.
9. Never add things nobody asked for.

## Always
1. Phone first. Check at 360px, 390px and 1280px. Nothing slides sideways. Tap areas are 44px or more.
2. The answer first. A drawing before a paragraph. Long detail under "Read more". Sources closed at the bottom. Every figure has a source and an "as of" date.
3. After every "no", a "Do this instead".
4. Colours, fonts and gaps only by their names in assets/site.css, section 2. No new colour codes inside pages.
5. Pages work without JavaScript where they can. All movement stops when the phone asks for less motion.
6. Clear code beats short code: simple names, and a plain-English comment above each part saying what it does and "Shows on: …".
7. Money maths lives in small pure functions in assets/calc/, with tests in tests/. Run the tests (node --test tests/) and show the result.
8. Run python3 scripts/check_site.py and fix every ERROR before you hand over.
9. In the same step, keep these up to date: the menu on every page, sitemap.xml, README.md (the guide), TODO.md (the steps list, what is left for MAS, the repeating jobs) and sw.js (raise VERSION by one if PRECACHE changes).
10. Simple English when you write to MAS. Short sentences. Explain a hard word the first time.

## How to hand over
- Do only the step you were given. Do not stop to ask questions unless you are truly blocked; list what you assumed instead.
- If you have the repo (Claude Code): work on a branch named after the step (for example step-0-2). One commit per step. Show screenshots at 360px, 390px and 1280px. Merge to main only when MAS says "go live".
- If you are a normal chat: give every changed or new file WHOLE, each as its own download. Never a zip. Never "the rest is unchanged".
- In both cases: show the folder tree of purevesting-website\ with "← replace" or "← NEW" beside each file. Then list what MAS must do himself, as exact clicks. Then end with:
  WHERE WE ARE — Done: … · Next: … · Still left in this phase: … · Rough progress of this phase: …%
