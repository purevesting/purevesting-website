"""
UPDATE THE SCREENER — run once a month, after NSE's month-end update.

    python3 scripts/update_screener.py

Every run keeps a copy of NSE's two files in git, in data/nse/ under the
date of the data (for example data/nse/2026-10-30/). So every month's
raw files are saved with the site, on GitHub, and nothing lives only on
someone's computer. (Since 18 Nov 2026.)

On a day NSE's site blocks the script, get NSE's two files by hand: open
the two web addresses below (N500_URL and SHARIAH_URL) in a browser, on
any phone or computer. On github.com, open the repo's data/nse/ folder,
tap "Add file" → "Upload files", and upload both into a new folder named
after the month-end date (type "2026-11-28/" in front of the file name).
Then run the script on that folder:

    python3 scripts/update_screener.py --from-folder data/nse/2026-11-28/

(--from-folder since 17 Nov 2026, step 0.4. When it is used, the script
first prints which two files it needs and their web addresses.)

What it does:
  1. Gets NSE Indices' list of the Nifty 500 companies, and the Nifty500
     Shariah index's sector file, which names every company in the
     Shariah index with its weight and the date of the data. It downloads
     them, or reads them from the folder given after --from-folder,
     and keeps a copy of both in data/nse/<date of the data>/.
  2. Rewrites the table in screener/index.html (between the
     "SCREENER ROWS" markers) and every date marked data-screener-date on
     that page and in the home page's screener box (its "Source: NSE's
     Nifty500 Shariah index, …" line). A company in the Shariah index is
     marked "✓ Halal" (green); a Nifty 500 company that isn't — it was
     screened and failed — "✗ Not halal" (red, MAS, 17 Nov 2026).
     Anything outside the Nifty 500 was never screened, so it shows
     "? Don't know yet" when searched — that part is in the page's own
     script, not here. Since 6 Nov 2026 (part 3) the table has
     two columns, the company and the answer; the NSE symbol sits on each
     row as data-sym, for the search. The counts marked data-screener-in,
     data-screener-out and data-screener-all are rewritten too.
  3. Redraws the grid of squares — one per company, A to Z, filled if it
     is in the Shariah index — between the "GRID START" and "GRID END"
     markers on each page in GRID_PAGES, and rewrites the counts marked
     data-screener-in (in the index) and data-screener-all (all
     companies) on those pages. (Since 6 Nov 2026.)
  4. Writes the month into data/shariah-history.csv: one row per Nifty 500
     company, with five columns — month (YYYY-MM), date_of_data, symbol,
     company, on_list (1 = in the Shariah index that month, 0 = not). If
     the file already has that month, its rows are replaced, so running
     the update twice never adds a month twice. The file grows by one
     month every time NSE publishes a new month. (Since 17 Nov 2026,
     step 0.4.)

It prints the counts at the end: check they match NSE's two factsheets
before pushing. Not published on the site (scripts/ and data/ are listed
in .assetsignore).
"""
import argparse, csv, datetime, html, http.client, io, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      'Referer': 'https://www.niftyindices.com/'}

# NSE's two files. If the script can't download them, open these two
# addresses in your browser and save the files (see --from-folder above).
N500_URL = 'https://www.niftyindices.com/IndexConstituent/ind_nifty500list.csv'
SHARIAH_URL = 'https://liveindexsa.niftyindices.com/jsonfiles/Sector/SectorialIndexDataNIFTY500%20SHARIAH_Sector.js'

# How --from-folder spots each file in the folder: the words its name has,
# and how its name ends (capitals don't matter). A browser saves them as
# "ind_nifty500list.csv" and "SectorialIndexDataNIFTY500 SHARIAH_Sector.js",
# and adds " (1)" to the name if the file was saved there before. If there
# are several, the newest is used.
N500_NAME = (['ind_nifty500list'], '.csv')
SHARIAH_NAME = (['nifty500', 'shariah'], '.js')

# Pages with a grid of squares (between "GRID START" and "GRID END").
GRID_PAGES = ['index.html', os.path.join('halal-stocks', 'index.html')]

# Where the copy of NSE's two files is kept, one folder per date of the
# data, with these two names. (Since 18 Nov 2026.)
NSE_COPIES = os.path.join(ROOT, 'data', 'nse')
N500_COPY_NAME = 'ind_nifty500list.csv'
SHARIAH_COPY_NAME = 'SectorialIndexDataNIFTY500 SHARIAH_Sector.js'

# The history of the list, one month after another (step 4 above).
HISTORY = os.path.join(ROOT, 'data', 'shariah-history.csv')
HISTORY_COLUMNS = ['month', 'date_of_data', 'symbol', 'company', 'on_list']


# The two files and their web addresses, as the script prints them.
def two_files():
    return ("It needs these two files from NSE. Open each web address in your browser and save the file:\n"
            "  1. The Nifty 500 list of companies (it saves as ind_nifty500list.csv)\n"
            f"     {N500_URL}\n"
            "  2. The Nifty500 Shariah index file (it saves as SectorialIndexDataNIFTY500 SHARIAH_Sector.js)\n"
            f"     {SHARIAH_URL}")

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
        return r.read().decode('utf-8-sig', errors='replace')

# Downloads one of NSE's files. If NSE's site refuses (or there is no
# internet), stops and says how to use --from-folder instead.
def download(url):
    try:
        return fetch(url)
    except (OSError, http.client.HTTPException) as error:
        sys.exit(f"Stopped: could not download {url}\n({error})\n"
                 "NSE's site sometimes blocks scripts. Get the two files with your browser instead.\n"
                 + two_files() + "\n"
                 "Upload both on github.com into data/nse/<month-end date>/ (see the top of this script), then run:\n"
                 "    python3 scripts/update_screener.py --from-folder data/nse/<month-end date>/")

# The file in `folder` whose name has all the `words` and ends with
# `ending`, capitals not mattering. If there are several, the newest.
def find_saved(folder, words, ending):
    found = []
    for name in os.listdir(folder):
        low = name.lower()
        if all(word in low for word in words) and low.endswith(ending):
            found.append(os.path.join(folder, name))
    if not found:
        return None
    return max(found, key=os.path.getmtime)

# Step 1: NSE's two files, as text — downloaded, or read from `folder`.
def load(folder=None):
    if folder is None:
        return download(N500_URL), download(SHARIAH_URL)
    print(f"Reading NSE's two files from the folder {folder} (not from the internet).")
    print(two_files())
    if not os.path.isdir(folder):
        sys.exit(f"Stopped: there is no folder {folder}. Save the two files into a folder, then run this again with that folder's name.")
    n500_path = find_saved(folder, *N500_NAME)
    shariah_path = find_saved(folder, *SHARIAH_NAME)
    if n500_path is None:
        sys.exit(f"Stopped: file 1, the Nifty 500 list (ind_nifty500list.csv), is not in {folder}.")
    if shariah_path is None:
        sys.exit(f"Stopped: file 2, the Nifty500 Shariah index file (SectorialIndexDataNIFTY500 SHARIAH_Sector.js), is not in {folder}.")
    print(f"Using: {n500_path}")
    print(f"  and: {shariah_path}")
    with open(n500_path, encoding='utf-8-sig') as f:
        n500 = f.read()
    with open(shariah_path, encoding='utf-8-sig') as f:
        shariah = f.read()
    return n500, shariah

def build(n500_text, shariah_text):
    companies = list(csv.DictReader(io.StringIO(n500_text)))
    items = re.findall(r'\{"label":"([^"]+?) ([\d.]+)%","weight":([\d.]+),"id":"\d+","date":"(\d\d-\d\d-\d{4})"\}', shariah_text)
    if len(companies) < 450 or len(items) < 100 or 'Symbol' not in companies[0] or 'Company Name' not in companies[0]:
        sys.exit(f"Stopped: the files look wrong ({len(companies)} companies, {len(items)} Shariah). "
                 "If NSE's site sent a page instead of a file, use --from-folder (see the top of this script).")
    dates = sorted(set(i[3] for i in items))
    if len(dates) != 1:
        sys.exit(f'Stopped: the Shariah file has more than one date: {dates}')
    as_of = datetime.datetime.strptime(dates[0], '%d-%m-%Y').date()
    weight = {sym: float(w) for sym, _, w, _ in items}
    known = {c['Symbol'].strip() for c in companies}
    missing = [s for s in weight if s not in known]
    if missing:
        sys.exit(f'Stopped: Shariah companies missing from the Nifty 500 list: {missing}')
    # rows: the screener's table. squares: the grid. listed: the history
    # (symbol, company, in the Shariah index or not). All three A to Z.
    rows, squares, listed = [], [], []
    for c in sorted(companies, key=lambda c: c['Company Name'].strip().lower()):
        sym, name = c['Symbol'].strip(), c['Company Name'].strip()
        # The answer in the list: "✓ Halal" (green) if the company is in
        # NSE's Shariah index, "✗ Not halal" (red) if it isn't (MAS,
        # 17 Nov 2026). The row's class says the same (row-halal or
        # row-not-halal); the page's search looks for row-halal.
        if sym in weight:
            status = '<span class="chip chip-pass">&#10003; Halal</span>'
            row_class = 'row-halal'
        else:
            status = '<span class="chip chip-not-halal">&#10007; Not halal</span>'
            row_class = 'row-not-halal'
        # Two columns (MAS, 6 Nov 2026, part 3): the company and the answer.
        # The symbol rides along as data-sym, so the search still finds it.
        rows.append(f'                <tr class="{row_class}" data-sym="{html.escape(sym)}"><td>{html.escape(name)}</td>'
                    f'<td>{status}</td></tr>')
        squares.append(sym in weight)
        listed.append((sym, name, sym in weight))
    return rows, squares, listed, as_of, len(weight), len(companies)

def grid(squares):
    """The squares, 25 to a line: <i class="on"></i> passes, <i></i> doesn't."""
    return '\n'.join('      ' + ''.join('<i class="on"></i>' if x else '<i></i>' for x in squares[k:k + 25])
                     for k in range(0, len(squares), 25))

def write(rows, squares, as_of, n_in, n_all):
    iso = as_of.isoformat()
    text = f'{as_of.day} {as_of.strftime("%B %Y")}'
    p = os.path.join(ROOT, 'screener', 'index.html')
    s = open(p, encoding='utf-8').read()
    s, n = re.subn(r'(<!-- SCREENER ROWS START -->).*?([ \t]*<!-- SCREENER ROWS END -->)',
                   lambda m: m.group(1) + '\n' + '\n'.join(rows) + '\n' + m.group(2), s, flags=re.S)
    if n != 1:
        sys.exit('Stopped: could not find the SCREENER ROWS markers in screener/index.html.')
    s = re.sub(r'<time datetime="[0-9-]+" data-screener-date>[^<]*</time>',
               f'<time datetime="{iso}" data-screener-date>{text}</time>', s)
    s = re.sub(r'(data-screener-in>)\d+', rf'\g<1>{n_in}', s)
    s = re.sub(r'(data-screener-out>)\d+', rf'\g<1>{n_all - n_in}', s)
    s = re.sub(r'(data-screener-all>)\d+', rf'\g<1>{n_all}', s)
    open(p, 'w', encoding='utf-8').write(s)
    for page in GRID_PAGES:
        h = os.path.join(ROOT, page)
        s = open(h, encoding='utf-8').read()
        s = re.sub(r'<time datetime="[0-9-]+" data-screener-date>[^<]*</time>',
                   f'<time datetime="{iso}" data-screener-date>{text}</time>', s)
        s = re.sub(r'(data-screener-all>)\d+', rf'\g<1>{n_all}', s)
        s = re.sub(r'(data-screener-in>)\d+', rf'\g<1>{n_in}', s)
        s, n = re.subn(r'(<!-- GRID START -->\n).*?(\n[ \t]*<!-- GRID END -->)',
                       lambda m: m.group(1) + grid(squares) + m.group(2), s, flags=re.S)
        if n != 1:
            sys.exit(f'Stopped: could not find the GRID markers in {page}.')
        open(h, 'w', encoding='utf-8').write(s)
    print(f'Done: {n_in} of {n_all} companies in the Nifty500 Shariah index, as of {text}.')
    print('The squares are redrawn on: ' + ', '.join(GRID_PAGES) + '.')

# The rows already in data/shariah-history.csv (none the first time).
# Read before any page is changed, so a broken file stops the update
# before it starts.
def read_history():
    if not os.path.exists(HISTORY):
        return []
    with open(HISTORY, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    if reader.fieldnames != HISTORY_COLUMNS:
        sys.exit('Stopped: the first line of data/shariah-history.csv should be '
                 + ','.join(HISTORY_COLUMNS) + '. Put it back, then run this again. Nothing was changed.')
    return rows

# Step 4: puts this month into data/shariah-history.csv, one row per
# company, A to Z. Rows already there for the same month are dropped
# first, so a second run replaces the month instead of adding it twice.
def write_history(old_rows, listed, as_of):
    month = as_of.strftime('%Y-%m')
    kept = [r for r in old_rows if r['month'] != month]
    new_rows = [{'month': month,
                 'date_of_data': as_of.isoformat(),
                 'symbol': sym,
                 'company': name,
                 'on_list': '1' if on_list else '0'}
                for sym, name, on_list in listed]
    # Oldest month first. Sorting by month alone keeps A to Z inside each month.
    rows = sorted(kept + new_rows, key=lambda r: r['month'])
    os.makedirs(os.path.dirname(HISTORY), exist_ok=True)
    with open(HISTORY, 'w', newline='', encoding='utf-8') as f:
        out = csv.DictWriter(f, fieldnames=HISTORY_COLUMNS, lineterminator='\n', extrasaction='ignore')
        out.writeheader()
        out.writerows(rows)
    months = sorted(set(r['month'] for r in rows))
    if len(kept) < len(old_rows):
        print(f'History: {month} was already in data/shariah-history.csv, so its rows were replaced, not added twice.')
    print(f'History: data/shariah-history.csv has {len(new_rows)} rows for {month}; '
          f'{len(months)} month(s) in all, {months[0]} to {months[-1]}.')

# Keeps a copy of NSE's two files in data/nse/<date of the data>/, so the
# raw files of every month are saved in git with the site. If the folder
# already holds that month's files, they are replaced by these.
def keep_copy(n500_text, shariah_text, as_of):
    folder = os.path.join(NSE_COPIES, as_of.isoformat())
    os.makedirs(folder, exist_ok=True)
    for name, text in ((N500_COPY_NAME, n500_text), (SHARIAH_COPY_NAME, shariah_text)):
        with open(os.path.join(folder, name), 'w', encoding='utf-8', newline='') as f:
            f.write(text)
    print(f"Copy: NSE's two files are kept in {os.path.relpath(folder, ROOT)}/ (push them with the rest).")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Updates the screener, the squares and data/shariah-history.csv from NSE's two files.")
    parser.add_argument('--from-folder', metavar='FOLDER',
                        help="read NSE's two files from this folder instead of downloading them "
                             "(for the days NSE's site blocks the script)")
    args = parser.parse_args()
    history = read_history()
    n500_text, shariah_text = load(args.from_folder)
    rows, squares, listed, as_of, n_in, n_all = build(n500_text, shariah_text)
    write(rows, squares, as_of, n_in, n_all)
    write_history(history, listed, as_of)
    keep_copy(n500_text, shariah_text, as_of)
    print("Check the counts against NSE's two factsheets, then set \"dateModified\" in the screener page's structured data to today, and push.")
