/* ==========================================================================
   PUREVESTING — THE NISAB MATHS
   Save at:  /assets/calc/nisab.js
   Shows on: /zakat/nisab-today/ (the figures, and the box for your own
   jeweller's rate). The zakat calculator (step 1.2) will use it too.

   Nisab = the minimum wealth for zakat. It is the value of 612.36 grams of
   silver, or of 87.48 grams of gold. 1 tola = 11.664 grams, so these are
   52.5 tola of silver and 7.5 tola of gold.

   Small "pure" functions: each one only works out an answer from what it
   is given. None of them reads the page, the internet or the phone's
   storage, so the tests in tests/nisab.test.js can check every one.
   Run the tests with:  node --test tests/

   The update script scripts/update_prices.py (GitHub runs it by itself
   after every working day) works out the same figures
   in Python, so a page shows them even without JavaScript. A test checks
   that the two always agree.

   A page uses these as Nisab.silverNisab(152.528) and so on; the tests
   load the same file with require().
   ========================================================================== */

var Nisab = (function () {

  /* 1. THE FIXED NUMBERS =================================================
     Grams in the nisab, and in a tola (sources: the Sources part of
     /zakat/nisab-today/). */

  var SILVER_NISAB_GRAMS = 612.36;   // 52.5 tola of silver
  var GOLD_NISAB_GRAMS = 87.48;      // 7.5 tola of gold
  var GRAMS_PER_TOLA = 11.664;

  // The kinds of gold the calculator counts. 9K or less is not counted as
  // gold.
  var KARATS = [24, 22, 18, 14];

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];


  /* 2. CHECKING WHAT COMES IN ============================================
     A rate or a weight must be a real number. A wrong one stops with a
     plain message, instead of quietly giving a wrong nisab. */

  // A rate for 1 gram: a number above zero.
  function checkRate(rate, name) {
    if (typeof rate !== 'number' || !isFinite(rate) || rate <= 0) {
      throw new Error(name + ' must be a number above zero, for 1 gram. Got: ' + rate);
    }
  }

  // A weight or a count of tola: a number of zero or more.
  function checkAmount(amount, name) {
    if (typeof amount !== 'number' || !isFinite(amount) || amount < 0) {
      throw new Error(name + ' must be a number of zero or more. Got: ' + amount);
    }
  }


  /* 3. ROUNDING ==========================================================
     To the nearest rupee; half a rupee goes up (₹30,938.50 → ₹30,939).
     Computers make tiny errors with decimals (a sum can come out as
     111365.62668000001), so the amount is first trimmed to 6 decimals,
     then rounded. */

  function roundToRupee(amount) {
    return Math.round(Number(amount.toFixed(6)));
  }


  /* 4. THE NISAB IN RUPEES ===============================================
     Today's rate for 1 gram × the grams in the nisab, rounded to the
     rupee. Silver: the 999 rate. Gold: the 24K (999) rate. */

  // The nisab by silver: 612.36 g × the silver rate.
  // silverNisab(181.863) → 111366, which shows as ₹1,11,366.
  function silverNisab(silverRatePerGram) {
    checkRate(silverRatePerGram, 'The silver rate');
    return roundToRupee(SILVER_NISAB_GRAMS * silverRatePerGram);
  }

  // The nisab by gold: 87.48 g × the 24K gold rate.
  // goldNisab(14102) → 1233643, which shows as ₹12,33,643.
  function goldNisab(gold24kRatePerGram) {
    checkRate(gold24kRatePerGram, 'The gold rate');
    return roundToRupee(GOLD_NISAB_GRAMS * gold24kRatePerGram);
  }


  /* 5. TOLA TO GRAMS =====================================================
     1 tola = 11.664 g, so 7.5 tola = 87.48 g. The answer is kept to the
     milligram (three decimals). Some jewellers call 10 g a tola, so the
     calculator will ask for grams first. */

  function tolaToGrams(tola) {
    checkAmount(tola, 'Tola');
    return Number((tola * GRAMS_PER_TOLA).toFixed(3));
  }


  /* 6. GOLD OF 24K, 22K, 18K OR 14K ======================================
     Worked out from the 24K rate: 22K is 22/24 of it; 18K is 18/24; 14K
     is 14/24. When prices.json has IBJA's own rates for these
     (goldRateFromPrices, below), those are used instead. None of these
     is rounded: the calculator adds things up first and rounds only its
     final answer. */

  // The rate for 1 gram of gold of this karat.
  // goldRateForKarat(14000, 22) → 12833.33…
  function goldRateForKarat(gold24kRatePerGram, karat) {
    checkRate(gold24kRatePerGram, 'The gold rate');
    if (KARATS.indexOf(karat) === -1) {
      throw new Error('Karat must be 24, 22, 18 or 14. Got: ' + karat);
    }
    return gold24kRatePerGram * karat / 24;
  }

  // What this many grams of gold of this karat are worth, in rupees.
  // goldValue(50, 22, 14000) → 641666.66…
  function goldValue(grams, karat, gold24kRatePerGram) {
    checkAmount(grams, 'The grams of gold');
    return grams * goldRateForKarat(gold24kRatePerGram, karat);
  }

  // The rate for 1 gram of gold of this karat, from prices.json. IBJA
  // publishes its own rates for 22K (916), 18K (750) and 14K (585), and
  // the automatic update keeps them in prices.json: they are used when
  // they are there. Without them (rates typed by hand, or the test
  // prices), it is 22, 18 or 14 parts of 24, as above.
  // goldRateFromPrices({ gold_24k_per_gram: 12389.3, gold_22k_per_gram: 11348.6 }, 22) → 11348.6
  var PRICES_FIELD_FOR_KARAT = {
    22: 'gold_22k_per_gram',
    18: 'gold_18k_per_gram',
    14: 'gold_14k_per_gram'
  };

  function goldRateFromPrices(prices, karat) {
    var worked = goldRateForKarat(prices.gold_24k_per_gram, karat);   // also checks the karat
    var own = karat === 24 ? prices.gold_24k_per_gram : prices[PRICES_FIELD_FOR_KARAT[karat]];
    return typeof own === 'number' && isFinite(own) && own > 0 ? own : worked;
  }


  /* 7. SHOWING FIGURES ===================================================
     The way the site writes them, the same as the update script does. */

  // A whole number with Indian commas: 1233643 → "12,33,643".
  function withIndianCommas(wholeNumber) {
    var digits = String(wholeNumber);
    var lastThree = digits.slice(-3);
    var rest = digits.slice(0, -3);
    var groups = [];
    while (rest.length > 2) {
      groups.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) groups.unshift(rest);
    groups.push(lastThree);
    return groups.join(',');
  }

  // Rupees, rounded to the rupee: 1233642.96 → "₹12,33,643".
  function formatRupees(amount) {
    return '₹' + withIndianCommas(roundToRupee(amount));
  }

  // A rate for 1 gram, with the decimals it has (three at most):
  // 14102 → "₹14,102" · 12389.3 → "₹12,389.30" · 152.528 → "₹152.528".
  function formatRate(ratePerGram) {
    var parts = ratePerGram.toFixed(3).split('.');
    var decimals = parts[1];
    if (decimals === '000') {
      decimals = '';
    } else if (decimals.charAt(2) === '0') {
      decimals = decimals.slice(0, 2);         // 12389.300 → .30
    }
    return '₹' + withIndianCommas(parts[0]) + (decimals ? '.' + decimals : '');
  }

  // A date the way the site writes it: "2026-11-20" → "20 November 2026".
  function formatDate(isoDate) {
    var bits = String(isoDate).split('-');
    var month = MONTHS[Number(bits[1]) - 1];
    if (bits.length !== 3 || !month) {
      throw new Error('A date must look like 2026-11-20. Got: ' + isoDate);
    }
    return Number(bits[2]) + ' ' + month + ' ' + bits[0];
  }


  /* 8. WHAT OTHER FILES MAY USE ========================================== */

  return {
    SILVER_NISAB_GRAMS: SILVER_NISAB_GRAMS,
    GOLD_NISAB_GRAMS: GOLD_NISAB_GRAMS,
    GRAMS_PER_TOLA: GRAMS_PER_TOLA,
    KARATS: KARATS,
    roundToRupee: roundToRupee,
    silverNisab: silverNisab,
    goldNisab: goldNisab,
    tolaToGrams: tolaToGrams,
    goldRateForKarat: goldRateForKarat,
    goldValue: goldValue,
    goldRateFromPrices: goldRateFromPrices,
    withIndianCommas: withIndianCommas,
    formatRupees: formatRupees,
    formatRate: formatRate,
    formatDate: formatDate
  };

})();

// Lets the tests (in Node) load this same file. In a browser this line
// does nothing.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Nisab;
}
