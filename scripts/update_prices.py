"""
UPDATE THE GOLD AND SILVER RATE — run it every Sunday (every day in
Ramadan), with IBJA's latest rates.

    python3 scripts/update_prices.py --gold 12389.3 --silver 152.528 --date 2026-11-20

(Run it from the purevesting-website folder. On Windows, if "python3" is
not found, type "python" or "py" instead.)

WHERE THE THREE NUMBERS COME FROM: ibjarates.com, the rates of the India
Bullion and Jewellers Association (IBJA). Under "Previous Dates Rate"
there are two tables; use the PM one (the day's closing rate), top row:

  --gold    "999", divided by 10 (IBJA gives gold for 10 grams):
            1,23,893 becomes 12389.3
  --silver  "Silver 999", divided by 1,000 (IBJA gives silver for 1 kg):
            1,52,528 becomes 152.528. Keep all three decimals.
  --date    that row's date, written year-month-day:
            20/11/2026 becomes 2026-11-20

WHAT IT DOES
  1. Checks the three numbers. It stops, changing nothing, if a rate is
     more than five times (or less than a fifth of) the last one: that is
     a rate for 10 grams or 1 kg typed by mistake. It also stops on more
     than three decimals, or a date that is wrong or in the future.
  2. Rewrites assets/data/prices.json: the one file the pages read the
     rates from.
  3. On every page, between the markers <!-- NISAB START --> and
     <!-- NISAB END -->, rewrites every figure marked data-nisab="…" (the
     list is in FIGURES, below). So a page shows the right figures even
     without JavaScript. It stops, changing nothing, if a rupee figure
     between the markers has no data-nisab, or a data-nisab figure sits
     outside the markers.
  4. On each page it changed, sets "dateModified" in the structured data,
     and the page's <lastmod> in sitemap.xml, to today.
  5. Prints the rates and the new nisab, so you can check them.

The maths is the same as in assets/calc/nisab.js, which the pages use;
tests/nisab.test.js checks that the two always give the same figures.
Plain Python only: nothing to install. Not published on the site
(scripts/ is in .assetsignore).
"""

# ==========================================================================
# THE SETTINGS
# ==========================================================================

import argparse
import datetime
import json
import os
import re
import sys
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path

# The purevesting-website folder: the folder above scripts/.
SITE = Path(__file__).resolve().parent.parent

PRICES_FILE = SITE / "assets" / "data" / "prices.json"
SITEMAP = SITE / "sitemap.xml"
OUR_SITE = "https://purevesting.com"

# Where the rates come from (written into prices.json).
SOURCE_NAME = "IBJA"
SOURCE_URL = "https://ibjarates.com/"

# Grams in the nisab: the same numbers as in assets/calc/nisab.js.
SILVER_NISAB_GRAMS = Decimal("612.36")
GOLD_NISAB_GRAMS = Decimal("87.48")

# How far a rate may move from the last one before the script stops. A
# rate for 10 grams typed by mistake is ten times too big; a real week
# moves a few per cent.
BIGGEST_MOVE = Decimal(5)

# The markers around the figures, on any page.
START = "<!-- NISAB START -->"
END = "<!-- NISAB END -->"

# The figures it rewrites between the markers: data-nisab="…" names.
FIGURES = {
    "silver-nisab": "the nisab by silver: 612.36 g x the silver rate",
    "gold-nisab": "the nisab by gold: 87.48 g x the gold rate",
    "silver-rate": "the silver rate for 1 gram",
    "gold-rate": "the gold rate for 1 gram",
    "as-of": "the date of the rates (on a <time> tag; its datetime too)",
}

MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]

# A figure marked data-nisab: its opening tag, its words, its closing tag.
# Its words must be plain text, with no tags inside.
MARKED = re.compile(
    r'(?P<open><(?P<tag>[a-zA-Z][a-zA-Z0-9]*)\b[^>]*?\bdata-nisab="(?P<kind>[^"]*)"[^>]*>)'
    r'(?P<words>[^<]*)'
    r'(?P<close></(?P=tag)\s*>)'
)

# A tag with data-nisab="…" in it.
TAG_WITH_FIGURE = re.compile(r'<[a-zA-Z][^>]*?\bdata-nisab="')

# The ₹ sign, typed or written as an HTML code.
RUPEE_SIGN = re.compile(r"₹|&#8377;|&#x20b9;", re.IGNORECASE)

# Comments and scripts: words in them are not on the page, so the script
# never looks for figures there.
NOT_ON_PAGE = re.compile(r"<!--.*?-->|<script\b.*?</script\s*>", re.S | re.IGNORECASE)


# ==========================================================================
# READING THE THREE NUMBERS
# ==========================================================================

def stop(message):
    """Prints the problem and stops, without changing any file."""
    print("Stopped, nothing changed: " + message)
    sys.exit(1)


def read_rate(text, name):
    """A rate typed after --gold or --silver, as an exact number."""
    try:
        rate = Decimal(text)
    except InvalidOperation:
        stop(f'{name} must be a number, like 12389.3. You typed "{text}".')
    if not rate.is_finite() or rate <= 0:
        stop(f'{name} must be a number above zero. You typed "{text}".')
    if rate.as_tuple().exponent < -3:
        stop(f"{name} has more than three decimals ({text}). Type it as IBJA "
             f"gives it, divided by 10 (gold) or 1,000 (silver).")
    return rate


def read_date(text):
    """The date typed after --date: year-month-day, not in the future."""
    try:
        day = datetime.date.fromisoformat(text)
    except ValueError:
        stop(f'--date must be written year-month-day, like 2026-11-20. You typed "{text}".')
    if day > datetime.date.today():
        stop(f"--date {text} is in the future. Use the date of IBJA's rates.")
    return day


def read_last_prices():
    """The rates now in prices.json, or None if there is no file yet."""
    if not PRICES_FILE.is_file():
        return None
    try:
        last = json.loads(PRICES_FILE.read_text(encoding="utf-8"))
        return {
            "as_of": datetime.date.fromisoformat(last["as_of"]),
            "gold": Decimal(str(last["gold_24k_per_gram"])),
            "silver": Decimal(str(last["silver_999_per_gram"])),
        }
    except (ValueError, KeyError, TypeError, InvalidOperation):
        print("Note: assets/data/prices.json was broken, so the new rates "
              "can't be compared with the last ones. It is written fresh.")
        return None


def check_move(new, old, name, bigger_unit):
    """Stops if a rate is more than five times, or less than a fifth of,
    the last one."""
    if old is None or old <= 0:
        return
    if new > old * BIGGEST_MOVE or new * BIGGEST_MOVE < old:
        stop(f"{name} {new} is very far from the last one ({old}). Is it the "
             f"rate for {bigger_unit}? Type the rate for 1 gram.")


# ==========================================================================
# THE MATHS AND THE WORDS — the same as assets/calc/nisab.js
# ==========================================================================

def round_to_rupee(amount):
    """To the nearest rupee; half a rupee goes up."""
    return int(amount.quantize(Decimal(1), rounding=ROUND_HALF_UP))


def indian_commas(whole):
    """A whole number with Indian commas: 1233643 becomes "12,33,643"."""
    digits = str(whole)
    last_three, rest = digits[-3:], digits[:-3]
    groups = []
    while len(rest) > 2:
        groups.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        groups.insert(0, rest)
    groups.append(last_three)
    return ",".join(groups)


def rupees(amount):
    """Rupees, rounded to the rupee: "₹12,33,643"."""
    return "₹" + indian_commas(round_to_rupee(amount))


def rate_words(rate):
    """A rate for 1 gram with the decimals it has: "₹14,102",
    "₹12,389.30", "₹152.528"."""
    whole, decimals = f"{rate.quantize(Decimal('0.001'), rounding=ROUND_HALF_UP)}".split(".")
    if decimals == "000":
        decimals = ""
    elif decimals.endswith("0"):
        decimals = decimals[:2]
    return "₹" + indian_commas(int(whole)) + ("." + decimals if decimals else "")


def date_words(day):
    """A date the way the site writes it: "20 November 2026"."""
    return f"{day.day} {MONTHS[day.month - 1]} {day.year}"


def json_number(rate):
    """A rate for prices.json: 14102 stays 14102, 152.528 stays 152.528."""
    return int(rate) if rate == rate.to_integral_value() else float(rate)


# ==========================================================================
# THE PAGES
# ==========================================================================

def pages_with_markers():
    """Every .html file in the folder with a NISAB marker in it, as paths
    like "zakat/nisab-today/index.html"."""
    found = []
    for folder, subfolders, files in os.walk(SITE):
        subfolders[:] = sorted(name for name in subfolders
                               if not name.startswith(".") and name != "node_modules")
        for name in sorted(files):
            if name.lower().endswith(".html"):
                path = Path(folder) / name
                text = path.read_text(encoding="utf-8", errors="replace")
                if START in text or END in text or 'data-nisab="' in text:
                    found.append(path.relative_to(SITE).as_posix())
    return found


def page_address(rel_path):
    """A page's address: zakat/nisab-today/index.html is /zakat/nisab-today/."""
    if rel_path == "index.html":
        return "/"
    if rel_path.endswith("/index.html"):
        return "/" + rel_path[: -len("index.html")]
    return "/" + rel_path[: -len(".html")]


def line_of(text, offset):
    """The line number of a place in a file."""
    return text.count("\n", 0, offset) + 1


def blank(text, pattern):
    """The text with every match of the pattern turned into spaces (line
    breaks kept), so every other letter keeps its place and its line."""
    return pattern.sub(lambda found: re.sub(r"[^\n]", " ", found.group(0)), text)


def rewrite_figures(rel_path, text, words, iso_date):
    """Rewrites every marked figure between the markers on one page.
    Gives back (the new text, how many figures changed, problems)."""
    problems = []
    # The page without its comments and scripts, letter for letter in the
    # same places: figures are looked for here, and changed in the text.
    on_page = blank(text, NOT_ON_PAGE)

    # The markers come in pairs, START then END, never one inside another.
    blocks = []
    position = 0
    while True:
        start = text.find(START, position)
        end = text.find(END, position)
        if start == -1 and end == -1:
            break
        if start == -1 or (end != -1 and end < start):
            problems.append(f"{rel_path}:{line_of(text, end)}  {END} without a {START} before it.")
            break
        end = text.find(END, start)
        next_start = text.find(START, start + len(START))
        if end == -1 or (next_start != -1 and next_start < end):
            problems.append(f"{rel_path}:{line_of(text, start)}  {START} without a {END} after it.")
            break
        blocks.append((start + len(START), end))
        position = end + len(END)

    # Every data-nisab figure must sit inside a pair of markers.
    for found in TAG_WITH_FIGURE.finditer(on_page):
        if not any(first <= found.start() < last for first, last in blocks):
            problems.append(f"{rel_path}:{line_of(text, found.start())}  A data-nisab figure "
                            f"outside the NISAB markers: it would never be rewritten. "
                            f"Put {START} and {END} around it.")

    changed = 0
    pieces, kept_until = [], 0
    for first, last in blocks:
        block_on_page = on_page[first:last]
        figures = list(MARKED.finditer(block_on_page))

        # A data-nisab figure with a tag inside it can't be rewritten.
        if len(TAG_WITH_FIGURE.findall(block_on_page)) != len(figures):
            problems.append(f"{rel_path}:{line_of(text, first)}  A data-nisab figure here holds "
                            f"a tag inside it. Its words must be plain text, like ₹93,402.")

        # Any other rupee figure between the markers is one it would miss.
        rest = MARKED.sub(lambda found: " " * len(found.group(0)), block_on_page)
        sign = RUPEE_SIGN.search(rest)
        if sign:
            near = rest[sign.start(): sign.start() + 20].split("<")[0].strip()
            problems.append(f'{rel_path}:{line_of(text, first + sign.start())}  A rupee figure '
                            f'between the NISAB markers that has no data-nisab ("{near}"). '
                            f"Mark it, or move it outside the markers.")

        # Each figure gets its new words (and a date its new datetime).
        for figure in figures:
            kind = figure.group("kind")
            at = first + figure.start()
            if kind not in words:
                problems.append(f'{rel_path}:{line_of(text, at)}  data-nisab="{kind}" is not a '
                                f"figure this script knows. It knows: {', '.join(FIGURES)}.")
                continue
            opening = figure.group("open")
            if kind == "as-of":
                opening = re.sub(r'\bdatetime="[^"]*"', f'datetime="{iso_date}"', opening)
            new_figure = opening + words[kind] + figure.group("close")
            pieces.append(text[kept_until:at])
            pieces.append(new_figure)
            kept_until = first + figure.end()
            if new_figure != figure.group(0):
                changed += 1
    pieces.append(text[kept_until:])
    return "".join(pieces), changed, problems


def set_date_modified(text, today_iso):
    """Sets "dateModified" in a page's structured data to today."""
    return re.subn(r'("dateModified"\s*:\s*")\d{4}-\d{2}-\d{2}(")',
                   rf"\g<1>{today_iso}\g<2>", text)


def set_sitemap_date(sitemap_text, address, today_iso):
    """Sets one page's <lastmod> in sitemap.xml to today."""
    loc = re.escape(OUR_SITE + address)
    return re.subn(r"(<loc>\s*" + loc + r"\s*</loc>\s*<lastmod>)[^<]*(</lastmod>)",
                   rf"\g<1>{today_iso}\g<2>", sitemap_text)


def read_text(path):
    """A file's text, with its line endings kept as they are."""
    with open(path, encoding="utf-8", newline="") as file:
        return file.read()


def write_text(path, text):
    """Writes a file, keeping its line endings as they are."""
    with open(path, "w", encoding="utf-8", newline="") as file:
        file.write(text)


# ==========================================================================
# RUN IT
# ==========================================================================

def main():
    # Windows: never stop on a letter the window can't show (like ₹).
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")

    parser = argparse.ArgumentParser(
        description="Rewrites the gold and silver rate, and the nisab on every page.")
    parser.add_argument("--gold", required=True,
                        help="IBJA's gold 999 (24K) rate for 1 gram: its rate for 10 g, divided by 10")
    parser.add_argument("--silver", required=True,
                        help="IBJA's silver 999 rate for 1 gram: its rate for 1 kg, divided by 1,000")
    parser.add_argument("--date", required=True,
                        help="the date of those rates, year-month-day, like 2026-11-20")
    args = parser.parse_args()

    # 1. The three numbers, checked.
    gold = read_rate(args.gold, "--gold")
    silver = read_rate(args.silver, "--silver")
    day = read_date(args.date)
    last = read_last_prices()
    check_move(gold, last and last["gold"], "--gold", "10 grams")
    check_move(silver, last and last["silver"], "--silver", "1 kg")

    silver_nisab = SILVER_NISAB_GRAMS * silver
    gold_nisab = GOLD_NISAB_GRAMS * gold
    words = {
        "silver-nisab": rupees(silver_nisab),
        "gold-nisab": rupees(gold_nisab),
        "silver-rate": rate_words(silver),
        "gold-rate": rate_words(gold),
        "as-of": date_words(day),
    }
    iso_date = day.isoformat()
    today_iso = datetime.date.today().isoformat()

    # 2. The new prices.json (written below, once every page is checked).
    prices_text = json.dumps({
        "as_of": iso_date,
        "source_name": SOURCE_NAME,
        "source_url": SOURCE_URL,
        "gold_24k_per_gram": json_number(gold),
        "silver_999_per_gram": json_number(silver),
    }, indent=2, ensure_ascii=False) + "\n"

    # 3 and 4. Every page with the markers, rewritten in memory first.
    problems, new_pages = [], {}
    sitemap_text = read_text(SITEMAP) if SITEMAP.is_file() else None
    old_sitemap = sitemap_text
    sitemap_notes = []
    for rel_path in pages_with_markers():
        old_text = read_text(SITE / rel_path)
        new_text, changed, page_problems = rewrite_figures(rel_path, old_text, words, iso_date)
        problems += page_problems
        if changed:
            new_text, dated = set_date_modified(new_text, today_iso)
            if not dated:
                sitemap_notes.append(f"  Note: {rel_path} has no dateModified to update.")
            if sitemap_text is not None:
                sitemap_text, listed = set_sitemap_date(sitemap_text, page_address(rel_path), today_iso)
                if not listed:
                    sitemap_notes.append(f"  Note: {page_address(rel_path)} is not in sitemap.xml.")
            new_pages[rel_path] = (new_text, changed)

    if problems:
        print("Stopped, nothing changed. Fix these first:")
        for problem in problems:
            print("  " + problem)
        return 1

    # Everything checked: now write.
    old_prices = read_text(PRICES_FILE) if PRICES_FILE.is_file() else None
    PRICES_FILE.parent.mkdir(parents=True, exist_ok=True)
    if prices_text != old_prices:
        write_text(PRICES_FILE, prices_text)
    for rel_path, (new_text, changed) in new_pages.items():
        write_text(SITE / rel_path, new_text)
    sitemap_changed = sitemap_text is not None and sitemap_text != old_sitemap
    if sitemap_changed:
        write_text(SITEMAP, sitemap_text)

    # 5. What it did, to check.
    def move(new, old):
        """How the rate moved since prices.json was last written."""
        if old is None:
            return ""
        change = round((new - old) / old * 100, 1)
        if change == 0:
            return f"  (last: {rate_words(old)}, about the same)"
        return f"  (last: {rate_words(old)}, {change:+.1f}%)"

    print(f"Rates of {date_words(day)}, from {SOURCE_NAME}:")
    print(f"  Gold 999 (24K): {rate_words(gold)} a gram{move(gold, last and last['gold'])}")
    print(f"  Silver 999:     {rate_words(silver)} a gram{move(silver, last and last['silver'])}")
    if day.weekday() >= 5:
        print(f"  Note: {date_words(day)} is a {day.strftime('%A')}. IBJA publishes no "
              f"rates on Saturdays and Sundays: is it the date on IBJA's page?")
    print()
    print("The nisab:")
    print(f"  By silver: 612.36 g x {rate_words(silver)} = {words['silver-nisab']}")
    print(f"  By gold:   87.48 g x {rate_words(gold)} = {words['gold-nisab']}")
    print()
    if prices_text == old_prices and not new_pages:
        print("Nothing changed: prices.json and the pages already have these rates.")
        return 0
    print("Changed:")
    if prices_text != old_prices:
        print("  assets/data/prices.json")
    for rel_path, (new_text, changed) in new_pages.items():
        print(f"  {rel_path} ({changed} figure{'s' if changed != 1 else ''})")
    if sitemap_changed:
        print("  sitemap.xml (the date of each page above)")
    for note in sitemap_notes:
        print(note)
    print()
    print("Next: look at the page, run python3 scripts/check_site.py, then commit and push.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
