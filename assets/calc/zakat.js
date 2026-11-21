/* ==========================================================================
   PUREVESTING — THE ZAKAT MATHS
   Save at:  /assets/calc/zakat.js
   Shows on: /zakat-calculator/ — the answer (one number, or two when the
   person said "Not sure"), the bar in parts under it, and the running
   total at the bottom of the screen.

   It works out zakat for ONE person at a time, from what they typed. It
   never decides for them: where scholars differ, the person answers a
   question, and "Not sure" gives the lowest and the highest zakat over
   every open question (never an average).

   The method in short (README.md, "How the zakat calculator works", has
   it in full):
     1. Add up what is counted: money, gold and silver, investments,
        property and business, as the person's answers say.
     2. Take off what they owe, as their answer on long loans says. The
        interest inside an EMI is never taken off, only the loan part.
     3. Compare what is left with the nisab:
          - only gold is counted   → its weight with 87.48 g;
          - only silver is counted → its weight with 612.36 g;
          - anything else          → its value with the silver nisab, or
            with the gold nisab if the person chose gold. With gold, a
            metal that reaches its own weight still owes zakat.
     4. Zakat = 2.5% of all of it once it reaches the nisab; otherwise
        nothing. Rounded to the nearest rupee.

   Small "pure" functions: each one only works out an answer from what it
   is given. None of them reads the page, the internet or the phone's
   storage, so tests/zakat.test.js can check every one.
   Run the tests with:  node --test tests/

   It uses assets/calc/nisab.js (the nisab weights, tola, the gold rate
   of each karat, rounding), so a page loads nisab.js first. The page's
   screen code is assets/tools/zakat-page.js.
   ========================================================================== */

var Zakat = (function (Nisab) {

  /* 1. THE FIXED NUMBERS =================================================
     Zakat is one-fortieth (2.5%). The nisab weights come from nisab.js,
     so the two files can never disagree. */

  var ZAKAT_SHARE = 0.025;                             // 2.5%
  var GOLD_NISAB_GRAMS = Nisab.GOLD_NISAB_GRAMS;       // 87.48 g, 7.5 tola
  var SILVER_NISAB_GRAMS = Nisab.SILVER_NISAB_GRAMS;   // 612.36 g, 52.5 tola
  var LOAN_MONTHS = 12;                                // long loans: the next 12 months


  /* 2. THE NINE CHOICES ==================================================
     Where scholars differ, the person answers. Each choice lists its
     answers and the one it starts with. "notSure" makes two numbers.
       1. nisab      Which minimum (nisab) for money?
       2. jewellery  Women's jewellery worn regularly
       3. loans      Long loans paid in EMIs (and committee money owed)
       4. shares     Shares, funds and vested job shares kept long-term
                     (with "part", the % is in sharesPercent)
       5. pf         Compulsory PF and NPS (and the employer's part)
       6. lic        LIC and ULIP premiums
       7. goldLoan   Gold kept with a lender for a gold loan
       8. plot       Why did you buy the plot? Counted only "to sell";
                     until it is answered, the plot is not counted.
       9. flat       A flat or shop booked to resell */

  var CHOICES = {
    nisab:     { answers: ['silver', 'gold'],                  start: 'silver' },
    jewellery: { answers: ['count', 'dontCount', 'notSure'],   start: 'notSure' },
    loans:     { answers: ['next12', 'whole', 'notSure'],      start: 'next12' },
    shares:    { answers: ['full', 'part'],                    start: 'full' },
    pf:        { answers: ['leaveOut', 'count'],               start: 'leaveOut' },
    lic:       { answers: ['count', 'notUntil', 'notSure'],    start: 'count' },
    goldLoan:  { answers: ['count', 'dontCount', 'notSure'],   start: 'count' },
    plot:      { answers: ['toSell', 'toUse', 'undecided'],    start: null },
    flat:      { answers: ['count', 'notUntil', 'notSure'],    start: 'notUntil' }
  };

  // The two real answers behind each "Not sure": the lowest and the
  // highest zakat are found among them.
  var NOT_SURE_ANSWERS = {
    jewellery: ['count', 'dontCount'],
    loans:     ['next12', 'whole'],
    lic:       ['count', 'notUntil'],
    goldLoan:  ['count', 'dontCount'],
    flat:      ['count', 'notUntil']
  };

  // The person's answers, with the starting answer for any question not
  // answered (or answered with something this file doesn't know).
  function withStartingAnswers(choices) {
    var given = choices || {};
    var filled = {};
    Object.keys(CHOICES).forEach(function (name) {
      var answer = given[name];
      filled[name] = CHOICES[name].answers.indexOf(answer) >= 0 ? answer : CHOICES[name].start;
    });
    filled.sharesPercent = sharesPercent(given.sharesPercent);
    return filled;
  }

  // The % of long-term shares to count, from 0 to 100. With no % typed
  // yet, the full value (100) stays, so nothing jumps while typing.
  function sharesPercent(value) {
    if (typeof value !== 'number' || !isFinite(value)) return 100;
    return Math.min(100, Math.max(0, value));
  }


  /* 3. CHECKING WHAT COMES IN ============================================
     An empty box, a word or a minus counts as 0. A wrong rate stops with
     a plain message (from nisab.js), instead of a wrong answer. */

  // An amount from a box: a number above zero, or 0.
  function amount(value) {
    return typeof value === 'number' && isFinite(value) && value > 0 ? value : 0;
  }

  // The rates must be real numbers above zero, for 1 gram.
  function checkRates(rates) {
    if (!rates) {
      throw new Error('The rates are missing: give gold24k and silver, each for 1 gram.');
    }
    Nisab.goldNisab(rates.gold24k);
    Nisab.silverNisab(rates.silver);
  }

  // Grams to the milligram, so a computer's tiny errors (87.47999…) never
  // turn 87.48 g into "below the nisab".
  function roundGrams(grams) {
    return Number(grams.toFixed(3));
  }

  // Rupees to the paisa, for the same reason, when comparing with a nisab.
  function roundPaise(rupees) {
    return Number(rupees.toFixed(2));
  }


  /* 4. RATES =============================================================
     Gold: IBJA's own 22K, 18K or 14K rate when the rates have it (from
     prices.json); otherwise 22, 18 or 14 parts of the 24K rate. Silver:
     the 999 rate, times how much of the piece is silver. */

  // The rate for 1 gram of gold of this karat (24, 22, 18 or 14).
  // goldRate({ gold24k: 14000, silver: 180 }, 22) → 12833.33…
  function goldRate(rates, karat) {
    return Nisab.goldRateFromPrices({
      gold_24k_per_gram: rates.gold24k,
      gold_22k_per_gram: rates.gold22k,
      gold_18k_per_gram: rates.gold18k,
      gold_14k_per_gram: rates.gold14k
    }, karat);
  }

  // How much of a silver piece is silver, as a share of 1. The rate is
  // for 999 silver, so 999 counts in full; 925 is 92.5%.
  // purityShare(99.9) → 1 · purityShare(92.5) → 0.925 · purityShare(80) → 0.8
  function purityShare(percent) {
    if (typeof percent !== 'number' || !(percent > 0) || percent > 100) return 0;
    return percent >= 99.9 ? 1 : percent / 100;
  }

  // The karat all the gold rows share, or null when they differ.
  function sameKarat(rows) {
    var karat = null;
    for (var i = 0; i < (rows || []).length; i++) {
      if (!amount(rows[i] && rows[i].grams)) continue;
      if (karat !== null && rows[i].karat !== karat) return null;
      karat = rows[i].karat;
    }
    return karat;
  }

  // The purity all the silver rows share, or null when they differ.
  function samePurity(rows) {
    var purity = null;
    for (var i = 0; i < (rows || []).length; i++) {
      if (!amount(rows[i] && rows[i].grams)) continue;
      if (purity !== null && rows[i].purity !== purity) return null;
      purity = rows[i].purity;
    }
    return purity;
  }


  /* 5. LONG LOANS: THE LOAN PART OF THE NEXT 12 MONTHS ===================
     From what a loan statement shows: the loan left (the principal), the
     interest rate a year, and the EMI. Each month an EMI first pays that
     month's interest (the loan left × the rate ÷ 12 ÷ 100); the rest of
     the EMI pays off the loan itself. This adds up that rest over the
     next 12 months, as the usual EMI table does. Only this loan part is
     taken off; the interest never is.
       - No EMI (a loan paid back in one go, like most gold loans): all of
         it falls in the next 12 months.
       - No interest (a "no-cost EMI", or a committee): the whole EMI is
         loan part.
     principalNext12Months(2000000, 8.5, 17356) → about 39,800 */

  function principalNext12Months(loanLeft, yearlyRatePercent, emi) {
    var left = amount(loanLeft);
    if (!left) return 0;
    var monthly = amount(emi);
    if (!monthly) return left;
    var monthlyRate = amount(yearlyRatePercent) / 12 / 100;
    var principal = 0;
    for (var month = 0; month < LOAN_MONTHS && left > 0; month++) {
      var interest = left * monthlyRate;
      var loanPart = Math.min(left, Math.max(0, monthly - interest));
      principal += loanPart;
      left -= loanPart;
    }
    return principal;
  }

  // What a long loan takes off, by the answer to the loan question:
  // "next12" = the loan part of the next 12 months; "whole" = all of the
  // loan left (its future interest is not owed yet, so it is never added).
  function loanToTakeOff(loan, answer) {
    var left = amount(loan && loan.left);
    if (!left) return 0;
    if (answer === 'whole') return left;
    return principalNext12Months(left, loan.ratePercent, loan.emi);
  }


  /* 6. WHAT IS COUNTED, PART BY PART =====================================
     Each part gives its value in rupees (not rounded: only the zakat
     itself is rounded). Gold and silver also give their whole weight, for
     the weight rules in part 7. */

  // GROUP 1 · MONEY: cash and bank (without the bank's interest), wallets
  // and UPI apps, other currencies (in rupees), a trading account's cash,
  // money lent and expected back, and committee money paid in and not yet
  // received.
  function countMoney(money) {
    var m = money || {};
    return amount(m.cashAndBank) + amount(m.wallets) + amount(m.otherCurrencies) +
           amount(m.tradingCash) + amount(m.lent) + amount(m.committeePaidIn);
  }

  // GROUP 2 · GOLD: the rows (coins, bars, jewellery…), minus the worn
  // jewellery if the person doesn't count it; gold lent to someone; gold
  // kept with a lender, as choice 7 says; digital gold and EGR (24K).
  // Weight = the whole weight of the 24K to 14K pieces.
  function countGold(input, choices, rates) {
    var grams = 0, value = 0;
    (input.gold || []).forEach(function (row) {
      var rowGrams = amount(row && row.grams);
      if (!rowGrams) return;
      grams += rowGrams;
      value += rowGrams * goldRate(rates, row.karat);
    });

    // Of those rows: jewellery a woman wears regularly. Never more than
    // the rows themselves.
    var worn = input.wornGold || {};
    var wornGrams = Math.min(amount(worn.grams), grams);
    if (wornGrams && choices.jewellery === 'dontCount') {
      var wornKarat = worn.karat || sameKarat(input.gold) || 22;
      var wornValue = Math.min(value, wornGrams * goldRate(rates, wornKarat));
      grams = Math.max(0, grams - wornGrams);
      value = Math.max(0, value - wornValue);
    }

    // Gold lent to someone: always counted, as gold.
    var lent = input.goldLent || {};
    if (amount(lent.grams)) {
      grams += amount(lent.grams);
      value += amount(lent.grams) * goldRate(rates, lent.karat || 22);
    }

    // Gold kept with a lender for a gold loan: as choice 7 says.
    var pledged = input.goldWithLender || {};
    if (amount(pledged.grams) && choices.goldLoan === 'count') {
      grams += amount(pledged.grams);
      value += amount(pledged.grams) * goldRate(rates, pledged.karat || 22);
    }

    // Digital gold and EGR: grams of 24K gold.
    var digital = amount(input.digitalGoldGrams);
    if (digital) {
      grams += digital;
      value += digital * goldRate(rates, 24);
    }
    return { grams: grams, value: value };
  }

  // GROUP 2 · SILVER: the rows (jewellery, coins, utensils), each by its
  // grams × the silver rate × its purity, minus the worn jewellery if the
  // person doesn't count it (the same question as for gold). Weight = the
  // whole weight of the pieces.
  function countSilver(input, choices, rates) {
    var grams = 0, value = 0;
    (input.silver || []).forEach(function (row) {
      var rowGrams = amount(row && row.grams);
      var share = purityShare(row && row.purity);
      if (!rowGrams || !share) return;
      grams += rowGrams;
      value += rowGrams * rates.silver * share;
    });

    var worn = input.wornSilver || {};
    var wornGrams = Math.min(amount(worn.grams), grams);
    if (wornGrams && choices.jewellery === 'dontCount') {
      var wornPurity = worn.purity || samePurity(input.silver) || 92.5;
      var wornValue = Math.min(value, wornGrams * rates.silver * purityShare(wornPurity));
      grams = Math.max(0, grams - wornGrams);
      value = Math.max(0, value - wornValue);
    }
    return { grams: grams, value: value };
  }

  // GROUP 3 · INVESTMENTS. Shares bought to sell soon: their full value.
  // Shares kept long-term and vested job shares: as choice 4 says. SGB:
  // grams × today's 24K rate (it is never "gold in hand"). Compulsory PF
  // and NPS: as choice 5 says. LIC and ULIP premiums: as choice 6 says.
  // Everything else here (crypto, gold ETFs and funds, deposits and
  // schemes at the money put in, VPF, your own NPS payments): in full.
  function countInvestments(investments, choices, rates) {
    var inv = investments || {};
    var longTermShare = choices.shares === 'part' ? choices.sharesPercent / 100 : 1;
    var shares = amount(inv.shares);
    var counted = inv.sharesToSellSoon === true ? shares : shares * longTermShare;
    counted += amount(inv.rsus) * longTermShare;
    counted += amount(inv.crypto) + amount(inv.goldFunds) + amount(inv.deposits) +
               amount(inv.vpf) + amount(inv.npsOwn);
    counted += amount(inv.sgbGrams) * goldRate(rates, 24);
    if (choices.pf === 'count') counted += amount(inv.pfCompulsory) + amount(inv.npsCompulsory);
    if (choices.lic === 'count') counted += amount(inv.licPremiums);
    return counted;
  }

  // GROUP 4 · PROPERTY. A plot: its market value, only if bought to sell
  // (choice 8). A flat or shop booked to resell: what was paid, as choice
  // 9 says.
  function countProperty(property, choices) {
    var p = property || {};
    var counted = 0;
    if (choices.plot === 'toSell') counted += amount(p.plot);
    if (choices.flat === 'count') counted += amount(p.flatPaid);
    return counted;
  }

  // GROUP 5 · BUSINESS, only when the person runs one: stock at today's
  // selling price, the business's cash, money customers owe, and property
  // bought to sell.
  function countBusiness(business) {
    var b = business || {};
    if (!b.runsBusiness) return 0;
    return amount(b.stock) + amount(b.cash) + amount(b.customersOwe) + amount(b.propertyToSell);
  }

  // GROUP 6 · WHAT YOU OWE. Taken off in full: money to pay now, a credit
  // card bill due now, what the business owes its suppliers now (only
  // with a business), family loans with no fixed dates, mehr due now,
  // deposits to give back, and builder instalments due in the next 12
  // months. Committee money still to pay, and long loans: as choice 3
  // says (a committee is like a loan with no interest, its monthly
  // payment the EMI).
  function countDebts(owe, choices, runsBusiness) {
    var o = owe || {};
    var debts = amount(o.payNow) + amount(o.cardBill) + amount(o.familyLoans) +
                amount(o.mehrDueNow) + amount(o.depositsToReturn) + amount(o.builderNext12);
    if (runsBusiness) debts += amount(o.suppliers);
    var committee = o.committee || {};
    debts += loanToTakeOff({ left: committee.left, ratePercent: 0, emi: committee.monthly }, choices.loans);
    (o.loans || []).forEach(function (loan) {
      debts += loanToTakeOff(loan, choices.loans);
    });
    return debts;
  }


  /* 7. THE NISAB =========================================================
     - Only gold counted (no money, silver, investments, property or
       business): the gold's WEIGHT left after debts, against 87.48 g.
       Grams left = (gold value − debts) ÷ (gold value ÷ gold grams).
     - Only silver counted: the same, against 612.36 g.
     - Anything else: the VALUE left after debts, against the silver nisab
       in rupees, or the gold nisab if the person chose gold.
     - With gold chosen and the value below it, each metal that reaches
       its own weight still owes zakat on itself (the weight guard). Debts
       come off the person's other wealth first; only what is left over
       comes off the metals, each by its share of their value. */

  // A metal on its own: its weight left after debts, against its nisab.
  function byWeight(metal, takenOff, nisabGrams, kind) {
    var valueLeft = metal.value - takenOff;
    var gramsLeft = valueLeft > 0 ? roundGrams(valueLeft / (metal.value / metal.grams)) : 0;
    var reaches = gramsLeft >= nisabGrams;
    return {
      nisab: { kind: kind, grams: nisabGrams, rupees: null },
      weightRule: true,
      weightGuard: false,
      guardMetals: [],
      reachesNisab: reaches,
      zakatBase: reaches ? valueLeft : 0
    };
  }

  // The weight guard: what each metal still owes on its own. Gives back
  // the amount the 2.5% is taken of, and which metals reached their own
  // weight (['silver'], ['gold'], both, or none).
  function weightGuard(gold, silver, otherWealth, takenOff) {
    var debtLeft = Math.max(0, takenOff - otherWealth);
    var metalsValue = gold.value + silver.value;
    var base = 0, metals = [];
    [['gold', gold, GOLD_NISAB_GRAMS], ['silver', silver, SILVER_NISAB_GRAMS]].forEach(function (each) {
      var metal = each[1];
      if (!(metal.value > 0)) return;
      var valueLeft = metal.value - debtLeft * metal.value / metalsValue;
      var gramsLeft = valueLeft > 0 ? roundGrams(valueLeft / (metal.value / metal.grams)) : 0;
      if (gramsLeft >= each[2]) {
        base += valueLeft;
        metals.push(each[0]);
      }
    });
    return { base: base, metals: metals };
  }

  function compareWithNisab(gold, silver, otherWealth, takenOff, choices, rates) {
    if (gold.value > 0 && silver.value === 0 && otherWealth === 0) {
      return byWeight(gold, takenOff, GOLD_NISAB_GRAMS, 'gold-weight');
    }
    if (silver.value > 0 && gold.value === 0 && otherWealth === 0) {
      return byWeight(silver, takenOff, SILVER_NISAB_GRAMS, 'silver-weight');
    }

    // The nisab in rupees, as the page shows it (rounded to the rupee).
    var useGold = choices.nisab === 'gold';
    var nisabRupees = useGold ? Nisab.goldNisab(rates.gold24k) : Nisab.silverNisab(rates.silver);
    var result = otherWealth + gold.value + silver.value - takenOff;
    var reaches = roundPaise(result) >= nisabRupees;
    var base = reaches ? result : 0;
    var guardMetals = [];
    if (!reaches && useGold) {
      var guard = weightGuard(gold, silver, otherWealth, takenOff);
      base = guard.base;
      guardMetals = guard.metals;
    }
    return {
      nisab: { kind: useGold ? 'gold' : 'silver', grams: null, rupees: nisabRupees },
      weightRule: false,
      weightGuard: guardMetals.length > 0,
      guardMetals: guardMetals,
      reachesNisab: reaches,
      zakatBase: base
    };
  }


  /* 8. ONE ANSWER, FOR ONE SET OF ANSWERS ================================
     Every question settled (no "Not sure"): the parts, what is taken off,
     the result, the nisab and the zakat. */

  function oneAnswer(input, choices) {
    var rates = input.rates;
    var gold = countGold(input, choices, rates);
    var silver = countSilver(input, choices, rates);
    var runsBusiness = !!(input.business && input.business.runsBusiness);
    var parts = {
      money: countMoney(input.money),
      metals: gold.value + silver.value,
      investments: countInvestments(input.investments, choices, rates),
      property: countProperty(input.property, choices),
      business: countBusiness(input.business)
    };
    var otherWealth = parts.money + parts.investments + parts.property + parts.business;
    var counted = otherWealth + parts.metals;
    var takenOff = countDebts(input.owe, choices, runsBusiness);
    var check = compareWithNisab(gold, silver, otherWealth, takenOff, choices, rates);
    return {
      choices: choices,                  // the answers this one used
      parts: parts,                      // money, metals (gold and silver), investments, property, business
      goldGrams: gold.grams,             // the gold and silver counted, by weight
      silverGrams: silver.grams,
      counted: counted,                  // the five parts added up
      takenOff: takenOff,                // what the person owes, as taken off
      result: counted - takenOff,        // what is left (below zero when debts are bigger)
      nisab: check.nisab,                // { kind, rupees, grams }: the nisab used
      weightRule: check.weightRule,      // true: only gold or only silver, compared by weight
      weightGuard: check.weightGuard,    // true: gold chosen, and a metal owes zakat on its own
      guardMetals: check.guardMetals,    // which metals did: ['silver'], ['gold'] or both
      reachesNisab: check.reachesNisab,
      zakatBase: check.zakatBase,        // what the 2.5% is taken of
      zakat: Nisab.roundToRupee(check.zakatBase * ZAKAT_SHARE)
    };
  }


  /* 9. THE WHOLE ANSWER, WITH "NOT SURE" =================================
     A question is open when its answer is "Not sure" and its box has a
     number. Every way the open questions could be answered is worked out
     (at most 2 × 2 × 2 × 2 × 2 = 32 ways); the lowest and the highest
     zakat among them are the two numbers. Never an average.
     workOut(input) → { zakat, isRange, low, high, open }
       zakat   the one number, or null when there are two
       low     the answer with the lowest zakat (low.zakat is the number)
       high    the answer with the highest zakat
       open    the questions still open, like ['jewellery', 'loans'] */

  // True when some row of gold or silver has grams in it.
  function hasGrams(rows) {
    return (rows || []).some(function (row) { return amount(row && row.grams) > 0; });
  }

  // True when the box behind a question has a number in it, so the
  // question shows on the page, and "Not sure" on it counts as open.
  // The jewellery boxes count only with gold (or silver) typed above them.
  function boxHasNumber(name, input) {
    var inv = input.investments || {};
    var property = input.property || {};
    var owe = input.owe || {};
    switch (name) {
      case 'jewellery':
        return (amount((input.wornGold || {}).grams) > 0 && hasGrams(input.gold)) ||
               (amount((input.wornSilver || {}).grams) > 0 && hasGrams(input.silver));
      case 'loans':
        return amount((owe.committee || {}).left) > 0 ||
               (owe.loans || []).some(function (loan) { return amount(loan && loan.left) > 0; });
      case 'shares':
        return (amount(inv.shares) > 0 && inv.sharesToSellSoon !== true) || amount(inv.rsus) > 0;
      case 'pf':
        return amount(inv.pfCompulsory) > 0 || amount(inv.npsCompulsory) > 0;
      case 'lic':
        return amount(inv.licPremiums) > 0;
      case 'goldLoan':
        return amount((input.goldWithLender || {}).grams) > 0;
      case 'plot':
        return amount(property.plot) > 0;
      case 'flat':
        return amount(property.flatPaid) > 0;
      default:
        return false;
    }
  }

  // The questions whose boxes have a number (choices 2 to 9), for the
  // page to show. Choice 1 shows when the answer used a nisab in rupees.
  function questionsToShow(input) {
    return Object.keys(CHOICES).filter(function (name) {
      return name !== 'nisab' && boxHasNumber(name, input || {});
    });
  }

  function copyOf(object) {
    var copy = {};
    Object.keys(object).forEach(function (key) { copy[key] = object[key]; });
    return copy;
  }

  function workOut(input) {
    checkRates(input && input.rates);
    var choices = withStartingAnswers(input.choices);
    var open = Object.keys(NOT_SURE_ANSWERS).filter(function (name) {
      return choices[name] === 'notSure' && boxHasNumber(name, input);
    });

    // Every way of answering the open questions. A "Not sure" whose box
    // is empty changes nothing, so it takes the first answer.
    var ways = [choices];
    Object.keys(NOT_SURE_ANSWERS).forEach(function (name) {
      if (choices[name] !== 'notSure') return;
      var answers = open.indexOf(name) >= 0 ? NOT_SURE_ANSWERS[name] : [NOT_SURE_ANSWERS[name][0]];
      var next = [];
      ways.forEach(function (way) {
        answers.forEach(function (answer) {
          var copy = copyOf(way);
          copy[name] = answer;
          next.push(copy);
        });
      });
      ways = next;
    });

    var low = null, high = null;
    ways.forEach(function (way) {
      var answer = oneAnswer(input, way);
      if (!low || answer.zakat < low.zakat) low = answer;
      if (!high || answer.zakat > high.zakat) high = answer;
    });
    var isRange = low.zakat !== high.zakat;
    return {
      zakat: isRange ? null : low.zakat,
      isRange: isRange,
      low: low,
      high: high,
      open: open
    };
  }


  /* 10. WHAT OTHER FILES MAY USE ========================================= */

  return {
    ZAKAT_SHARE: ZAKAT_SHARE,
    GOLD_NISAB_GRAMS: GOLD_NISAB_GRAMS,
    SILVER_NISAB_GRAMS: SILVER_NISAB_GRAMS,
    CHOICES: CHOICES,
    withStartingAnswers: withStartingAnswers,
    goldRate: goldRate,
    purityShare: purityShare,
    principalNext12Months: principalNext12Months,
    questionsToShow: questionsToShow,
    oneAnswer: oneAnswer,
    workOut: workOut
  };

})(typeof module !== 'undefined' && module.exports ? require('./nisab.js') : window.Nisab);

// Lets the tests (in Node) load this same file. In a browser this line
// does nothing.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Zakat;
}
