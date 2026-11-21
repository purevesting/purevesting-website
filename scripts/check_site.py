"""
CHECK THE SITE — run it before anything goes live.

    python3 scripts/check_site.py

(Run it from the purevesting-website folder. On Windows, if "python3" is
not found, type "python" or "py" instead of "python3".)

What it does: it reads every page that goes live on purevesting.com —
every .html file, except the ones .assetsignore keeps off the site — and
prints one line per problem, like this:

    ERROR  instruments/epf/index.html:57  what is wrong, in plain English
    WARN   index.html:12  something for a person to look at

"instruments/epf/index.html:57" means line 57 of that file. In VS Code,
hold Ctrl and click it to jump straight there.

    ERROR  must be fixed before anything goes live (CLAUDE.md).
    WARN   is for MAS to look at and decide. It may be fine as it is.

At the end it prints how many it found. If there is any ERROR, it stops
with an error code (1), so a person or a tool can tell the check failed.

It only reads. It never changes a file. It uses plain Python only:
nothing to install. Not published on the site (scripts/ is listed in
.assetsignore).
"""

# ==========================================================================
# THE LISTS — add to them whenever you like: one entry per line, in
# quotes, with a comma at the end. Capitals don't matter. A space also
# matches a hyphen or a line break, and an entry also finds longer words
# that start with it ("Darul" finds "Darul Uloom", "guaranteed" finds
# "guaranteed").
# ==========================================================================

# Names that must never be in the page text (CLAUDE.md, "Never" rule 1).
# They may appear only in link addresses and in the closed Sources part.
BANNED_NAMES = [
    "Deoband",
    "Darul",
    "Nadwa",
    "Barelvi",
    "Jamiat",
    "Ahle Hadith",
    "TASIS",
    "ShariahCap",
    "AAOIFI",
    "Dow Jones",
    # Schools of thought and a fiqh council (added in step 1.1). "Shafi"
    # also finds "Shafi'i" and "Shafii".
    "Hanafi",
    "Shafi",
    "Maliki",
    "Hanbali",
    "Fiqh Academy",
]

# "Not advice" kinds of lines (CLAUDE.md, "Never" rule 7). A page may
# have only one: the footer line. The /disclaimer/ page may say it as
# often as it needs to, because that is its job.
NOT_ADVICE_LINES = [
    "not investment advice",
    "not financial advice",
    "not advice",
    "never recommend",
    "not a recommendation",
    "not a ruling",
]

# Advice words (CLAUDE.md, "Never" rule 2). These are WARNs: a person
# decides, because some uses are fine ("nothing here is guaranteed").
ADVICE_WORDS = [
    "best stocks",
    "stocks to buy",
    "should buy",
    "should sell",
    "we recommend",
    "target price",
    "guaranteed",
    "assured return",
    "safe return",
    "multibagger",
]

# Words that must not sit close to "bank" (CLAUDE.md, "Never" rule 4: a
# cooperative is never called a bank).
COOPERATIVE_WORDS = [
    "cooperative",
    "co-operative",
    "society",
    "societies",
]
BANK_DISTANCE = 60      # how many letters apart counts as "close"

TITLE_MAX = 60          # letters in a page's <title>, before Google cuts it
DESCRIPTION_MAX = 160   # letters in a page's description, the same


# ==========================================================================
# THE SETTINGS — these rarely change.
# ==========================================================================

import json
import os
import posixpath
import re
import sys
import xml.etree.ElementTree as ElementTree
from fnmatch import fnmatchcase
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

# The purevesting-website folder: the folder above scripts/.
SITE = Path(__file__).resolve().parent.parent

# The site's own address. Links to these hosts are links to our own pages.
OUR_SITE = "https://purevesting.com"
OUR_HOSTS = ("purevesting.com", "www.purevesting.com")

# Pages that never go in sitemap.xml: "page not found" and the offline
# page. (Pages marked noindex are left out too, wherever they are.)
NOT_IN_SITEMAP = ("404.html", "offline/index.html")

# The one page that may say "not investment advice" many times.
DISCLAIMER_PAGE = "disclaimer/index.html"

# File endings that mean "this is a picture".
IMAGE_ENDINGS = (".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".ico")

# Tags that sit inside a line of text. Every other tag (a paragraph, a
# heading, a list item...) starts a new piece of text, so words from two
# different boxes are never read as one.
INLINE_TAGS = (
    "a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em",
    "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub",
    "sup", "time", "u", "var", "wbr",
)

# Attributes whose words a visitor can see or hear: a picture's words for
# people who can't see it, a pop-up hint, a screen reader's label, a box's
# grey example text, and the words of a "Share as image" picture.
TEXT_ATTRIBUTES = ("alt", "title", "aria-label", "placeholder", "data-share-text")

# Lines in the <head> whose words Google, WhatsApp and others show.
TEXT_META = (
    "description", "og:title", "og:description", "og:image:alt",
    "twitter:title", "twitter:description", "twitter:image:alt",
)

# Lines in the <head> that hold an address (the link picture, the page's own address).
ADDRESS_META = ("og:image", "og:image:url", "og:image:secure_url", "og:url", "twitter:image")

# Attributes that hold an address.
ADDRESS_ATTRIBUTES = ("href", "src", "poster", "action", "formaction", "xlink:href")

# Attributes that can set a colour.
COLOUR_ATTRIBUTES = (
    "fill", "stroke", "color", "bgcolor", "stop-color", "flood-color", "lighting-color",
)

# What a typed colour code looks like: #0E9E6E (or #FFF, or #0E9E6E80),
# or rgb(…), rgba(…), hsl(…), hsla(…). "&#8377;" (the ₹ sign) is not one.
COLOUR_CODE = re.compile(
    r"(?<!&)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b"
    r"|\b(?:rgba?|hsla?)\([^)]*\)"
)

# The header and the footer that every page shares.
HEADER_BLOCK = re.compile(r"<header\b[^>]*\bsite-header\b[^>]*>.*?</header>", re.S)
FOOTER_BLOCK = re.compile(r"<footer\b[^>]*\bsite-footer\b[^>]*>.*?</footer>", re.S)

# The word "bank" (and "banks", "banking").
BANK_WORD = re.compile(r"\bbank(?:s|ing)?\b", re.IGNORECASE)


# ==========================================================================
# THE PROBLEM LIST — every check adds its problems here; they are printed
# at the end.
# ==========================================================================

problems = []   # each one: (level, file, line, message)


def report(level, file, line, message):
    """Adds one problem to the list. level is "ERROR" or "WARN"."""
    problems.append((level, file, line, message))


# ==========================================================================
# WHAT GOES LIVE — .assetsignore, and finding a page from its address.
# ==========================================================================

def read_ignore_list():
    """The lines of .assetsignore, without its comments and empty lines."""
    path = SITE / ".assetsignore"
    if not path.is_file():
        return []
    patterns = []
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            patterns.append(line)
    return patterns


IGNORE_PATTERNS = read_ignore_list()


def is_ignored(rel_path, is_folder=False):
    """True if .assetsignore keeps this file (or folder) off the live site.

    It follows the .gitignore rules, simply: "TODO.md" means a file of that
    name in any folder; "scripts/" means the folder scripts and everything
    in it; a "/" at the start or in the middle ties the line to the top
    folder; "*" matches anything; a line starting with "!" brings a file
    back. rel_path looks like "scripts/update_screener.py".
    """
    parts = rel_path.strip("/").split("/")
    ignored = False
    for pattern in IGNORE_PATTERNS:
        bring_back = pattern.startswith("!")
        if bring_back:
            pattern = pattern[1:]
        folders_only = pattern.endswith("/")
        pattern = pattern.rstrip("/")
        from_top = "/" in pattern
        pattern = pattern.lstrip("/")
        # Try the file's own name, and the name of every folder above it.
        for depth in range(1, len(parts) + 1):
            is_a_folder = depth < len(parts) or is_folder
            if folders_only and not is_a_folder:
                continue
            if from_top:
                name = "/".join(parts[:depth])
            else:
                name = parts[depth - 1]
            if fnmatchcase(name, pattern):
                ignored = not bring_back
                break
    return ignored


@lru_cache(maxsize=None)
def names_in_folder(folder):
    """The names of the files and folders inside one folder."""
    try:
        return set(os.listdir(folder))
    except OSError:
        return set()


def file_exists_exactly(rel_path):
    """True if the file is in the folder, spelled with the same capital and
    small letters. The live site cares about capitals even when Windows
    doesn't: /About/ works on a Windows computer but not on purevesting.com."""
    folder = SITE
    for part in rel_path.split("/"):
        if part not in names_in_folder(str(folder)):
            return False
        folder = folder / part
    return folder.is_file()


def files_for_address(path):
    """The files that could answer an address on the live site, in the
    order Cloudflare tries them: /about/ is about/index.html, /404 is
    404.html, /assets/site.css is that file."""
    keep_slash = path.endswith("/")
    rel = posixpath.normpath("/" + path).lstrip("/")   # tidies "/a/../b"
    if rel in ("", "."):
        return ["index.html"]
    if keep_slash:
        return [rel + "/index.html", rel + ".html"]
    return [rel, rel + ".html", rel + "/index.html"]


def find_file(path):
    """The file that answers this address on the live site, or None."""
    for rel in files_for_address(path):
        if file_exists_exactly(rel) and not is_ignored(rel):
            return rel
    return None


def our_path(address, page_address):
    """If the address is on purevesting.com, its path (like "/about/").
    None if it goes to another website, or is an email, a phone number or
    a jump within the same page (#sources)."""
    address = address.strip()
    if not address or address.startswith("#"):
        return None
    full = urljoin(OUR_SITE + page_address, address)
    parts = urlsplit(full)
    if parts.scheme not in ("http", "https") or parts.hostname not in OUR_HOSTS:
        return None
    return unquote(parts.path) or "/"


def page_address(rel_path):
    """A page's address on the live site: about/index.html is /about/."""
    if rel_path == "index.html":
        return "/"
    if rel_path.endswith("/index.html"):
        return "/" + rel_path[: -len("index.html")]
    return "/" + rel_path[: -len(".html")]


def published_pages():
    """Every .html file that goes live, as paths like "about/index.html"."""
    pages = []
    for folder, subfolders, files in os.walk(SITE):
        rel_folder = Path(folder).relative_to(SITE).as_posix()
        rel_folder = "" if rel_folder == "." else rel_folder + "/"
        # Don't even look inside folders that never go live (.git, scripts…).
        subfolders[:] = [
            name for name in subfolders
            if not is_ignored(rel_folder + name, is_folder=True)
        ]
        for name in files:
            rel = rel_folder + name
            if name.lower().endswith(".html") and not is_ignored(rel):
                pages.append(rel)
    return sorted(pages)


# ==========================================================================
# READING A PAGE — goes through one page from top to bottom and notes down
# everything the checks need: its words, its addresses, its images, its
# ids, its styles and its structured data.
# ==========================================================================

class PageReader(HTMLParser):

    def __init__(self):
        super().__init__(convert_charrefs=True)
        # What the checks use:
        self.words = []          # the page text, piece by piece: (line, text, in_sources, in_footer)
        self.addresses = []      # every address on the page: (line, address, what holds it)
        self.ids = set()         # every id="…"
        self.data_srcs = []      # every data-src="…": (line, value)
        self.images = []         # every <img>: (line, its attributes)
        self.colour_places = []  # styles and scripts, where a colour code could hide: (line, text)
        self.json_blocks = []    # every JSON-LD block: (line, text)
        self.title = None        # the words of <title>
        self.title_line = 1
        self.description = None  # the words of <meta name="description">
        self.description_line = 1
        self.head_line = 1
        self.has_canonical = False
        self.has_og_image = False
        self.noindex = False
        # Where the reader is right now:
        self.inside = None       # "json", "script", "style", or None
        self.json_line = 1
        self.json_text = []
        self.title_text = None   # a list, while inside the page's <title>
        self.in_body = False
        self.sources_depth = 0   # above 0 while inside the closed Sources part
        self.footer_depth = 0    # above 0 while inside the site's footer

    def add_words(self, line, text):
        """Notes down some page text, with where it is."""
        self.words.append((line, text, self.sources_depth > 0, self.footer_depth > 0))

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        a = {}
        for name, value in attrs:
            a[name] = value if value is not None else ""
        classes = a.get("class", "").split()

        # Where we are: the body, the closed Sources part, the footer.
        if tag == "head":
            self.head_line = line
        if tag == "body":
            self.in_body = True
        if tag == "details":
            if self.sources_depth > 0:
                self.sources_depth += 1
            elif "sources" in classes and "open" not in a:
                self.sources_depth = 1
        if tag == "footer":
            if self.footer_depth > 0 or "site-footer" in classes:
                self.footer_depth += 1

        # Most tags start a new piece of text.
        if tag not in INLINE_TAGS:
            self.add_words(line, " ")

        # Words a visitor can see or hear in attributes.
        for name in TEXT_ATTRIBUTES:
            if a.get(name):
                self.add_words(line, " " + a[name] + " ")
        if tag == "input" and a.get("type", "").lower() in ("submit", "button", "reset"):
            if a.get("value"):
                self.add_words(line, " " + a["value"] + " ")

        # Addresses.
        for name in ADDRESS_ATTRIBUTES:
            if a.get(name):
                self.addresses.append((line, a[name], tag))
        if tag == "object" and a.get("data"):
            self.addresses.append((line, a["data"], tag))
        if a.get("srcset"):
            for choice in a["srcset"].split(","):
                bits = choice.split()
                if bits:
                    self.addresses.append((line, bits[0], tag))

        # The lines in the <head>.
        if tag == "meta":
            kind = (a.get("name") or a.get("property") or "").strip().lower()
            content = a.get("content", "")
            if kind == "description":
                self.description = " ".join(content.split())
                self.description_line = line
            if kind == "robots" and "noindex" in content.lower():
                self.noindex = True
            if kind == "og:image" and content.strip():
                self.has_og_image = True
            if kind in TEXT_META:
                self.add_words(line, " " + content + " ")
            if kind in ADDRESS_META and content.strip():
                self.addresses.append((line, content, "meta " + kind))
        if tag == "link" and "canonical" in a.get("rel", "").lower().split():
            if a.get("href", "").strip():
                self.has_canonical = True
        if tag == "title" and not self.in_body and self.title is None:
            self.title_text = []
            self.title_line = line

        # Ids, sources and images.
        if a.get("id"):
            self.ids.add(a["id"])
        if "data-src" in a:
            self.data_srcs.append((line, a["data-src"].strip()))
        if tag == "img":
            self.images.append((line, a))

        # Places where a colour can be set. (Not <meta name="theme-color">:
        # the browser reads that colour before any stylesheet, so it can't
        # use a colour name. It stays the cream code of --bone.)
        if a.get("style"):
            self.colour_places.append((line, a["style"]))
        for name in COLOUR_ATTRIBUTES:
            if a.get(name):
                self.colour_places.append((line, a[name]))

        # Scripts and styles: their insides are code, not page text.
        if tag == "script":
            if a.get("type", "").strip().lower() == "application/ld+json":
                self.inside = "json"
                self.json_line = line
                self.json_text = []
            else:
                self.inside = "script"
        if tag == "style":
            self.inside = "style"

    def handle_endtag(self, tag):
        line = self.getpos()[0]
        if tag == "script" and self.inside == "json":
            self.json_blocks.append((self.json_line, "".join(self.json_text)))
        if tag in ("script", "style"):
            self.inside = None
            return
        if tag == "title" and self.title_text is not None:
            self.title = " ".join("".join(self.title_text).split())
            self.title_text = None
        if tag == "details" and self.sources_depth > 0:
            self.sources_depth -= 1
        if tag == "footer" and self.footer_depth > 0:
            self.footer_depth -= 1
        if tag not in INLINE_TAGS:
            self.add_words(line, " ")

    def handle_data(self, data):
        line = self.getpos()[0]
        if self.inside == "json":
            if not self.json_text:
                self.json_line = line
            self.json_text.append(data)
            return
        if self.inside in ("script", "style"):
            self.colour_places.append((line, data))
            return
        if self.title_text is not None:
            self.title_text.append(data)
        self.add_words(line, data)


def json_strings(value):
    """Every piece of text inside a JSON-LD block (the values, not the
    names before the colons)."""
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for inner in value.values():
            yield from json_strings(inner)
    elif isinstance(value, list):
        for inner in value:
            yield from json_strings(inner)


def join_words(pieces):
    """Puts a page's text together into one long text, with every run of
    spaces and line breaks made one space, so a phrase is found even when
    it is split over two lines or around a <strong>. Remembers, for every
    letter: its line in the file, whether it is in the footer, and whether
    it is in the closed Sources part."""
    letters, lines, in_footer, in_sources = [], [], [], []
    for line, text, sources, footer in pieces:
        for letter in text:
            if letter.isspace():
                if not letters or letters[-1] != " ":
                    letters.append(" ")
                    lines.append(line)
                    in_footer.append(footer)
                    in_sources.append(sources)
                if letter == "\n":
                    line += 1
            else:
                letters.append(letter)
                lines.append(line)
                in_footer.append(footer)
                in_sources.append(sources)
    return "".join(letters), lines, in_footer, in_sources


class Page:
    """One page: its file, its address, and everything read from it."""

    def __init__(self, rel_path):
        self.file = rel_path
        self.address = page_address(rel_path)
        self.source = (SITE / rel_path).read_text(encoding="utf-8-sig", errors="replace")
        self.reader = PageReader()
        self.reader.feed(self.source)
        self.reader.close()

        # The structured data (JSON-LD): note any block that isn't valid
        # JSON; add the words of the valid ones to the page text, and
        # their addresses to the page's addresses.
        self.json_problems = []
        for line, text in self.reader.json_blocks:
            try:
                data = json.loads(text)
            except json.JSONDecodeError as problem:
                self.json_problems.append((line + problem.lineno - 1, problem.msg))
                continue
            for value in json_strings(data):
                found = text.find(json.dumps(value, ensure_ascii=False)[1:-1])
                value_line = line + (text.count("\n", 0, found) if found >= 0 else 0)
                if value.startswith(("http://", "https://", "/")) and " " not in value:
                    self.reader.addresses.append((value_line, value, "JSON-LD"))
                else:
                    self.reader.words.append((value_line, " " + value + " ", False, False))

        self.text, self.lines, self.in_footer, self.in_sources = join_words(self.reader.words)


# ==========================================================================
# SMALL HELPERS FOR THE WORD CHECKS
# ==========================================================================

def find_phrases(text, phrases):
    """Finds every entry of a list in the text. Gives back (entry, match)
    pairs. Capitals don't matter; a space in an entry also matches a hyphen;
    an entry also finds longer words that start with it."""
    for phrase in phrases:
        words = [re.escape(word) for word in phrase.split()]
        pattern = re.compile(r"\b" + r"[\s\-]+".join(words), re.IGNORECASE)
        for match in pattern.finditer(text):
            yield phrase, match


def around(page, start, end):
    """A few words either side of a hit, so it is easy to find on the page."""
    left = max(0, start - 35)
    right = min(len(page.text), end + 35)
    words = page.text[left:right].strip()
    if left > 0:
        words = "..." + words
    if right < len(page.text):
        words = words + "..."
    return words


# ==========================================================================
# THE CHECKS — one part per check. Each says what it looks for and why.
# ==========================================================================

# --------------------------------------------------------------------------
# ERROR — A BANNED NAME IN THE PAGE TEXT.
# A madrasa, a school of thought, a board or a standards body must never
# be named where visitors read (CLAUDE.md, "Never" rule 1). "Page text"
# means everything a visitor, Google or WhatsApp can read as words: the
# page itself, the title and description in the <head>, the words of
# pictures and buttons, and the structured data. It does NOT mean link
# addresses, and it does NOT count the closed Sources part at the bottom.
# The names are in BANNED_NAMES, at the top of this file.
# --------------------------------------------------------------------------
def check_banned_names(page):
    seen = set()
    for name, match in find_phrases(page.text, BANNED_NAMES):
        if page.in_sources[match.start()]:
            continue
        line = page.lines[match.start()]
        if (line, name) in seen:
            continue
        seen.add((line, name))
        report("ERROR", page.file, line,
               f'A name that must not be in the page text: "{match.group(0)}" '
               f'("{around(page, match.start(), match.end())}"). Say "a fatwa" or '
               f'"scholars" instead; its link may stay in the closed Sources part.')


# --------------------------------------------------------------------------
# ERROR — MORE THAN ONE "NOT INVESTMENT ADVICE" KIND OF LINE.
# The footer line is the only one allowed on a page (CLAUDE.md, "Never"
# rule 7). Every other line that says "not advice", "never recommend",
# "not a ruling"… is reported. The /disclaimer/ page is the exception.
# The phrases are in NOT_ADVICE_LINES, at the top of this file.
# --------------------------------------------------------------------------
def check_not_advice_lines(page):
    if page.file == DISCLAIMER_PAGE:
        return
    hits = {}   # line in the file → (is it in the footer?, the words around it)
    for phrase, match in find_phrases(page.text, NOT_ADVICE_LINES):
        line = page.lines[match.start()]
        if line not in hits:
            hits[line] = (page.in_footer[match.start()],
                          around(page, match.start(), match.end()))
    if len(hits) <= 1:
        return
    for line in sorted(hits):
        in_footer, words = hits[line]
        if in_footer:
            continue
        report("ERROR", page.file, line,
               f'One "not investment advice" line too many: "{words}". The '
               f"footer line is the only one allowed on a page; take this one out.")


# --------------------------------------------------------------------------
# ERROR — A LINK TO ONE OF OUR OWN PAGES THAT DOES NOT EXIST, OR AN IMAGE
# FILE THAT DOES NOT EXIST.
# Every address on the page that points at purevesting.com (like
# "/screener/" or "https://purevesting.com/assets/og/epf.jpg") must have a
# file behind it that goes live. Links to other websites are not checked:
# that needs the internet.
# --------------------------------------------------------------------------
def check_links(page):
    seen = set()
    for line, address, holder in page.reader.addresses:
        path = our_path(address, page.address)
        if path is None or (line, path) in seen:
            continue
        seen.add((line, path))
        if find_file(path):
            continue
        is_image = (holder in ("img", "source") or "image" in holder
                    or path.lower().endswith(IMAGE_ENDINGS))
        hidden = [rel for rel in files_for_address(path)
                  if file_exists_exactly(rel) and is_ignored(rel)]
        if hidden:
            report("ERROR", page.file, line,
                   f"{address} points to {hidden[0]}, but .assetsignore keeps "
                   f"that file off the live site.")
        elif is_image:
            report("ERROR", page.file, line,
                   f"The image {address} does not exist: no such file in the "
                   f"folder (check the spelling and the capital letters).")
        else:
            report("ERROR", page.file, line,
                   f"The link {address} goes to a page or file that does not "
                   f"exist (check the spelling and the capital letters).")


# --------------------------------------------------------------------------
# ERROR — A HEADER OR FOOTER THAT IS NOT THE SAME AS THE ONE IN index.html.
# The header (logo and menu) and the footer are identical on every page,
# so one find-and-replace changes them everywhere (README.md, "How to add
# a page"). The only difference allowed is the mark for the page you are
# on (is-current, aria-current="page"), which site.js adds by itself.
# --------------------------------------------------------------------------
def without_current_mark(block):
    """The lines of a header or footer, without the "you are here" mark."""
    block = re.sub(r'[ \t]+aria-current="[^"]*"', "", block)
    block = re.sub(
        r'class="([^"]*)"',
        lambda found: 'class="' + " ".join(
            word for word in found.group(1).split() if word != "is-current") + '"',
        block)
    return [line.rstrip() for line in block.split("\n")]


def check_header_footer(page, reference):
    for name, pattern in (("header", HEADER_BLOCK), ("footer", FOOTER_BLOCK)):
        if reference.get(name) is None:
            continue    # index.html has none to compare with; reported there
        found = pattern.search(page.source)
        if not found:
            report("ERROR", page.file, 1,
                   f'This page has no {name} (<{name} class="site-{name}">). '
                   f"Copy the whole {name} from index.html.")
            continue
        first_line = page.source.count("\n", 0, found.start()) + 1
        mine = without_current_mark(found.group(0))
        theirs = reference[name]
        if mine == theirs:
            continue
        for number in range(max(len(mine), len(theirs))):
            their_line = theirs[number] if number < len(theirs) else "(nothing)"
            my_line = mine[number] if number < len(mine) else "(nothing)"
            if their_line != my_line:
                report("ERROR", page.file, first_line + number,
                       f"The {name} is not the same as in index.html. Here it "
                       f'says "{my_line.strip()}"; index.html says '
                       f'"{their_line.strip()}". Copy the whole {name} from index.html.')
                break


# --------------------------------------------------------------------------
# ERROR — A PAGE MISSING FROM sitemap.xml, OR A SITEMAP LINE WITH NO PAGE.
# sitemap.xml is the list of pages Google reads. Every page that goes live
# must be in it, except 404.html, offline/ and pages marked noindex. And
# every address in it must have a page behind it.
# --------------------------------------------------------------------------
def check_sitemap(pages):
    sitemap = SITE / "sitemap.xml"
    if not sitemap.is_file():
        report("ERROR", "sitemap.xml", 1, "There is no sitemap.xml in the top folder.")
        return
    source = sitemap.read_text(encoding="utf-8-sig")
    try:
        root = ElementTree.fromstring(source)
    except ElementTree.ParseError as problem:
        report("ERROR", "sitemap.xml", problem.position[0],
               f"sitemap.xml is broken, so Google can't read it ({problem}). "
               f"Look for a missing < or > near here.")
        return
    listed = set()
    for element in root.iter():
        if element.tag.split("}")[-1] != "loc":
            continue
        address = (element.text or "").strip()
        where = re.search(r"<loc>\s*" + re.escape(address) + r"\s*</loc>", source)
        line = source.count("\n", 0, where.start()) + 1 if where else 1
        if not address.startswith(OUR_SITE + "/"):
            report("ERROR", "sitemap.xml", line,
                   f'"{address}" is not a purevesting.com page. Every address '
                   f"here must start with {OUR_SITE}/")
            continue
        file = find_file(unquote(urlsplit(address).path))
        if file is None:
            report("ERROR", "sitemap.xml", line,
                   f"sitemap.xml lists {address}, but there is no page there. "
                   f"Delete its <url> block, or fix the address.")
        else:
            listed.add(file)
    for page in pages:
        if page.file in NOT_IN_SITEMAP or page.reader.noindex:
            continue
        if page.file not in listed:
            report("ERROR", page.file, 1,
                   f"This page is not in sitemap.xml. Copy a <url> block there "
                   f"and change its address to {OUR_SITE}{page.address}")


# --------------------------------------------------------------------------
# ERROR — A data-src THAT POINTS TO A SOURCE THAT IS NOT ON THE PAGE.
# A figure's data-src="src-…" names the line in Sources that it comes from
# (README.md, "Building blocks"). That line, with the same id, must be on
# the page, or tapping the figure shows nothing. data-src="none" means
# "not a sourced figure", so it is fine.
# --------------------------------------------------------------------------
def check_data_src(page):
    for line, value in page.reader.data_srcs:
        if value == "none":
            continue
        if value not in page.reader.ids:
            report("ERROR", page.file, line,
                   f'data-src="{value}" points to a source that is not on this '
                   f'page. Give the right line in Sources id="{value}", or fix the name.')


# --------------------------------------------------------------------------
# ERROR — A JSON-LD BLOCK THAT IS NOT VALID JSON.
# The structured data (<script type="application/ld+json">) is what Google
# reads about a page. One missing comma or quote, and Google ignores the
# whole block.
# --------------------------------------------------------------------------
def check_json_ld(page):
    for line, message in page.json_problems:
        report("ERROR", page.file, line,
               f"The structured data (JSON-LD) is broken here ({message}), so "
               f"Google ignores all of it. Look for a missing comma, quote or "
               f"bracket on this line or the one before.")


# --------------------------------------------------------------------------
# WARN — ADVICE WORDS.
# We explain, calculate and compare facts; we never advise (CLAUDE.md,
# "Never" rule 2). The words are in ADVICE_WORDS, at the top of this file.
# --------------------------------------------------------------------------
def check_advice_words(page):
    seen = set()
    for phrase, match in find_phrases(page.text, ADVICE_WORDS):
        line = page.lines[match.start()]
        if (line, phrase) in seen:
            continue
        seen.add((line, phrase))
        report("WARN", page.file, line,
               f'An advice word: "{match.group(0)}" '
               f'("{around(page, match.start(), match.end())}").')


# --------------------------------------------------------------------------
# WARN — "BANK" CLOSE TO "COOPERATIVE", "CO-OPERATIVE" OR "SOCIETY".
# A cooperative must never be called a bank (CLAUDE.md, "Never" rule 4).
# "Close" means within BANK_DISTANCE letters (60), on either side.
# --------------------------------------------------------------------------
def check_bank_words(page):
    near_words = [match for phrase, match in find_phrases(page.text, COOPERATIVE_WORDS)]
    seen = set()
    for bank in BANK_WORD.finditer(page.text):
        for other in near_words:
            if other.start() >= bank.end():
                gap = other.start() - bank.end()
            else:
                gap = bank.start() - other.end()
            if gap <= BANK_DISTANCE:
                line = page.lines[bank.start()]
                if line not in seen:
                    seen.add(line)
                    first = min(bank.start(), other.start())
                    last = max(bank.end(), other.end())
                    report("WARN", page.file, line,
                           f'"{bank.group(0)}" is close to "{other.group(0)}" '
                           f'("{around(page, first, last)}"). Never call a '
                           f"cooperative a bank.")
                break


# --------------------------------------------------------------------------
# WARN — HOW THE PAGE SHOWS ON GOOGLE AND WHATSAPP.
# A title over TITLE_MAX letters (60) or a description over
# DESCRIPTION_MAX letters (160) gets cut off in Google's results. Without
# a canonical link Google may pick the wrong address for the page; without
# og:image, WhatsApp shows no picture for its link. (Pages marked noindex,
# like 404.html, need no canonical link: Google doesn't list them.)
# --------------------------------------------------------------------------
def check_google_basics(page):
    reader = page.reader
    if not reader.title:
        report("WARN", page.file, reader.head_line, "This page has no <title>.")
    elif len(reader.title) > TITLE_MAX:
        report("WARN", page.file, reader.title_line,
               f"The page title is {len(reader.title)} letters long; Google "
               f'shows about {TITLE_MAX}: "{reader.title}"')
    if not reader.description:
        report("WARN", page.file, reader.head_line,
               'This page has no description (<meta name="description">).')
    elif len(reader.description) > DESCRIPTION_MAX:
        report("WARN", page.file, reader.description_line,
               f"The description is {len(reader.description)} letters long; "
               f"Google shows about {DESCRIPTION_MAX}.")
    if not reader.has_canonical and not reader.noindex:
        report("WARN", page.file, reader.head_line,
               'This page has no canonical link (<link rel="canonical" href="…">).')
    if not reader.has_og_image:
        report("WARN", page.file, reader.head_line,
               'This page has no og:image, so its link shows no picture on '
               'WhatsApp (<meta property="og:image" content="…">).')


# --------------------------------------------------------------------------
# WARN — A COLOUR CODE TYPED INSIDE A PAGE.
# Colours are used only by their names from assets/site.css, section 2
# (CLAUDE.md, "Always" rule 4): var(--green), not #0E9E6E. This looks in
# the places where a colour can be set: style="…", <style>, fill="…" and
# stroke="…" in drawings, and the page's own scripts.
# --------------------------------------------------------------------------
def check_colour_codes(page):
    seen = set()
    for line, text in page.reader.colour_places:
        for match in COLOUR_CODE.finditer(text):
            code_line = line + text.count("\n", 0, match.start())
            if (code_line, match.group(0)) in seen:
                continue
            seen.add((code_line, match.group(0)))
            report("WARN", page.file, code_line,
                   f"A colour code, {match.group(0)}, typed inside the page. Use "
                   f"its name from assets/site.css, section 2 (like var(--green)).")


# --------------------------------------------------------------------------
# WARN — AN <img> WITHOUT width, height OR alt.
# width and height stop the page jumping about while a picture loads. alt
# is the words a screen reader says for it (alt="" for a decoration).
# --------------------------------------------------------------------------
def check_images(page):
    for line, attributes in page.reader.images:
        missing = [name for name in ("width", "height", "alt") if name not in attributes]
        if missing:
            report("WARN", page.file, line,
                   f"An image with no {' and no '.join(missing)}: "
                   f"{attributes.get('src') or '(no src)'}")


# ==========================================================================
# RUN EVERYTHING AND PRINT THE RESULT
# ==========================================================================

def main():
    # Windows: never stop on a letter the window can't show.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")

    pages = [Page(rel_path) for rel_path in published_pages()]
    if not pages:
        print("No pages found. Run this from the purevesting-website folder.")
        return 1

    # The header and footer every page must match: the ones in index.html.
    reference = {}
    home = next((page for page in pages if page.file == "index.html"), None)
    for name, pattern in (("header", HEADER_BLOCK), ("footer", FOOTER_BLOCK)):
        found = pattern.search(home.source) if home else None
        if found:
            reference[name] = without_current_mark(found.group(0))
        else:
            reference[name] = None
            report("ERROR", "index.html", 1,
                   f'index.html has no {name} (<{name} class="site-{name}">), '
                   f"so the other pages can't be compared with it.")

    for page in pages:
        check_banned_names(page)
        check_not_advice_lines(page)
        check_links(page)
        if page is not home:
            check_header_footer(page, reference)
        check_data_src(page)
        check_json_ld(page)
        check_advice_words(page)
        check_bank_words(page)
        check_google_basics(page)
        check_colour_codes(page)
        check_images(page)
    check_sitemap(pages)

    # ERRORs first, then WARNs; each group by file, then by line.
    order = {"ERROR": 0, "WARN": 1}
    for level, file, line, message in sorted(
            problems, key=lambda problem: (order[problem[0]], problem[1], problem[2])):
        print(f"{level:<5}  {file}:{line}  {message}")

    errors = sum(1 for problem in problems if problem[0] == "ERROR")
    warnings = len(problems) - errors
    print()
    print(f"Checked {len(pages)} pages and sitemap.xml: "
          f"{errors} ERROR, {warnings} WARN.")
    if errors:
        print("Fix every ERROR before anything goes live.")
        return 1
    if warnings:
        print("No ERROR. Look at each WARN and decide.")
    else:
        print("All clear.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
