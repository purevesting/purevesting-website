"""
UPDATE THE GOLD AND SILVER RATE — it runs by itself, every morning after
a working day, on GitHub (.github/workflows/update-prices.yml). Nobody has
to run it. Since 21 Nov 2026 (step 1.1).

What GitHub runs:

    python3 scripts/update_prices.py --from-ibja

It reads ibjarates.com, the rates of the India Bullion and Jewellers
Association (IBJA): under "Previous Dates Rate", the PM table (the day's
closing rate), its newest row. IBJA gives gold for 10 grams and silver
for 1 kg, so it divides gold by 10 and silver by 1,000. It takes gold 999
(24K), 916 (22K), 750 (18K) and 585 (14K), and silver 999.

  --from-ibja saved.html   reads a copy of IBJA's page saved on the
                           computer, instead of downloading it (the tests
                           use this).

BY HAND, only if the automatic run is broken (the website chat can do
it): type the rates yourself, for 1 gram, and their date:

    python3 scripts/update_prices.py --gold 12389.3 --silver 152.528 --date 2026-11-20

(Run it from the purevesting-website folder. On Windows, if "python3" is
not found, type "python" or "py" instead.) Typed by hand, prices.json
gets only the 24K and silver rates; 22K, 18K and 14K are then worked out
as 22, 18 or 14 parts of 24 until the next automatic run.

WHAT IT DOES
  1. Checks the rates. It stops, changing nothing, if a rate is more than
     five times (or less than a fifth of) the last one: a rate for 10
     grams or 1 kg read or typed by mistake. It also stops on more than
     three decimals, or a date that is wrong or in the future. In the
     automatic run, rates no newer than the site's change nothing.
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
  5. Prints the rates and the new nisab.

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
import time
import urllib.request
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from html.parser import HTMLParser
from pathlib import Path

# The purevesting-website folder: the folder above scripts/.
SITE = Path(__file__).resolve().parent.parent

PRICES_FILE = SITE / "assets" / "data" / "prices.json"
SITEMAP = SITE / "sitemap.xml"
OUR_SITE = "https://purevesting.com"

# Where the rates come from (written into prices.json).
SOURCE_NAME = "IBJA"
SOURCE_URL = "https://ibjarates.com/"

# How the script introduces itself to IBJA's site: as a normal browser,
# as the screener update does for NSE.
BROWSER = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                         "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"}

# The columns it reads from IBJA's PM table (their names on IBJA's page),
# what IBJA gives each one for, and where it goes in prices.json.
IBJA_COLUMNS = {
    "Gold 999": (Decimal(10), "gold_24k_per_gram"),
    "Silver 999": (Decimal(1000), "silver_999_per_gram"),
    "Gold 916": (Decimal(10), "gold_22k_per_gram"),
    "Gold 750": (Decimal(10), "gold_18k_per_gram"),
    "Gold 585": (Decimal(10), "gold_14k_per_gram"),
}

# IBJA's own rates for 22K, 18K and 14K, in prices.json (step 1.1).
KARAT_FIELDS = ["gold_22k_per_gram", "gold_18k_per_gram", "gold_14k_per_gram"]

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
# READING IBJA'S PAGE — for the automatic run (--from-ibja)
# ==========================================================================

class IbjaTable(HTMLParser):
    """Reads every table cell on IBJA's page that has a data-label (IBJA
    names each cell after its column: "PM", "Gold 999", "Silver 999"…),
    and groups them into the rows of the PM table."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pm_rows = []        # each one: {"PM": "20/11/2026", "Gold 999": "123893", …}
        self.row = None          # the PM row being read
        self.label = None        # the column of the cell being read
        self.words = []

    def handle_starttag(self, tag, attrs):
        if tag != "td":
            return
        label = (dict(attrs).get("data-label") or "").strip()
        if label in ("AM", "PM"):
            self.row = {} if label == "PM" else None   # a new row: keep it if it is PM
            if self.row is not None:
                self.pm_rows.append(self.row)
        self.label = label
        self.words = []

    def handle_data(self, data):
        if self.label:
            self.words.append(data)

    def handle_endtag(self, tag):
        if tag == "td" and self.label:
            if self.row is not None:
                self.row[self.label] = "".join(self.words).strip()
            self.label = None


def download_ibja():
    """IBJA's page, downloaded. Tries three times, a little apart."""
    for attempt in range(1, 4):
        try:
            request = urllib.request.Request(SOURCE_URL, headers=BROWSER)
            with urllib.request.urlopen(request, timeout=40) as answer:
                return answer.read().decode("utf-8", errors="replace")
        except OSError as problem:
            if attempt == 3:
                stop(f"IBJA's page ({SOURCE_URL}) did not open: {problem}")
            time.sleep(10 * attempt)


def read_ibja(page_text):
    """IBJA's newest closing (PM) rates: (their date, {prices.json name:
    the rate for 1 gram}). Stops if the page doesn't look as expected."""
    table = IbjaTable()
    table.feed(page_text)
    newest = None
    for row in table.pm_rows:
        try:
            day = datetime.datetime.strptime(row.get("PM", ""), "%d/%m/%Y").date()
        except ValueError:
            continue
        if all(column in row for column in IBJA_COLUMNS) and (newest is None or day > newest[0]):
            newest = (day, row)
    if newest is None:
        stop("IBJA's page has changed: its PM table, with the columns "
             f"{', '.join(IBJA_COLUMNS)}, was not found. The website chat can fix this script.")
    day, row = newest
    rates = {}
    for column, (unit, field) in IBJA_COLUMNS.items():
        written = row[column].replace(",", "")
        if not re.fullmatch(r"\d+(\.\d+)?", written):
            stop(f'IBJA\'s "{column}" for {row["PM"]} is not a number: "{row[column]}".')
        rates[field] = Decimal(written) / unit
    return day, rates


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
    parser.add_argument("--from-ibja", nargs="?", const="download", metavar="SAVED_PAGE",
                        help="read IBJA's newest PM rates from ibjarates.com (or from a saved copy)")
    parser.add_argument("--gold",
                        help="by hand: IBJA's gold 999 (24K) rate for 1 gram (its rate for 10 g, divided by 10)")
    parser.add_argument("--silver",
                        help="by hand: IBJA's silver 999 rate for 1 gram (its rate for 1 kg, divided by 1,000)")
    parser.add_argument("--date",
                        help="by hand: the date of those rates, year-month-day, like 2026-11-20")
    args = parser.parse_args()

    # 1. The rates, checked: read from IBJA, or typed by hand.
    last = read_last_prices()
    karat_rates = {}                     # IBJA's own 22K, 18K and 14K rates
    if args.from_ibja:
        if args.gold or args.silver or args.date:
            stop("use either --from-ibja, or --gold, --silver and --date, not both.")
        page_text = download_ibja() if args.from_ibja == "download" else read_text(Path(args.from_ibja))
        day, ibja = read_ibja(page_text)
        if day > datetime.date.today():
            stop(f"IBJA's newest rates are dated {day.isoformat()}, in the future. Not used.")
        if last and day < last["as_of"]:
            print(f"IBJA's newest rates ({date_words(day)}) are older than the site's "
                  f"({date_words(last['as_of'])}). Nothing changed.")
            return 0
        gold, silver = ibja["gold_24k_per_gram"], ibja["silver_999_per_gram"]
        karat_rates = {field: ibja[field] for field in KARAT_FIELDS}
        print(f"Read from {SOURCE_URL}: the PM rates of {date_words(day)}.")
    else:
        if not (args.gold and args.silver and args.date):
            stop("give --from-ibja, or all three of --gold, --silver and --date.")
        gold = read_rate(args.gold, "--gold")
        silver = read_rate(args.silver, "--silver")
        day = read_date(args.date)
    check_move(gold, last and last["gold"], "--gold", "10 grams")
    check_move(silver, last and last["silver"], "--silver", "1 kg")
    for field, rate in karat_rates.items():
        # Each karat's rate must sit between half and all of the 24K rate.
        if not gold / 2 < rate <= gold:
            stop(f"IBJA's {field} rate ({rate}) doesn't fit its 24K rate ({gold}). Not used.")

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
    # IBJA's own 22K, 18K and 14K rates go in too when they were read from
    # IBJA; typed by hand, they are left out, and the pages work them out
    # as 22, 18 or 14 parts of 24 (assets/calc/nisab.js).
    prices = {
        "as_of": iso_date,
        "source_name": SOURCE_NAME,
        "source_url": SOURCE_URL,
        "gold_24k_per_gram": json_number(gold),
        "silver_999_per_gram": json_number(silver),
    }
    for field, rate in karat_rates.items():
        prices[field] = json_number(rate)
    prices_text = json.dumps(prices, indent=2, ensure_ascii=False) + "\n"

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
    if karat_rates:
        print("  Gold 22K, 18K, 14K: " + ", ".join(rate_words(rate) for rate in karat_rates.values())
              + " a gram (IBJA's 916, 750 and 585)")
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
    if args.from_ibja:
        print("Next (GitHub does this by itself): the checker and the tests, then save and publish.")
    else:
        print("Next: look at the page, run python3 scripts/check_site.py, then commit and push.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
