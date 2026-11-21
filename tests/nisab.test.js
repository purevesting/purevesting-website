/* ==========================================================================
   TESTS FOR THE NISAB MATHS — assets/calc/nisab.js
   Run every test with:   node --test tests/
   (from the purevesting-website folder; Node 18 or newer, nothing to
   install). Each test prints "ok" or "not ok", then a count at the end.

   What is checked:
     1. The nisab from a rate, with the numbers MAS set for step 1.1.
     2. Tola to grams, and gold of 24K, 22K, 18K and 14K.
     3. Rounding, and how figures are written (₹1,11,366).
     4. Wrong numbers are refused, never turned into a nisab.
     5. The page shows the figures that prices.json gives.
     6. The update script writes the same figures as nisab.js, reads
        IBJA's page, and stops on a rate typed for 10 grams. (Needs
        Python; skipped without it.)
   Not published on the site (tests/ is in .assetsignore).
   ========================================================================== */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const Nisab = require('../assets/calc/nisab.js');

const SITE = path.join(__dirname, '..');
const PRICES_FILE = path.join(SITE, 'assets', 'data', 'prices.json');
const PAGE_FILE = path.join(SITE, 'zakat', 'nisab-today', 'index.html');


/* 1. THE NISAB FROM A RATE ================================================ */

test('silver at ₹181.863 a gram gives a nisab of ₹1,11,366', () => {
  assert.equal(Nisab.silverNisab(181.863), 111366);   // 612.36 × 181.863 = 111365.63
  assert.equal(Nisab.formatRupees(Nisab.silverNisab(181.863)), '₹1,11,366');
});

test('gold at ₹14,102 a gram gives a nisab of ₹12,33,643', () => {
  assert.equal(Nisab.goldNisab(14102), 1233643);      // 87.48 × 14102 = 1233642.96
  assert.equal(Nisab.formatRupees(Nisab.goldNisab(14102)), '₹12,33,643');
});

test('the test prices of the zakat calculator: silver ₹180, gold ₹14,000', () => {
  assert.equal(Nisab.silverNisab(180), 110225);       // 612.36 × 180 = 110224.80
  assert.equal(Nisab.goldNisab(14000), 1224720);      // 87.48 × 14000
});

test('IBJA rates of 20 November 2026: silver ₹152.528, gold ₹12,389.30', () => {
  assert.equal(Nisab.formatRupees(Nisab.silverNisab(152.528)), '₹93,402');      // 93402.05
  assert.equal(Nisab.formatRupees(Nisab.goldNisab(12389.3)), '₹10,83,816');     // 1083815.96
});


/* 2. TOLA, AND GOLD OF EACH KARAT ========================================= */

test('7.5 tola = 87.48 grams, and 52.5 tola = 612.36 grams', () => {
  assert.equal(Nisab.tolaToGrams(7.5), 87.48);
  assert.equal(Nisab.tolaToGrams(52.5), 612.36);
  assert.equal(Nisab.tolaToGrams(1), 11.664);
  assert.equal(Nisab.tolaToGrams(0), 0);
});

test('the rate of 24K, 22K, 18K and 14K gold: 24, 22, 18 and 14 parts of 24', () => {
  assert.equal(Nisab.goldRateForKarat(14000, 24), 14000);
  assert.equal(Nisab.goldRateForKarat(14000, 22).toFixed(2), '12833.33');   // 22/24
  assert.equal(Nisab.goldRateForKarat(14000, 18), 10500);                   // 18/24
  assert.equal(Nisab.goldRateForKarat(14000, 14).toFixed(2), '8166.67');    // 14/24
});

test('the value of gold: grams × the rate for its karat', () => {
  assert.equal(Nisab.roundToRupee(Nisab.goldValue(50, 22, 14000)), 641667);   // 641666.67
  assert.equal(Nisab.goldValue(10, 24, 14102), 141020);
  assert.equal(Nisab.goldValue(10, 18, 14000), 105000);
  assert.equal(Nisab.roundToRupee(Nisab.goldValue(10, 14, 14000)), 81667);   // 81666.67
  assert.equal(Nisab.goldValue(0, 22, 14000), 0);
});

test("from prices.json: IBJA's own 22K, 18K and 14K rates when it has them", () => {
  const prices = { gold_24k_per_gram: 12389.3, gold_22k_per_gram: 11348.6,
                   gold_18k_per_gram: 9292, gold_14k_per_gram: 7247.7 };
  assert.equal(Nisab.goldRateFromPrices(prices, 24), 12389.3);
  assert.equal(Nisab.goldRateFromPrices(prices, 22), 11348.6);   // IBJA's 916
  assert.equal(Nisab.goldRateFromPrices(prices, 18), 9292);      // IBJA's 750
  assert.equal(Nisab.goldRateFromPrices(prices, 14), 7247.7);    // IBJA's 585
  // Without them (typed by hand, or the test prices): parts of 24.
  assert.equal(Nisab.goldRateFromPrices({ gold_24k_per_gram: 14000 }, 22).toFixed(2), '12833.33');
  assert.equal(Nisab.goldRateFromPrices({ gold_24k_per_gram: 14000, gold_14k_per_gram: null }, 14).toFixed(2), '8166.67');
  assert.throws(() => Nisab.goldRateFromPrices(prices, 9), /Karat/);
});

test('9K and other karats are refused: they are not counted as gold', () => {
  assert.throws(() => Nisab.goldRateForKarat(14000, 9), /Karat must be 24, 22, 18 or 14/);
  assert.throws(() => Nisab.goldValue(10, 21, 14000), /Karat/);
  assert.throws(() => Nisab.goldValue(10, '22', 14000), /Karat/);
});


/* 3. ROUNDING, AND HOW FIGURES ARE WRITTEN ================================ */

test('rounding: to the nearest rupee, half a rupee goes up', () => {
  assert.equal(Nisab.roundToRupee(30938.75), 30939);
  assert.equal(Nisab.roundToRupee(30938.5), 30939);
  assert.equal(Nisab.roundToRupee(30938.49), 30938);
  assert.equal(Nisab.roundToRupee(0.5), 1);
  assert.equal(Nisab.roundToRupee(111365.62668000001), 111366);
  // A computer works out 1.005 × 100 as 100.49999…; it is really 100.5,
  // so it goes up.
  assert.equal(Nisab.roundToRupee(1.005 * 100), 101);
});

test('rupees are written with Indian commas', () => {
  assert.equal(Nisab.formatRupees(0), '₹0');
  assert.equal(Nisab.formatRupees(999), '₹999');
  assert.equal(Nisab.formatRupees(1000), '₹1,000');
  assert.equal(Nisab.formatRupees(93402), '₹93,402');
  assert.equal(Nisab.formatRupees(111366), '₹1,11,366');
  assert.equal(Nisab.formatRupees(1083815.964), '₹10,83,816');
  assert.equal(Nisab.formatRupees(10000000), '₹1,00,00,000');
});

test('a rate for 1 gram is written with the decimals it has', () => {
  assert.equal(Nisab.formatRate(14102), '₹14,102');
  assert.equal(Nisab.formatRate(12389.3), '₹12,389.30');
  assert.equal(Nisab.formatRate(152.528), '₹152.528');
  assert.equal(Nisab.formatRate(181.86), '₹181.86');
  assert.equal(Nisab.formatRate(181.8), '₹181.80');
});

test('a date is written the way the site writes dates', () => {
  assert.equal(Nisab.formatDate('2026-11-20'), '20 November 2026');
  assert.equal(Nisab.formatDate('2027-02-05'), '5 February 2027');
  assert.throws(() => Nisab.formatDate('20/11/2026'), /2026-11-20/);
});


/* 4. WRONG NUMBERS ARE REFUSED ============================================ */

test('a missing, zero, negative or written-out rate is refused', () => {
  for (const wrong of [undefined, null, 0, -181.863, NaN, Infinity, '181.863']) {
    assert.throws(() => Nisab.silverNisab(wrong), /silver rate must be a number above zero/);
    assert.throws(() => Nisab.goldNisab(wrong), /gold rate must be a number above zero/);
  }
  assert.throws(() => Nisab.tolaToGrams(-1), /Tola must be a number of zero or more/);
  assert.throws(() => Nisab.goldValue(-5, 22, 14000), /grams of gold/);
});


/* 5. THE PAGE SHOWS THE FIGURES THAT prices.json GIVES ====================
   Every figure marked data-nisab on /zakat/nisab-today/ must match the
   rates in assets/data/prices.json, and sit between the NISAB markers
   (where the weekly script rewrites it). */

// Every marked figure on a page: [{ kind, words, datetime, at }].
function markedFigures(html) {
  const found = [];
  const pattern = /<(\w+)\b([^>]*\bdata-nisab="([^"]+)"[^>]*)>([^<]*)<\/\1>/g;
  let match;
  while ((match = pattern.exec(html))) {
    const datetime = /\bdatetime="([^"]*)"/.exec(match[2]);
    found.push({ kind: match[3], words: match[4], datetime: datetime && datetime[1], at: match.index });
  }
  return found;
}

// The words each kind of figure must show for a set of rates.
function wordsFor(prices) {
  return {
    'silver-nisab': Nisab.formatRupees(Nisab.silverNisab(prices.silver_999_per_gram)),
    'gold-nisab': Nisab.formatRupees(Nisab.goldNisab(prices.gold_24k_per_gram)),
    'silver-rate': Nisab.formatRate(prices.silver_999_per_gram),
    'gold-rate': Nisab.formatRate(prices.gold_24k_per_gram),
    'as-of': Nisab.formatDate(prices.as_of)
  };
}

function checkPageMatches(html, prices) {
  const words = wordsFor(prices);
  const figures = markedFigures(html);
  assert.ok(figures.length >= 5, 'the page should have all five kinds of figure');
  for (const kind of Object.keys(words)) {
    assert.ok(figures.some(figure => figure.kind === kind), 'no figure marked data-nisab="' + kind + '"');
  }
  for (const figure of figures) {
    assert.equal(figure.words, words[figure.kind], 'the ' + figure.kind + ' figure');
    if (figure.kind === 'as-of') assert.equal(figure.datetime, prices.as_of, 'the date in datetime="…"');
  }
  return figures;
}

test('prices.json has the five things the pages read, and maybe IBJA\'s karat rates', () => {
  const prices = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
  const keys = Object.keys(prices);
  assert.deepEqual(keys.slice(0, 5), ['as_of', 'source_name', 'source_url', 'gold_24k_per_gram', 'silver_999_per_gram']);
  for (const extra of keys.slice(5)) {
    assert.ok(['gold_22k_per_gram', 'gold_18k_per_gram', 'gold_14k_per_gram'].includes(extra), 'unknown field ' + extra);
    assert.ok(prices[extra] > prices.gold_24k_per_gram / 2 && prices[extra] <= prices.gold_24k_per_gram, extra);
  }
  assert.match(prices.as_of, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(prices.gold_24k_per_gram > 0 && prices.silver_999_per_gram > 0);
});

test('/zakat/nisab-today/ shows the figures that prices.json gives', () => {
  const prices = JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
  const html = fs.readFileSync(PAGE_FILE, 'utf8');
  const figures = checkPageMatches(html, prices);

  // Each figure sits between <!-- NISAB START --> and <!-- NISAB END -->.
  for (const figure of figures) {
    const start = html.lastIndexOf('<!-- NISAB START -->', figure.at);
    const end = html.lastIndexOf('<!-- NISAB END -->', figure.at);
    assert.ok(start > end, 'the ' + figure.kind + ' figure is outside the NISAB markers');
  }
});


/* 6. THE WEEKLY SCRIPT AGREES WITH nisab.js ===============================
   Runs scripts/update_prices.py on a copy of the files, in a folder of its
   own, so the real files never change. */

// The Python on this computer: "python3", "python" or "py" (Windows).
function findPython() {
  for (const name of ['python3', 'python', 'py']) {
    const tried = spawnSync(name, ['--version'], { encoding: 'utf8' });
    if (tried.status === 0 && /Python 3/.test(tried.stdout + tried.stderr)) return name;
  }
  return null;
}

// A copy of the script, prices.json, the page and the sitemap.
function copyOfTheSite() {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'nisab-test-'));
  for (const file of ['scripts/update_prices.py', 'assets/data/prices.json',
                      'zakat/nisab-today/index.html', 'sitemap.xml']) {
    fs.mkdirSync(path.join(folder, path.dirname(file)), { recursive: true });
    fs.copyFileSync(path.join(SITE, file), path.join(folder, file));
  }
  return folder;
}

function runScript(python, folder, args) {
  return spawnSync(python, [path.join(folder, 'scripts', 'update_prices.py')].concat(args),
                   { cwd: folder, encoding: 'utf8', env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' }) });
}

const python = findPython();

test('rates typed by hand: the script rewrites prices.json and the page, with the same figures as nisab.js',
     { skip: python ? false : 'Python 3 not found' }, () => {
  const folder = copyOfTheSite();
  const run = runScript(python, folder, ['--gold', '13000.5', '--silver', '160.123', '--date', '2026-11-13']);
  assert.equal(run.status, 0, run.stdout + run.stderr);

  const prices = JSON.parse(fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8'));
  assert.deepEqual(prices, {
    as_of: '2026-11-13',
    source_name: 'IBJA',
    source_url: 'https://ibjarates.com/',
    gold_24k_per_gram: 13000.5,
    silver_999_per_gram: 160.123
  });

  const html = fs.readFileSync(path.join(folder, 'zakat/nisab-today/index.html'), 'utf8');
  checkPageMatches(html, prices);
  assert.match(run.stdout, /By silver: 612\.36 g x ₹160\.123 = ₹98,053/);   // 612.36 × 160.123 = 98052.92
  assert.match(run.stdout, /By gold: +87\.48 g x ₹13,000\.50 = ₹11,37,284/); // 87.48 × 13000.5 = 1137283.74
  fs.rmSync(folder, { recursive: true, force: true });
});

test('rates typed by hand: the script stops, changing nothing, on a gold rate for 10 grams',
     { skip: python ? false : 'Python 3 not found' }, () => {
  const folder = copyOfTheSite();
  const before = fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8');
  const pageBefore = fs.readFileSync(path.join(folder, 'zakat/nisab-today/index.html'), 'utf8');
  const run = runScript(python, folder, ['--gold', '123893', '--silver', '152.528', '--date', '2026-11-20']);
  assert.notEqual(run.status, 0);
  assert.match(run.stdout, /Is it the rate for 10 grams\?/);
  assert.equal(fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8'), before);
  assert.equal(fs.readFileSync(path.join(folder, 'zakat/nisab-today/index.html'), 'utf8'), pageBefore);
  fs.rmSync(folder, { recursive: true, force: true });
});

// Writes a prices.json into the copy, as if the site had these rates.
function setPrices(folder, prices) {
  fs.writeFileSync(path.join(folder, 'assets/data/prices.json'), JSON.stringify(prices, null, 2) + '\n');
}

const SAMPLE = path.join(__dirname, 'ibja-sample.html');   // IBJA's tables, 21 Nov 2026

test("the automatic update reads IBJA's newest PM row: 999, 916, 750, 585 and silver",
     { skip: python ? false : 'Python 3 not found' }, () => {
  const folder = copyOfTheSite();
  setPrices(folder, { as_of: '2026-11-13', source_name: 'IBJA', source_url: 'https://ibjarates.com/',
                      gold_24k_per_gram: 13580.9, silver_999_per_gram: 178 });
  const run = runScript(python, folder, ['--from-ibja', SAMPLE]);
  assert.equal(run.status, 0, run.stdout + run.stderr);
  const prices = JSON.parse(fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8'));
  assert.deepEqual(prices, {
    as_of: '2026-11-20',                 // the PM table's newest row
    source_name: 'IBJA',
    source_url: 'https://ibjarates.com/',
    gold_24k_per_gram: 12389.3,          // 1,23,893 for 10 g
    silver_999_per_gram: 152.528,        // 1,52,528 for 1 kg
    gold_22k_per_gram: 11348.6,          // 916: 1,13,486 for 10 g
    gold_18k_per_gram: 9292,             // 750: 92,920
    gold_14k_per_gram: 7247.7            // 585: 72,477
  });
  checkPageMatches(fs.readFileSync(path.join(folder, 'zakat/nisab-today/index.html'), 'utf8'), prices);
  fs.rmSync(folder, { recursive: true, force: true });
});

test("the automatic update changes nothing when IBJA's rates are older than the site's",
     { skip: python ? false : 'Python 3 not found' }, () => {
  const folder = copyOfTheSite();
  setPrices(folder, { as_of: '2026-11-21', source_name: 'IBJA', source_url: 'https://ibjarates.com/',
                      gold_24k_per_gram: 12389.3, silver_999_per_gram: 152.528 });
  const before = fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8');
  const run = runScript(python, folder, ['--from-ibja', SAMPLE]);
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /older than the site's/);
  assert.equal(fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8'), before);
  fs.rmSync(folder, { recursive: true, force: true });
});
