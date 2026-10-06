"""
UPDATE THE "STOP THE GENOCIDE" LIST — run when Tech for Palestine's
dataset changes (check its GitHub page now and then).

    python3 scripts/update_boycott.py            # downloads the dataset with git
    python3 scripts/update_boycott.py --from DIR # or uses a copy already on disk

Reads Tech for Palestine's open dataset
(github.com/TechForPalestine/boycott-israeli-consumer-goods-dataset),
keeps every company and brand it marks "avoid", groups brands that share
an owner or the same reason, and rewrites the list in
stop-the-genocide/index.html (between the "BOYCOTT LIST" markers) plus the
counts. Every entry keeps the dataset's own words and its footnoted
sources. Needs PyYAML (pip install pyyaml) and, without --from, git.
Not published on the site (scripts/ is in .assetsignore).
"""
import glob, html, os, re, subprocess, sys, tempfile, collections
from urllib.parse import urlparse
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = 'https://github.com/TechForPalestine/boycott-israeli-consumer-goods-dataset'
REASON_WORDS = {
    'operations_in_israel': 'Operations or investment in Israel',
    'operations_in_settlements': 'Operations in settlements in occupied territory',
    'executive_supports_israel': "An executive's support for Israel",
    'hiring_discrimination': 'Hiring discrimination',
}

def get_dataset(local):
    if local:
        return local
    d = tempfile.mkdtemp()
    subprocess.run(['git', 'clone', '-q', '--depth', '1', REPO, d], check=True)
    return d

def split_text(md):
    """Dataset text -> (paragraphs as safe HTML, list of source URLs)."""
    md = md or ''
    urls = re.findall(r'^\[\^\d+\]:\s*(\S+)', md, flags=re.M)
    body = re.sub(r'^\[\^\d+\]:.*$', '', md, flags=re.M)
    body = re.sub(r'\[\^\d+\]', '', body)
    body = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'\1', body)
    paras = [p.strip() for p in body.split('\n\n') if p.strip()]
    out = []
    for p in paras:
        p = html.escape(re.sub(r'\s+', ' ', p))
        p = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', p)
        p = p.replace('*', '')
        out.append(p)
    return out, urls

def source_links(urls):
    seen, links = set(), []
    for u in urls:
        if u in seen:
            continue
        seen.add(u)
        host = urlparse(u).netloc.replace('www.', '') or u
        links.append(f'<a href="{html.escape(u)}" rel="nofollow">{html.escape(host)}</a>')
    return links

def build(d):
    companies = {os.path.basename(f)[:-5]: yaml.safe_load(open(f, encoding='utf-8'))
                 for f in glob.glob(os.path.join(d, 'data/companies/*.yaml'))}
    brands = [yaml.safe_load(open(f, encoding='utf-8')) for f in glob.glob(os.path.join(d, 'data/brands/*.yaml'))]
    avoid = [b for b in brands if b and b.get('status') == 'avoid']
    groups = collections.OrderedDict()

    def group(key, title):
        if key not in groups:
            groups[key] = {'title': title, 'text': None, 'brands': [], 'reasons': set()}
        return groups[key]

    for cid, c in companies.items():
        if c and c.get('status') == 'avoid':
            g = group('co:' + cid, c['name'])
            g['text'] = c.get('description')

    for b in avoid:
        owners = [s.get('id') for s in (b.get('stakeholders') or []) if s.get('type') == 'owner']
        desc = b.get('description') or ''
        first, _, rest = desc.partition('\n\n')
        owned_by = re.match(r'\*\*(.+?)\*\* is owned by \*\*(.+?)\*\*', first)
        if owners and ('co:' + owners[0]) in groups:
            g = groups['co:' + owners[0]]
            if not g['text']:
                g['text'] = rest if owned_by else desc
        elif owned_by:
            parent = owned_by.group(2).strip().rstrip('.')
            g = group('txt:' + rest.strip()[:300], parent)
            g['text'] = g['text'] or rest
        else:
            g = group('txt:' + desc.strip()[:300], b['name'])
            g['text'] = g['text'] or desc
        if b['name'] != g['title']:
            g['brands'].append(b['name'])
        g['reasons'].update(b.get('reasons') or [])

    # groups that share a title (same parent, different texts) become one
    merged = collections.OrderedDict()
    for g in groups.values():
        key = g['title'].lower()
        if key in merged:
            m = merged[key]
            m['brands'] += g['brands']
            m['reasons'] |= g['reasons']
            if g['text'] and g['text'] not in m['texts']:
                m['texts'].append(g['text'])
        else:
            merged[key] = {'title': g['title'], 'brands': list(g['brands']), 'reasons': set(g['reasons']),
                           'texts': [g['text']] if g['text'] else []}
    entries = sorted(merged.values(), key=lambda e: e['title'].lower())
    return entries, len(companies), len(avoid)

def render(entries):
    out = []
    for e in entries:
        brands = sorted(set(e['brands']), key=str.lower)
        names = ' '.join([e['title']] + brands).lower()
        paras, urls = [], []
        for t in e['texts']:
            p, u = split_text(t)
            paras += p
            urls += u
        count = f'<span class="bc-count">{len(brands)} brand{"s" if len(brands) != 1 else ""}</span>' if brands else ''
        tags = ''.join(f'<span class="bc-tag">{REASON_WORDS.get(r, r)}</span>' for r in sorted(e['reasons']))
        body = ''.join(f'<p>{p}</p>' for p in paras) or '<p>No reason text in the dataset.</p>'
        brand_line = (f'<p class="bc-brands"><strong>Brands listed:</strong> {html.escape(", ".join(brands))}</p>' if brands else '')
        links = source_links(urls)
        src = f'<p class="source-note">Sources cited by the dataset: {", ".join(links)}</p>' if links else ''
        out.append(f'          <details class="bc-entry" data-names="{html.escape(names)}">'
                   f'<summary><span class="bc-name">{html.escape(e["title"])}</span>{count}{tags}</summary>'
                   f'<div class="bc-body">{body}{brand_line}{src}</div></details>')
    return out

def write(rows, n_entries, n_companies, n_brands):
    p = os.path.join(ROOT, 'stop-the-genocide', 'index.html')
    s = open(p, encoding='utf-8').read()
    s, n = re.subn(r'(<!-- BOYCOTT LIST START -->).*?([ \t]*<!-- BOYCOTT LIST END -->)',
                   lambda m: m.group(1) + '\n' + '\n'.join(rows) + '\n' + m.group(2), s, flags=re.S)
    if n != 1:
        sys.exit('Stopped: could not find the BOYCOTT LIST markers.')
    s = re.sub(r'<span class="num" data-bc-entries>\d+</span>', f'<span class="num" data-bc-entries>{n_entries}</span>', s)
    s = re.sub(r'<span class="num" data-bc-brands>\d+</span>', f'<span class="num" data-bc-brands>{n_brands}</span>', s)
    s = re.sub(r'<span class="num" data-bc-companies>\d+</span>', f'<span class="num" data-bc-companies>{n_companies}</span>', s)
    open(p, 'w', encoding='utf-8').write(s)
    print(f'Done: {n_entries} entries ({n_companies} companies, {n_brands} brands marked "avoid").')

if __name__ == '__main__':
    local = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == '--from' else None
    entries, n_co, n_br = build(get_dataset(local))
    write(render(entries), len(entries), n_co, n_br)
