"""
UPDATE THE SCREENER — run once a month, after NSE's month-end update.

    python3 scripts/update_screener.py

What it does:
  1. Downloads NSE Indices' list of the Nifty 500 companies, and the
     Nifty500 Shariah index's sector file, which names every company in
     the Shariah index with its weight and the date of the data.
  2. Rewrites the table in screener/index.html (between the
     "SCREENER ROWS" markers) and every "as of" date on that page and in
     the home page's screener box.

It needs web access (niftyindices.com). It prints the counts at the end:
check they match NSE's factsheet before pushing. Not published on the
site (scripts/ is listed in .assetsignore).
"""
import csv, io, re, sys, urllib.request, datetime, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      'Referer': 'https://www.niftyindices.com/'}
N500_URL = 'https://www.niftyindices.com/IndexConstituent/ind_nifty500list.csv'
SHARIAH_URL = 'https://liveindexsa.niftyindices.com/jsonfiles/Sector/SectorialIndexDataNIFTY500%20SHARIAH_Sector.js'

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
        return r.read().decode('utf-8-sig', errors='replace')

def load(local_dir=None):
    if local_dir:
        n500 = open(os.path.join(local_dir, 'ind_nifty500list.csv'), encoding='utf-8-sig').read()
        shariah = open(os.path.join(local_dir, 'sector.js'), encoding='utf-8').read()
    else:
        n500, shariah = fetch(N500_URL), fetch(SHARIAH_URL)
    return n500, shariah

def build(n500_text, shariah_text):
    companies = list(csv.DictReader(io.StringIO(n500_text)))
    items = re.findall(r'\{"label":"([^"]+?) ([\d.]+)%","weight":([\d.]+),"id":"\d+","date":"(\d\d-\d\d-\d{4})"\}', shariah_text)
    if len(companies) < 450 or len(items) < 100:
        sys.exit(f'Stopped: the files look wrong ({len(companies)} companies, {len(items)} Shariah).')
    dates = sorted(set(i[3] for i in items))
    if len(dates) != 1:
        sys.exit(f'Stopped: the Shariah file has more than one date: {dates}')
    as_of = datetime.datetime.strptime(dates[0], '%d-%m-%Y').date()
    weight = {sym: float(w) for sym, _, w, _ in items}
    known = {c['Symbol'].strip() for c in companies}
    missing = [s for s in weight if s not in known]
    if missing:
        sys.exit(f'Stopped: Shariah companies missing from the Nifty 500 list: {missing}')
    rows = []
    for c in sorted(companies, key=lambda c: c['Company Name'].strip().lower()):
        sym, name, ind = c['Symbol'].strip(), c['Company Name'].strip(), c['Industry'].strip()
        if sym in weight:
            status = '<span class="chip chip-pass">&#10003; In the index</span>'
            w = f'{weight[sym]:.2f}%'
            row_cls = 'in'
        else:
            status = '<span class="chip chip-fail">Not in the index</span>'
            w = '—'
            row_cls = 'out'
        rows.append(f'            <tr class="sc-{row_cls}"><td>{html.escape(name)}</td><td>{html.escape(sym)}</td>'
                    f'<td>{html.escape(ind)}</td><td>{status}</td><td class="num">{w}</td></tr>')
    return rows, as_of, len(weight), len(companies)

def write(rows, as_of, n_in, n_all):
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
    s = re.sub(r'<span class="num" data-screener-in>\d+</span>', f'<span class="num" data-screener-in>{n_in}</span>', s)
    s = re.sub(r'<span class="num" data-screener-all>\d+</span>', f'<span class="num" data-screener-all>{n_all}</span>', s)
    open(p, 'w', encoding='utf-8').write(s)
    h = os.path.join(ROOT, 'index.html')
    s = open(h, encoding='utf-8').read()
    s = re.sub(r'<time datetime="[0-9-]+" data-screener-date>[^<]*</time>',
               f'<time datetime="{iso}" data-screener-date>{text}</time>', s)
    s = re.sub(r'(data-screener-all>)\d+', rf'\g<1>{n_all}', s)
    open(h, 'w', encoding='utf-8').write(s)
    print(f'Done: {n_in} of {n_all} companies in the Nifty500 Shariah index, as of {text}.')
    print('Check these against NSE\'s factsheet, then update the page\'s "Last updated" date and push.')

if __name__ == '__main__':
    local = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == '--from' else None
    rows, as_of, n_in, n_all = build(*load(local))
    write(rows, as_of, n_in, n_all)
