/* ==========================================================================
   TESTS FOR THE ZAKAT MATHS — assets/calc/zakat.js
   Run every test with:   node --test tests/
   (from the purevesting-website folder; Node 18 or newer, nothing to
   install). Each test prints "ok" or "not ok", then a count at the end.

   The test rates are the ones in MAS's zakat rules: 24K gold ₹14,000 a
   gram (so 22K is ₹12,833.33) and silver ₹180 a gram. So the silver
   nisab is ₹1,10,225 and the gold nisab ₹12,24,720.

   What is checked:
     1. The test rates give the two nisab figures.
     2. Cases A to G (the step 1.2 prompt).
     3. Cases H to R from the zakat rules, section 1.5 (not K: the
        calculator does not offer "take nothing off").
     4. The seven families of the zakat rules, Part 4, with their figures.
     5. The loan part of the next 12 months, silver purity, gold rates.
     6. "Not sure": two numbers, never an average, and only for a question
        whose box has a number.
     7. Wrong rates are refused; odd boxes never give a wrong answer.
     8. The page: it loads the maths in the right order, its nisab
        figures match prices.json, and the daily rate update rewrites
        them with no problem (needs Python; skipped without it).
   Not published on the site (tests/ is in .assetsignore).
   ========================================================================== */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const Nisab = require('../assets/calc/nisab.js');
const Zakat = require('../assets/calc/zakat.js');

const SITE = path.join(__dirname, '..');
const RATES = { gold24k: 14000, silver: 180 };

// One person's boxes, with the test rates. Any box not given is empty.
function person(boxes) {
  return Object.assign({ rates: RATES }, boxes);
}

// The same person with some answers changed.
function answering(boxes, choices) {
  return person(Object.assign({}, boxes, { choices: Object.assign({}, boxes.choices, choices) }));
}

// The zakat for one person: one number, or [low, high] when it is two.
function zakatOf(input) {
  const answer = Zakat.workOut(input);
  return answer.isRange ? [answer.low.zakat, answer.high.zakat] : answer.zakat;
}


/* 1. THE TEST RATES ======================================================= */

test('the test rates give a silver nisab of ₹1,10,225 and a gold nisab of ₹12,24,720', () => {
  assert.equal(Nisab.silverNisab(RATES.silver), 110225);
  assert.equal(Nisab.goldNisab(RATES.gold24k), 1224720);
  assert.equal(Zakat.goldRate(RATES, 22).toFixed(2), '12833.33');
});


/* 2. CASES A TO G ========================================================= */

test('A. cash ₹50,000 and nothing else: below the nisab, so ₹0', () => {
  const answer = Zakat.workOut(person({ money: { cashAndBank: 50000 } }));
  assert.equal(answer.zakat, 0);
  assert.equal(answer.isRange, false);
  assert.equal(answer.low.reachesNisab, false);
  assert.equal(answer.low.nisab.kind, 'silver');
  assert.equal(answer.low.nisab.rupees, 110225);
});

test('B. cash ₹2,00,000 + 20 g of 22K gold − ₹30,000 to pay now = ₹10,667', () => {
  const answer = Zakat.workOut(person({
    money: { cashAndBank: 200000 },
    gold: [{ grams: 20, karat: 22 }],
    owe: { payNow: 30000 }
  }));
  assert.equal(answer.zakat, 10667);                       // 4,26,666.67 × 2.5%
  assert.equal(Math.round(answer.low.parts.metals), 256667);
  assert.equal(answer.low.takenOff, 30000);
  assert.equal(Math.round(answer.low.result), 426667);
});

test('C. cash ₹1,00,000 + 50 g of 22K worn jewellery, "Not sure": ₹0 to ₹18,542', () => {
  const answer = Zakat.workOut(person({
    money: { cashAndBank: 100000 },
    gold: [{ grams: 50, karat: 22 }],
    wornGold: { grams: 50, karat: 22 }
  }));                                                     // "Not sure" is the start
  assert.equal(answer.isRange, true);
  assert.equal(answer.low.zakat, 0);                       // don't count it: ₹1,00,000 is below
  assert.equal(answer.high.zakat, 18542);                  // count it: 7,41,666.67 × 2.5%
  assert.deepEqual(answer.open, ['jewellery']);
});

test('D. cash ₹5,00,000 only: ₹12,500 with the silver nisab, ₹0 with the gold nisab', () => {
  const boxes = { money: { cashAndBank: 500000 } };
  assert.equal(zakatOf(person(boxes)), 12500);
  assert.equal(zakatOf(answering(boxes, { nisab: 'gold' })), 0);
});

test('E. cash ₹3,00,000 + shares ₹2,00,000, home loan with ₹2,40,000 of loan part due in 12 months', () => {
  // ₹20,00,000 left. No interest and an EMI of ₹20,000 make the loan part
  // of the next 12 months exactly ₹2,40,000, as the case says.
  const boxes = {
    money: { cashAndBank: 300000 },
    investments: { shares: 200000 },
    owe: { loans: [{ left: 2000000, ratePercent: 0, emi: 20000 }] }
  };
  assert.equal(zakatOf(person(boxes)), 6500);                                  // the start: 12 months
  assert.equal(zakatOf(answering(boxes, { loans: 'whole' })), 0);
  assert.deepEqual(zakatOf(answering(boxes, { loans: 'notSure' })), [0, 6500]);
});

test('F. business: cash ₹50,000 + stock ₹4,00,000 + customers owe ₹60,000 − suppliers ₹1,10,000 = ₹10,000', () => {
  const answer = Zakat.workOut(person({
    business: { runsBusiness: true, cash: 50000, stock: 400000, customersOwe: 60000 },
    owe: { suppliers: 110000 }
  }));
  assert.equal(answer.zakat, 10000);
  assert.equal(answer.low.parts.business, 510000);
});

test('G. 7.5 tola of 24K gold, counted, nothing else = ₹30,618', () => {
  const answer = Zakat.workOut(person({ gold: [{ grams: Nisab.tolaToGrams(7.5), karat: 24 }] }));
  assert.equal(answer.zakat, 30618);                       // 87.48 g reaches 87.48 g
  assert.equal(answer.low.weightRule, true);
  assert.equal(answer.low.nisab.kind, 'gold-weight');
});


/* 3. CASES H TO R (NOT K) ================================================= */

test('H. 50 g of 22K gold, nothing else: gold only, 50 g is below 87.48 g, so ₹0', () => {
  const answer = Zakat.workOut(person({ gold: [{ grams: 50, karat: 22 }] }));
  assert.equal(answer.zakat, 0);
  assert.equal(answer.low.weightRule, true);
  assert.equal(answer.low.nisab.kind, 'gold-weight');
  assert.equal(answer.low.nisab.grams, 87.48);
});

test('I. 50 g of 22K gold + ₹1,000 cash: mixed, so the silver nisab, ₹16,067', () => {
  const answer = Zakat.workOut(person({ gold: [{ grams: 50, karat: 22 }], money: { cashAndBank: 1000 } }));
  assert.equal(answer.zakat, 16067);
  assert.equal(answer.low.weightRule, false);
  assert.equal(answer.low.nisab.kind, 'silver');
});

test('J. 700 g of silver (999) + ₹1,00,000 cash: silver ₹5,650; gold with the weight guard ₹3,150', () => {
  const boxes = { silver: [{ grams: 700, purity: 99.9 }], money: { cashAndBank: 100000 } };
  assert.equal(zakatOf(person(boxes)), 5650);
  const withGold = Zakat.workOut(answering(boxes, { nisab: 'gold' }));
  assert.equal(withGold.zakat, 3150);                      // 700 g reaches 612.36 g on its own
  assert.equal(withGold.low.weightGuard, true);
  assert.deepEqual(withGold.low.guardMetals, ['silver']);
  assert.equal(withGold.low.reachesNisab, false);
});

test('the weight guard takes debts from the other wealth first, then from the metals', () => {
  const boxes = { silver: [{ grams: 700, purity: 99.9 }], money: { cashAndBank: 100000 }, choices: { nisab: 'gold' } };
  // ₹50,000 owed comes off the cash: the 700 g of silver stays whole.
  assert.equal(zakatOf(person(Object.assign({}, boxes, { owe: { payNow: 50000 } }))), 3150);
  // ₹1,50,000 owed: ₹50,000 is left for the silver, so 422 g, under 612.36 g.
  assert.equal(zakatOf(person(Object.assign({}, boxes, { owe: { payNow: 150000 } }))), 0);
});

test('L. ₹5,00,000 cash, home loan ₹20,00,000 left at 8.5%, EMI ₹17,356', () => {
  const boxes = {
    money: { cashAndBank: 500000 },
    owe: { loans: [{ left: 2000000, ratePercent: 8.5, emi: 17356 }] }
  };
  const start = Zakat.workOut(person(boxes));
  assert.ok(Math.abs(start.low.takenOff - 39805) < 10, 'loan part ' + start.low.takenOff);
  assert.equal(start.zakat, 11505);                                            // the loan part only
  assert.equal(zakatOf(answering(boxes, { loans: 'whole' })), 0);
  assert.deepEqual(zakatOf(answering(boxes, { loans: 'notSure' })), [0, 11505]);
});

test('M. ₹3,00,000 cash + ₹2,00,000 long-term shares: full ₹12,500, 25% ₹8,750, 0% ₹7,500', () => {
  const boxes = { money: { cashAndBank: 300000 }, investments: { shares: 200000, sharesToSellSoon: false } };
  assert.equal(zakatOf(person(boxes)), 12500);
  assert.equal(zakatOf(answering(boxes, { shares: 'part', sharesPercent: 25 })), 8750);
  assert.equal(zakatOf(answering(boxes, { shares: 'part', sharesPercent: 0 })), 7500);
});

test('N. husband ₹80,000 cash, wife 40 g of 22K gold: ₹0 and ₹0, one person at a time', () => {
  assert.equal(zakatOf(person({ money: { cashAndBank: 80000 } })), 0);
  assert.equal(zakatOf(person({ gold: [{ grams: 40, karat: 22 }] })), 0);
  // Added together they would wrongly owe ₹14,833: why it is one person.
  assert.equal(zakatOf(person({ money: { cashAndBank: 80000 }, gold: [{ grams: 40, karat: 22 }] })), 14833);
});

test('O. ₹50,000 cash + ₹1,00,000 VPF + ₹3,00,000 compulsory PF: leave out ₹3,750, count now ₹11,250', () => {
  const boxes = { money: { cashAndBank: 50000 }, investments: { vpf: 100000, pfCompulsory: 300000 } };
  assert.equal(zakatOf(person(boxes)), 3750);             // VPF always counted
  assert.equal(zakatOf(answering(boxes, { pf: 'count' })), 11250);
});

test('P. 100 g of 22K gold only, owing ₹50,000 now: 96.10 g left, so ₹30,833', () => {
  const answer = Zakat.workOut(person({ gold: [{ grams: 100, karat: 22 }], owe: { payNow: 50000 } }));
  assert.equal(answer.zakat, 30833);
  assert.equal(answer.low.weightRule, true);
});

test('Q. 90 g of 22K gold only: by weight, never by the 24K gold nisab, so ₹28,875', () => {
  assert.equal(zakatOf(person({ gold: [{ grams: 90, karat: 22 }] })), 28875);
});

test('R. 650 g of silver jewellery (92.5%) only: 650 g reaches 612.36 g, so ₹2,706', () => {
  const answer = Zakat.workOut(person({ silver: [{ grams: 650, purity: 92.5 }] }));
  assert.equal(answer.zakat, 2706);                        // its value, ₹1,08,225, × 2.5%
  assert.equal(answer.low.nisab.kind, 'silver-weight');
  assert.equal(Math.round(answer.low.parts.metals), 108225);
});


/* 4. THE SEVEN FAMILIES =================================================== */

test('Family 1, Aamir: ₹17,176; EPF counted ₹25,676; long-term shares at 25% ₹12,863', () => {
  const aamir = {
    money: { cashAndBank: 182700, wallets: 3000 },          // bank interest of ₹2,300 left out
    gold: [{ grams: 10, karat: 22 }],                       // a man's chain: always counted
    investments: {
      deposits: 100000, vpf: 60000, crypto: 25000,
      shares: 150000, sharesToSellSoon: false, rsus: 80000,
      pfCompulsory: 340000                                  // left out at the start
    },
    owe: { cardBill: 22000, familyLoans: 20000 }
  };
  const answer = Zakat.workOut(person(aamir));
  assert.equal(Math.round(answer.low.counted), 729033);
  assert.equal(answer.zakat, 17176);
  assert.equal(zakatOf(answering(aamir, { pf: 'count' })), 25676);
  assert.equal(zakatOf(answering(aamir, { shares: 'part', sharesPercent: 25 })), 12863);
});

test('Family 2, Sana: 2a ₹0 · 2b ₹3,333 to ₹22,583 · 2c ₹0 to ₹23,291', () => {
  const sana2a = {
    gold: [{ grams: 60, karat: 22 }, { grams: 10, karat: 22 }],   // jewellery she wears + coins
    wornGold: { grams: 60, karat: 22 }
  };
  const a = Zakat.workOut(person(sana2a));
  assert.equal(a.zakat, 0);                                // gold only, under 87.48 g either way
  assert.deepEqual(a.open, ['jewellery']);

  const sana2b = Object.assign({}, sana2a, { money: { cashAndBank: 5000 } });
  assert.deepEqual(zakatOf(person(sana2b)), [3333, 22583]);

  const sana2c = Object.assign({}, sana2a, {
    silver: [{ grams: 200, purity: 92.5 }],                 // a payal she wears
    wornSilver: { grams: 200, purity: 92.5 }
  });
  assert.deepEqual(zakatOf(person(sana2c)), [0, 23291]);
});

test('Family 3, Imran: ₹43,150, and each of his other answers', () => {
  const imran = {
    money: { cashAndBank: 150000, committeePaidIn: 36000 }, // ₹40,000 at home + ₹1,10,000 in the bank
    business: { runsBusiness: true, cash: 80000, stock: 650000, customersOwe: 100000 },
    property: { plot: 800000 },
    investments: { licPremiums: 120000 },
    // The shop loan: ₹2,00,000 left, ₹60,000 of loan part due in the next
    // 12 months (no interest and an EMI of ₹5,000 give exactly that).
    owe: { suppliers: 150000, loans: [{ left: 200000, ratePercent: 0, emi: 5000 }] },
    choices: { plot: 'toSell' }
  };
  const answer = Zakat.workOut(person(imran));
  assert.equal(answer.low.counted, 1936000);
  assert.equal(answer.low.takenOff, 210000);
  assert.equal(answer.zakat, 43150);
  assert.equal(zakatOf(answering(imran, { lic: 'notUntil' })), 40150);
  assert.equal(zakatOf(answering(imran, { loans: 'whole' })), 39650);
  assert.equal(zakatOf(answering(imran, { lic: 'notUntil', loans: 'whole' })), 36650);
  assert.deepEqual(zakatOf(answering(imran, { lic: 'notSure', loans: 'notSure' })), [36650, 43150]);
  assert.equal(zakatOf(answering(imran, { plot: 'undecided' })), 23150);
});

test('Family 4, Fatima: ₹21,314 to ₹30,939; with the gold nisab, the guard gives ₹2,914', () => {
  const fatima = {
    money: { cashAndBank: 236000 },                         // ₹4,000 of bank interest left out
    investments: { deposits: 500000 },                      // the senior-citizen deposit
    gold: [{ grams: 30, karat: 22 }],
    wornGold: { grams: 30, karat: 22 },                     // the bangles she wears
    silver: [{ grams: 700, purity: 92.5 }]                  // kept in a box: always counted
  };
  assert.deepEqual(zakatOf(person(fatima)), [21314, 30939]);
  assert.equal(zakatOf(answering(fatima, { nisab: 'gold', jewellery: 'count' })), 30939);
  const guarded = Zakat.workOut(answering(fatima, { nisab: 'gold', jewellery: 'dontCount' }));
  assert.equal(guarded.zakat, 2914);                       // on her 700 g of silver
  assert.deepEqual(guarded.low.guardMetals, ['silver']);
});

test('Family 5, Salman: ₹33,082; the whole loan ₹0; "Not sure" ₹0 to ₹33,082', () => {
  const salman = {
    money: { cashAndBank: 391000, otherCurrencies: 512000 }, // NRE without interest; AED 20,000 at ₹25.6
    investments: { sgbGrams: 20, goldFunds: 50000, npsOwn: 150000 },
    owe: { loans: [{ left: 3000000, ratePercent: 8.5, emi: 26035 }] }
  };
  const answer = Zakat.workOut(person(salman));
  assert.equal(answer.low.counted, 1383000);
  assert.ok(Math.abs(answer.low.takenOff - 59707) < 10, 'loan part ' + answer.low.takenOff);
  assert.equal(answer.zakat, 33082);
  assert.equal(answer.low.weightRule, false);              // an SGB is never "gold only"
  assert.equal(zakatOf(answering(salman, { loans: 'whole' })), 0);
  assert.deepEqual(zakatOf(answering(salman, { loans: 'notSure' })), [0, 33082]);
});

test('Family 6, Zaid ₹0 and Ayesha ₹0 to ₹13,583, each on their own', () => {
  // Zaid's deferred mehr is not due yet, so it is not taken off.
  assert.equal(zakatOf(person({ money: { cashAndBank: 90000 } })), 0);
  const ayesha = {
    gold: [{ grams: 40, karat: 22 }],
    wornGold: { grams: 40, karat: 22 },
    money: { cashAndBank: 30000 }                           // the mehr owed to her is not counted
  };
  assert.deepEqual(zakatOf(person(ayesha)), [0, 13583]);
  // As one household they would wrongly owe ₹15,833.
  assert.equal(zakatOf(person({ gold: [{ grams: 40, karat: 22 }], money: { cashAndBank: 120000 } })), 15833);
});

test('Family 7, Rafiq: gold kept for a gold loan, ₹19,250; not counted ₹0; "Not sure" ₹0 to ₹19,250', () => {
  const rafiq = {
    money: { cashAndBank: 50000 },
    goldWithLender: { grams: 80, karat: 24 },
    owe: { loans: [{ left: 400000 }] }                      // no EMI: paid back in one go, within 12 months
  };
  assert.equal(zakatOf(person(rafiq)), 19250);
  assert.equal(zakatOf(answering(rafiq, { goldLoan: 'dontCount' })), 0);
  assert.deepEqual(zakatOf(answering(rafiq, { goldLoan: 'notSure' })), [0, 19250]);
});


/* 5. LOANS, PURITY AND RATES ============================================== */

test('the loan part of the next 12 months, from the loan left, the rate and the EMI', () => {
  // With the exact EMIs (₹17,356.46 and ₹26,034.70) the rules' figures.
  assert.equal(Math.round(Zakat.principalNext12Months(2000000, 8.5, 17356.464667)), 39805);
  assert.equal(Math.round(Zakat.principalNext12Months(3000000, 8.5, 26034.697)), 59707);
  // No interest ("no-cost EMI", a committee): every rupee of the EMI.
  assert.equal(Zakat.principalNext12Months(100000, 0, 5000), 60000);
  // A loan that ends within the year: never more than the loan left.
  assert.equal(Zakat.principalNext12Months(30000, 0, 5000), 30000);
  assert.ok(Zakat.principalNext12Months(30000, 12, 10000) <= 30000);
  // No EMI (paid back in one go): all of it falls in the next 12 months.
  assert.equal(Zakat.principalNext12Months(400000, 9, 0), 400000);
  // An EMI smaller than the interest pays off nothing of the loan.
  assert.equal(Zakat.principalNext12Months(1000000, 12, 5000), 0);
  assert.equal(Zakat.principalNext12Months(0, 8.5, 17356), 0);
});

test('committee money still to pay is taken off like a long loan', () => {
  const boxes = {
    money: { cashAndBank: 300000 },
    owe: { committee: { left: 100000, monthly: 5000 } }     // 20 months left
  };
  assert.equal(Zakat.workOut(person(boxes)).low.takenOff, 60000);           // the next 12 months
  assert.equal(Zakat.workOut(answering(boxes, { loans: 'whole' })).low.takenOff, 100000);
});

test('silver purity: 999 counts in full, 925 is 92.5%, another % as typed', () => {
  assert.equal(Zakat.purityShare(99.9), 1);
  assert.equal(Zakat.purityShare(92.5), 0.925);
  assert.equal(Zakat.purityShare(80), 0.8);
  assert.equal(Zakat.purityShare(0), 0);
  assert.equal(Zakat.purityShare(150), 0);
});

test("gold of each karat: IBJA's own 22K, 18K and 14K rates when the rates have them", () => {
  const ibja = { gold24k: 12389.3, silver: 152.528, gold22k: 11348.6, gold18k: 9292, gold14k: 7247.7 };
  assert.equal(Zakat.goldRate(ibja, 22), 11348.6);
  assert.equal(Zakat.goldRate(ibja, 14), 7247.7);
  assert.equal(Zakat.goldRate(RATES, 18), 10500);          // without them: 18 parts of 24
  assert.throws(() => Zakat.goldRate(RATES, 9), /Karat/);  // 9K is not counted as gold
});


/* 6. "NOT SURE" ============================================================ */

test('"Not sure" shows the lowest and the highest, never an average', () => {
  const answer = Zakat.workOut(person({
    money: { cashAndBank: 100000 },
    gold: [{ grams: 50, karat: 22 }],
    wornGold: { grams: 50, karat: 22 }
  }));
  assert.equal(answer.zakat, null);                        // no single number
  assert.notEqual(answer.low.zakat, (0 + 18542) / 2);
  assert.equal(answer.low.choices.jewellery, 'dontCount');
  assert.equal(answer.high.choices.jewellery, 'count');
});

test('a "Not sure" whose box is empty is not an open question', () => {
  const answer = Zakat.workOut(person({ money: { cashAndBank: 500000 }, choices: { lic: 'notSure', flat: 'notSure' } }));
  assert.deepEqual(answer.open, []);
  assert.equal(answer.zakat, 12500);
});

test('the starting answers, and which questions show', () => {
  const starts = Zakat.withStartingAnswers({});
  assert.equal(starts.nisab, 'silver');
  assert.equal(starts.jewellery, 'notSure');
  assert.equal(starts.loans, 'next12');
  assert.equal(starts.shares, 'full');
  assert.equal(starts.pf, 'leaveOut');
  assert.equal(starts.lic, 'count');
  assert.equal(starts.goldLoan, 'count');
  assert.equal(starts.plot, null);
  assert.equal(starts.flat, 'notUntil');
  assert.deepEqual(Zakat.questionsToShow({ money: { cashAndBank: 1000 } }), []);
  assert.deepEqual(Zakat.questionsToShow({
    gold: [{ grams: 10, karat: 22 }], wornGold: { grams: 5 },
    investments: { shares: 100, licPremiums: 100 }, property: { plot: 100 }
  }), ['jewellery', 'shares', 'lic', 'plot']);
  // Shares bought to sell soon: no question, always the full value.
  assert.deepEqual(Zakat.questionsToShow({ investments: { shares: 100, sharesToSellSoon: true } }), []);
});


/* 7. WRONG RATES, AND ODD BOXES =========================================== */

test('missing or wrong rates are refused, never turned into an answer', () => {
  assert.throws(() => Zakat.workOut({ money: { cashAndBank: 1000 } }), /rates are missing/);
  assert.throws(() => Zakat.workOut({ rates: { gold24k: 0, silver: 180 } }), /gold rate/);
  assert.throws(() => Zakat.workOut({ rates: { gold24k: 14000, silver: '180' } }), /silver rate/);
});

test('empty, negative or written-out boxes count as nothing', () => {
  assert.equal(zakatOf(person({})), 0);
  assert.equal(zakatOf(person({ money: { cashAndBank: -500000, wallets: NaN, lent: '900000' } })), 0);
});

test('debts bigger than everything give ₹0, never less', () => {
  const answer = Zakat.workOut(person({ money: { cashAndBank: 200000 }, owe: { payNow: 900000 } }));
  assert.equal(answer.zakat, 0);
  assert.ok(answer.low.result < 0);
});

test('without the business tick, business boxes and suppliers are left out', () => {
  const answer = Zakat.workOut(person({
    money: { cashAndBank: 500000 },
    business: { runsBusiness: false, stock: 400000 },
    owe: { suppliers: 100000 }
  }));
  assert.equal(answer.zakat, 12500);
});

test('a plot is counted only once "To sell" is chosen; shares bought to sell soon always in full', () => {
  const plot = { money: { cashAndBank: 500000 }, property: { plot: 1000000 } };
  assert.equal(zakatOf(person(plot)), 12500);                                // not answered yet
  assert.equal(zakatOf(answering(plot, { plot: 'toUse' })), 12500);
  assert.equal(zakatOf(answering(plot, { plot: 'toSell' })), 37500);
  const shares = { investments: { shares: 400000, sharesToSellSoon: true } };
  assert.equal(zakatOf(answering(shares, { shares: 'part', sharesPercent: 25 })), 10000);
});

test('worn jewellery with no gold or silver above it is not an open question', () => {
  const answer = Zakat.workOut(person({ money: { cashAndBank: 500000 }, wornGold: { grams: 60, karat: 22 } }));
  assert.deepEqual(answer.open, []);
  assert.equal(answer.zakat, 12500);
});

test('worn jewellery is never more than the gold typed above it', () => {
  const answer = Zakat.workOut(answering({
    money: { cashAndBank: 200000 },
    gold: [{ grams: 10, karat: 22 }],
    wornGold: { grams: 500, karat: 22 }
  }, { jewellery: 'dontCount' }));
  assert.equal(answer.low.parts.metals, 0);
  assert.equal(answer.zakat, 5000);
});


/* 8. THE PAGE ============================================================= */

const PAGE_FILE = path.join(SITE, 'zakat-calculator', 'index.html');

test('the page loads nisab.js, then zakat.js, then its screen code', () => {
  const html = fs.readFileSync(PAGE_FILE, 'utf8');
  const at = (file) => html.indexOf('<script src="' + file + '"');
  assert.ok(at('/assets/calc/nisab.js') > 0, 'nisab.js is loaded');
  assert.ok(at('/assets/calc/nisab.js') < at('/assets/calc/zakat.js'), 'nisab.js before zakat.js');
  assert.ok(at('/assets/calc/zakat.js') < at('/assets/tools/zakat-page.js'), 'zakat.js before zakat-page.js');
});

// Every figure marked data-nisab on the page shows what the rates give,
// and sits between the NISAB markers (where the daily script rewrites it).
function checkFigures(html, prices) {
  const words = {
    'silver-nisab': Nisab.formatRupees(Nisab.silverNisab(prices.silver_999_per_gram)),
    'gold-nisab': Nisab.formatRupees(Nisab.goldNisab(prices.gold_24k_per_gram)),
    'silver-rate': Nisab.formatRate(prices.silver_999_per_gram),
    'gold-rate': Nisab.formatRate(prices.gold_24k_per_gram),
    'as-of': Nisab.formatDate(prices.as_of)
  };
  const pattern = /<(\w+)\b([^>]*\bdata-nisab="([^"]+)"[^>]*)>([^<]*)<\/\1>/g;
  let match, found = 0;
  while ((match = pattern.exec(html))) {
    found += 1;
    assert.equal(match[4], words[match[3]], 'the ' + match[3] + ' figure');
    const start = html.lastIndexOf('<!-- NISAB START -->', match.index);
    const end = html.lastIndexOf('<!-- NISAB END -->', match.index);
    assert.ok(start > end, 'the ' + match[3] + ' figure is outside the NISAB markers');
  }
  assert.ok(found >= 3, 'the page shows the rates and their date');
}

test("the page's nisab figures match prices.json, between the NISAB markers", () => {
  const prices = JSON.parse(fs.readFileSync(path.join(SITE, 'assets', 'data', 'prices.json'), 'utf8'));
  checkFigures(fs.readFileSync(PAGE_FILE, 'utf8'), prices);
});

// The Python on this computer: "python3", "python" or "py" (Windows).
function findPython() {
  for (const name of ['python3', 'python', 'py']) {
    const tried = spawnSync(name, ['--version'], { encoding: 'utf8' });
    if (tried.status === 0 && /Python 3/.test(tried.stdout + tried.stderr)) return name;
  }
  return null;
}

const python = findPython();

test('the daily rate update rewrites the calculator page too, with no problem',
     { skip: python ? false : 'Python 3 not found' }, () => {
  // A copy of the script, prices.json, the page and the sitemap, in a
  // folder of its own, so the real files never change.
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'zakat-test-'));
  for (const file of ['scripts/update_prices.py', 'assets/data/prices.json',
                      'zakat-calculator/index.html', 'sitemap.xml']) {
    fs.mkdirSync(path.join(folder, path.dirname(file)), { recursive: true });
    fs.copyFileSync(path.join(SITE, file), path.join(folder, file));
  }
  const run = spawnSync(python, [path.join(folder, 'scripts', 'update_prices.py'),
                                 '--gold', '13000.5', '--silver', '160.123', '--date', '2026-11-13'],
                        { cwd: folder, encoding: 'utf8', env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' }) });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /zakat-calculator\/index\.html \(\d+ figures\)/);
  const prices = JSON.parse(fs.readFileSync(path.join(folder, 'assets/data/prices.json'), 'utf8'));
  checkFigures(fs.readFileSync(path.join(folder, 'zakat-calculator/index.html'), 'utf8'), prices);
  fs.rmSync(folder, { recursive: true, force: true });
});
