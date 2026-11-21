/* ==========================================================================
   PUREVESTING — THE ZAKAT CALCULATOR'S SCREEN CODE
   Save at:  /assets/tools/zakat-page.js
   Shows on: /zakat-calculator/ only.

   It reads the boxes, hands them to the maths in /assets/calc/zakat.js,
   and draws the answer. It works nothing out itself: every rupee on the
   screen comes from zakat.js (which uses /assets/calc/nisab.js). The page
   loads nisab.js, then zakat.js, then this file.

   Nothing typed leaves the phone. "Save" keeps the numbers in the phone's
   own storage (localStorage), nowhere else; "Clear my numbers" deletes
   them. The page works without internet once visited (see /sw.js).

   THE PARTS, TOP TO BOTTOM
     1.  Finding things on the page
     2.  Reading a box: commas, tola, kg, purity
     3.  The rates: IBJA's (from the page or prices.json), or typed over
     4.  One person's boxes, gathered for the maths
     5.  Boxes and questions that show only when they matter
     6.  Drawing the answer
     7.  Quick and full: "Add more", one group at a time on a phone
     8.  More rows: gold, silver, loans
     9.  Units, and Indian commas when a box loses focus
     10. Save, Clear, Share, What next, Print
     11. The running total at the bottom of the screen
     12. Start: saved numbers, fresh rates, the first answer
   ========================================================================== */

(function () {

  var Nisab = window.Nisab;
  var Zakat = window.Zakat;
  var form = document.getElementById('zakat-form');
  var card = document.getElementById('answer');
  if (!Nisab || !Zakat || !form || !card) return;


  /* 1. FINDING THINGS ON THE PAGE ========================================
     Every box has an id in the HTML; rows that can repeat have
     data-row="gold", "silver" or "loan". */

  var SAVE_KEY = 'purevesting-zakat-v1';            // where Save keeps the numbers
  var PAGE_ADDRESS = 'https://purevesting.com/zakat-calculator/';
  var SHARE_WORDS = 'I worked out my zakat on Purevesting. Have you?';
  var COUNT_UP_TIME = 500;                          // milliseconds: half a second
  var SAVED_NOTE_TIME = 3000;                       // "Saved on this phone", 3 seconds

  var lessMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var section = form.closest('section');
  var groups = form.querySelectorAll('.step-group');
  var note = document.getElementById('tool-note');
  var running = document.getElementById('running-total');

  function byId(id) {
    return document.getElementById(id);
  }

  // The rows of one kind: 'gold', 'silver' or 'loan'.
  function rowsOf(kind) {
    return Array.prototype.slice.call(form.querySelectorAll('[data-row="' + kind + '"]'));
  }

  // The answer chosen in a group of picks (radio buttons), or null.
  function picked(name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : null;
  }

  // The answer chosen inside one row or box, or null.
  function pickedIn(container) {
    var checked = container ? container.querySelector('input[type="radio"]:checked') : null;
    return checked ? checked.value : null;
  }

  // Shows or hides something by its id.
  function show(id, yes) {
    var element = byId(id);
    if (element && element.hidden === !!yes) element.hidden = !yes;
  }


  /* 2. READING A BOX =====================================================
     A box may hold commas (1,00,000), spaces or a ₹ sign: they are left
     out. An empty box, or anything that isn't a number, counts as 0. */

  function cleaned(input) {
    return String(input ? input.value : '').replace(/[,\s₹]/g, '');
  }

  function isNumberText(text) {
    return /^\d*\.?\d*$/.test(text) && /\d/.test(text);
  }

  // The number in a box, or 0.
  function numberIn(input) {
    var text = cleaned(input);
    return isNumberText(text) ? parseFloat(text) : 0;
  }

  // The number in a box, or null when it is empty (the % box: empty
  // means "no % typed yet").
  function numberOrNull(input) {
    var text = cleaned(input);
    return isNumberText(text) ? parseFloat(text) : null;
  }

  function boxNumber(id) {
    return numberIn(byId(id));
  }

  // The unit chosen for a row: 'g', 'tola' or 'kg'.
  function unitOf(container) {
    var pressed = container ? container.querySelector('.unit-pick [aria-pressed="true"]') : null;
    return pressed ? pressed.getAttribute('data-unit') : 'g';
  }

  // The grams in a gold or silver row, whatever its unit.
  function gramsIn(row) {
    var amount = numberIn(row.querySelector('[data-field="grams"]'));
    var unit = unitOf(row);
    if (unit === 'tola') return Nisab.tolaToGrams(amount);
    if (unit === 'kg') return amount * 1000;
    return amount;
  }

  // The karat chosen in a gold row (24, 22, 18 or 14).
  function karatIn(container) {
    return Number(pickedIn(container)) || 22;
  }

  // The purity of a silver row, in %: 99.9, 92.5, or the % typed.
  function purityIn(container) {
    var choice = pickedIn(container);
    if (choice === 'other') return numberIn(container.querySelector('[data-other] input'));
    return choice ? parseFloat(choice) : 92.5;
  }


  /* 3. THE RATES =========================================================
     IBJA's rates come first from the page itself (the line under the
     rate boxes, rewritten by scripts/update_prices.py after every working
     day), then from /assets/data/prices.json when it is as new or newer:
     it also holds IBJA's own 22K, 18K and 14K rates. A rate the visitor
     types over IBJA's is used instead; its karats are then worked out as
     parts of 24 (nisab.js). */

  var rateBoxes = { gold: byId('rate-gold'), silver: byId('rate-silver') };
  var rateTyped = { gold: false, silver: false };   // true once the visitor types their own

  function figureNumber(selector) {
    var figure = document.querySelector(selector);
    return figure ? parseFloat(figure.textContent.replace(/[^0-9.]/g, '')) : NaN;
  }

  function ratesOnPage() {
    var date = document.querySelector('[data-nisab="as-of"]');
    return {
      asOf: date ? date.getAttribute('datetime') : '',
      gold24k: figureNumber('[data-nisab="gold-rate"]'),
      silver: figureNumber('[data-nisab="silver-rate"]')
    };
  }

  // The rates in prices.json, or null if anything in it looks wrong.
  function ratesFromFile(prices) {
    if (!prices) return null;
    var rates = {
      asOf: String(prices.as_of || ''),
      gold24k: Number(prices.gold_24k_per_gram),
      silver: Number(prices.silver_999_per_gram),
      gold22k: Number(prices.gold_22k_per_gram) || undefined,
      gold18k: Number(prices.gold_18k_per_gram) || undefined,
      gold14k: Number(prices.gold_14k_per_gram) || undefined
    };
    var dateLooksRight = /^\d{4}-\d{2}-\d{2}$/.test(rates.asOf);
    return dateLooksRight && rates.gold24k > 0 && rates.silver > 0 ? rates : null;
  }

  var ibja = ratesOnPage();

  // A rate as a box shows it: 12389.3 → "12,389.30".
  function rateWords(rate) {
    return Nisab.formatRate(rate).replace('₹', '');
  }

  // Puts IBJA's rates in the two boxes, unless the visitor typed their own.
  function fillRateBoxes() {
    ['gold', 'silver'].forEach(function (kind) {
      var rate = kind === 'gold' ? ibja.gold24k : ibja.silver;
      if (!rateTyped[kind] && rateBoxes[kind] && rate > 0 && document.activeElement !== rateBoxes[kind]) {
        rateBoxes[kind].value = rateWords(rate);
      }
    });
  }

  // True when a box holds the visitor's own rate (not IBJA's, not empty).
  function ownRate(kind) {
    var typed = numberIn(rateBoxes[kind]);
    var theirs = kind === 'gold' ? ibja.gold24k : ibja.silver;
    return typed > 0 && Math.abs(typed - theirs) > 0.0005;
  }

  // The rates the maths uses.
  function ratesInUse() {
    var rates = {
      gold24k: ownRate('gold') ? numberIn(rateBoxes.gold) : ibja.gold24k,
      silver: ownRate('silver') ? numberIn(rateBoxes.silver) : ibja.silver
    };
    if (!ownRate('gold')) {
      rates.gold22k = ibja.gold22k;
      rates.gold18k = ibja.gold18k;
      rates.gold14k = ibja.gold14k;
    }
    return rates;
  }

  // Shows fresh rates in the line under the rate boxes and in the note
  // for readers without JavaScript (as the nisab page does). site.js may
  // have turned a figure into a button: the words go inside it.
  function showRatesOnPage() {
    var words = {
      'gold-rate': Nisab.formatRate(ibja.gold24k),
      'silver-rate': Nisab.formatRate(ibja.silver),
      'silver-nisab': Nisab.formatRupees(Nisab.silverNisab(ibja.silver)),
      'as-of': Nisab.formatDate(ibja.asOf)
    };
    Object.keys(words).forEach(function (kind) {
      document.querySelectorAll('[data-nisab="' + kind + '"]').forEach(function (figure) {
        setWords(figure, words[kind]);
        if (kind === 'as-of') figure.setAttribute('datetime', ibja.asOf);
      });
    });
  }

  function setWords(figure, words) {
    var button = figure.querySelector('button.figure-button');
    (button || figure).textContent = words;
  }


  /* 4. ONE PERSON'S BOXES, GATHERED FOR THE MATHS ========================
     The same shape zakat.js describes at its top. */

  // The karat of the worn jewellery: the karat of the gold rows when they
  // all share one; otherwise the one the visitor picked.
  function wornGoldKarat(goldRows) {
    var karats = goldRows.filter(function (row) { return row.grams > 0; })
                         .map(function (row) { return row.karat; });
    var same = karats.every(function (karat) { return karat === karats[0]; });
    return karats.length && same ? karats[0] : karatIn(byId('worn-gold-karats'));
  }

  // The purity of the worn silver jewellery, the same way.
  function wornSilverPurity(silverRows) {
    var purities = silverRows.filter(function (row) { return row.grams > 0; })
                             .map(function (row) { return row.purity; });
    var same = purities.every(function (purity) { return purity === purities[0]; });
    return purities.length && same ? purities[0] : purityIn(byId('worn-silver-field'));
  }

  function karatsDiffer(rows) {
    var karats = rows.filter(function (row) { return row.grams > 0; }).map(function (row) { return row.karat; });
    return karats.some(function (karat) { return karat !== karats[0]; });
  }

  function puritiesDiffer(rows) {
    var purities = rows.filter(function (row) { return row.grams > 0; }).map(function (row) { return row.purity; });
    return purities.some(function (purity) { return purity !== purities[0]; });
  }

  function metalBox(kind) {
    var row = form.querySelector('[data-row="' + kind + '"]');
    return { grams: gramsIn(row), karat: karatIn(row) };
  }

  function sellSoon() {
    var answer = picked('sell-soon');
    return answer === 'yes' ? true : answer === 'no' ? false : null;
  }

  function readPerson() {
    var gold = rowsOf('gold').map(function (row) { return { grams: gramsIn(row), karat: karatIn(row) }; });
    var silver = rowsOf('silver').map(function (row) { return { grams: gramsIn(row), purity: purityIn(row) }; });
    var loans = rowsOf('loan').map(function (row) {
      return {
        left: numberIn(row.querySelector('[data-field="left"]')),
        ratePercent: numberIn(row.querySelector('[data-field="rate"]')),
        emi: numberIn(row.querySelector('[data-field="emi"]'))
      };
    });
    return {
      rates: ratesInUse(),
      money: {
        cashAndBank: boxNumber('cash-bank'),
        wallets: boxNumber('wallets'),
        otherCurrencies: boxNumber('other-currencies'),
        tradingCash: boxNumber('trading-cash'),
        lent: boxNumber('money-lent'),
        committeePaidIn: boxNumber('committee-paid')
      },
      gold: gold,
      wornGold: { grams: boxNumber('worn-gold'), karat: wornGoldKarat(gold) },
      goldLent: metalBox('gold-lent'),
      goldWithLender: metalBox('gold-pledged'),
      digitalGoldGrams: boxNumber('gold-digital'),
      silver: silver,
      wornSilver: { grams: boxNumber('worn-silver'), purity: wornSilverPurity(silver) },
      investments: {
        shares: boxNumber('shares'),
        sharesToSellSoon: sellSoon(),
        rsus: boxNumber('rsus'),
        crypto: boxNumber('crypto'),
        goldFunds: boxNumber('gold-funds'),
        sgbGrams: boxNumber('sgb'),
        deposits: boxNumber('deposits'),
        pfCompulsory: boxNumber('pf-compulsory'),
        vpf: boxNumber('vpf'),
        npsOwn: boxNumber('nps-own'),
        npsCompulsory: boxNumber('nps-compulsory'),
        licPremiums: boxNumber('lic')
      },
      property: { plot: boxNumber('plot'), flatPaid: boxNumber('flat') },
      business: {
        runsBusiness: byId('runs-business').checked,
        stock: boxNumber('stock'),
        cash: boxNumber('business-cash'),
        customersOwe: boxNumber('customers-owe'),
        propertyToSell: boxNumber('business-property')
      },
      owe: {
        payNow: boxNumber('pay-now'),
        cardBill: boxNumber('card-bill'),
        suppliers: boxNumber('suppliers'),
        familyLoans: boxNumber('family-loans'),
        mehrDueNow: boxNumber('mehr-due'),
        depositsToReturn: boxNumber('deposits-back'),
        builderNext12: boxNumber('builder-12'),
        committee: { left: boxNumber('committee-left'), monthly: boxNumber('committee-monthly') },
        loans: loans
      },
      choices: {
        nisab: picked('choice-nisab'),
        jewellery: picked('choice-jewellery'),
        loans: picked('choice-loans'),
        shares: picked('choice-shares'),
        sharesPercent: numberOrNull(byId('shares-percent')),
        pf: picked('choice-pf'),
        lic: picked('choice-lic'),
        goldLoan: picked('choice-gold-loan'),
        plot: picked('choice-plot'),
        flat: picked('choice-flat')
      }
    };
  }


  /* 5. BOXES AND QUESTIONS THAT SHOW ONLY WHEN THEY MATTER ===============
     A question where scholars differ shows only once its box has a number
     (zakat.js says which). The jewellery boxes show once there is gold or
     silver; the business boxes with the tick. */

  function showWhatMatters(person, answer) {
    var hasGold = person.gold.some(function (row) { return row.grams > 0; });
    var hasSilver = person.silver.some(function (row) { return row.grams > 0; });
    show('worn-gold-field', hasGold);
    show('worn-gold-karats', hasGold && karatsDiffer(person.gold));
    show('worn-silver-field', hasSilver);
    show('worn-silver-purities', hasSilver && puritiesDiffer(person.silver));

    // Each "Another %" box shows when its row picks "Another %".
    form.querySelectorAll('[data-other]').forEach(function (box) {
      var container = box.closest('.metal-row') || box.closest('.step-field');
      var wanted = pickedIn(container) === 'other';
      if (box.hidden === wanted) box.hidden = !wanted;
    });

    var runsBusiness = person.business.runsBusiness;
    show('business-boxes', runsBusiness);
    show('suppliers-field', runsBusiness);
    show('shares-percent-field', picked('choice-shares') === 'part');

    // Questions 2 to 9, and "Did you buy these to sell soon?".
    var questions = Zakat.questionsToShow(person);
    form.querySelectorAll('.choice-block[data-choice]').forEach(function (block) {
      var name = block.getAttribute('data-choice');
      var wanted = name === 'sellSoon' ? person.investments.shares > 0 : questions.indexOf(name) >= 0;
      if (block.hidden === wanted) block.hidden = !wanted;
    });

    // Question 1 shows when the answer compares a value with the nisab in
    // rupees (not when only gold or only silver is counted).
    var usesRupees = answer.high.nisab.rupees !== null || answer.low.nisab.rupees !== null;
    var nisabQuestion = card.querySelector('[data-choice="nisab"]');
    var counted = answer.high.counted > 0;
    if (nisabQuestion) nisabQuestion.hidden = !(usesRupees && counted);

    placeJewelleryQuestion(person, hasGold, hasSilver);
  }

  // The jewellery question sits under the gold jewellery box, or under
  // the silver one when only silver jewellery (with silver above it) has
  // a number.
  function placeJewelleryQuestion(person, hasGold, hasSilver) {
    var question = byId('choice-jewellery');
    var goldJewellery = person.wornGold.grams > 0 && hasGold;
    var silverJewellery = person.wornSilver.grams > 0 && hasSilver;
    var after = !goldJewellery && silverJewellery ? byId('worn-silver-field') : byId('worn-gold-field');
    if (question && after && after.nextElementSibling !== question) {
      after.parentNode.insertBefore(question, after.nextElementSibling);
    }
  }

  // Short warnings under a box: more worn jewellery than gold, an EMI
  // that doesn't cover the interest, a rate for 10 grams or 1 kg.
  function showHints(person) {
    var goldGrams = person.gold.reduce(function (sum, row) { return sum + row.grams; }, 0);
    var silverGrams = person.silver.reduce(function (sum, row) { return sum + row.grams; }, 0);
    setHint(form.querySelector('[data-hint="worn-gold"]'),
            person.wornGold.grams > goldGrams ? 'That is more than the gold above.' : '');
    setHint(form.querySelector('[data-hint="worn-silver"]'),
            person.wornSilver.grams > silverGrams ? 'That is more than the silver above.' : '');

    rowsOf('loan').forEach(function (row, index) {
      var loan = person.owe.loans[index];
      var words = '';
      if (loan.left > 0 && !(loan.emi > 0)) {
        words = 'No EMI: all of it counts as due within 12 months.';
      } else if (loan.left > 0 && loan.emi <= loan.left * loan.ratePercent / 1200) {
        words = 'This EMI doesn’t cover the interest. Check the loan statement.';
      }
      setHint(row.querySelector('[data-hint="loan"]'), words);
    });

    var rateWarning = '';
    if (numberIn(rateBoxes.gold) > ibja.gold24k * 5) rateWarning = 'Is your gold rate for 10 grams? Type the rate for 1 gram.';
    if (numberIn(rateBoxes.silver) > ibja.silver * 5) rateWarning = 'Is your silver rate for 1 kg? Type the rate for 1 gram.';
    setHint(form.querySelector('[data-hint="rates"]'), rateWarning);

    // "= 87.48 g" under a gold box filled in tola.
    form.querySelectorAll('.metal-row').forEach(function (row) {
      var line = row.querySelector('[data-equal]');
      if (!line) return;
      var tola = unitOf(row) === 'tola' && numberIn(row.querySelector('[data-field="grams"]')) > 0;
      line.hidden = !tola;
      if (tola) line.textContent = '= ' + gramsIn(row) + ' g';
    });
  }

  function setHint(line, words) {
    if (line && line.textContent !== words) line.textContent = words;
  }


  /* 6. DRAWING THE ANSWER ================================================
     The amount, big (it counts up once, the first time it is more than
     ₹0), or the two numbers of "Not sure"; the parts; the nisab line or
     the gold-only words; how many answers scholars differ on; the running
     total. */

  var PART_NAMES = [
    ['money', 'Money'],
    ['metals', 'Gold and silver'],
    ['investments', 'Investments'],
    ['property', 'Property'],
    ['business', 'Business']
  ];

  var countedUpOnce = false;    // the amount counts up only the first time
  var countFrame = null;

  function rupees(amount) {
    return Nisab.formatRupees(Math.max(0, amount));
  }

  function draw() {
    var person = readPerson();
    var answer;
    try {
      answer = Zakat.workOut(person);
    } catch (problem) {
      // Only a missing rate can stop the maths (an empty rate box falls
      // back to IBJA's): say so, and keep the last answer.
      setText('zakat-status', 'The gold and silver rates are missing. Type them in group 2, "Gold and silver".');
      return;
    }
    showWhatMatters(person, answer);
    showHints(person);
    drawAmount(answer);
    drawParts(answer);
    drawNisab(answer);
    drawDiffer(answer);
    drawRunningTotal(answer);
  }

  function setText(id, words) {
    var element = byId(id);
    if (element && element.textContent !== words) element.textContent = words;
  }

  function drawAmount(answer) {
    var scenario = answer.high;
    var typedSomething = scenario.counted > 0 || scenario.takenOff > 0;
    var amountLine = card.querySelector('.answer-amount');
    show('zakat-range', answer.isRange);
    amountLine.hidden = answer.isRange;

    if (answer.isRange) {
      setText('range-low', rupees(answer.low.zakat));
      setText('range-high', rupees(answer.high.zakat));
      show('zakat-status', false);
      return;
    }

    showAmount(byId('zakat-amount'), answer.zakat);
    show('zakat-status', true);
    var words;
    if (!typedSomething) {
      words = 'Type your numbers above. Your zakat shows here.';
    } else if (answer.zakat > 0 && scenario.weightGuard) {
      words = guardWords(scenario.guardMetals);
    } else if (answer.zakat > 0) {
      words = '2.5% of ' + rupees(scenario.zakatBase) + '.';
    } else {
      words = 'No zakat is due on these numbers.';
    }
    setText('zakat-status', words);
  }

  // With the gold nisab chosen and the total below it: which metal still
  // owes zakat on its own weight.
  function guardWords(metals) {
    if (metals.length > 1) {
      return 'Your total is below the gold minimum, but your gold and your silver each reach their own weight: 2.5% of them.';
    }
    return metals[0] === 'gold'
      ? 'Your total is below the gold minimum, but your gold reaches its own 87.48 g: 2.5% of it.'
      : 'Your total is below the gold minimum, but your silver reaches its own 612.36 g: 2.5% of it.';
  }

  // The big amount. The first time it is more than ₹0 it counts up from 0
  // in half a second (never with less motion asked for); after that it
  // simply changes.
  function showAmount(element, amount) {
    if (countFrame) {
      window.cancelAnimationFrame(countFrame);
      countFrame = null;
    }
    var words = rupees(amount);
    if (!countedUpOnce && amount > 0 && !lessMotion && window.requestAnimationFrame) {
      countedUpOnce = true;
      var started = null;
      var step = function (now) {
        if (started === null) started = now;
        var progress = Math.min(1, (now - started) / COUNT_UP_TIME);
        var eased = 1 - Math.pow(1 - progress, 3);           // quick, then settling
        element.textContent = progress < 1 ? rupees(amount * eased) : words;
        countFrame = progress < 1 ? window.requestAnimationFrame(step) : null;
      };
      countFrame = window.requestAnimationFrame(step);
      return;
    }
    if (amount > 0) countedUpOnce = true;
    if (element.textContent !== words) element.textContent = words;
  }

  // The parts as one bar and as text. With two numbers, the parts of the
  // higher one.
  function drawParts(answer) {
    var scenario = answer.high;
    var block = byId('parts');
    var bar = byId('parts-bar');
    var key = byId('parts-key');
    var anything = scenario.counted > 0 || scenario.takenOff > 0;
    block.hidden = !anything;
    if (!anything) return;

    setText('parts-title', answer.isRange ? 'What is counted, at the highest' : 'What is counted');
    bar.textContent = '';
    key.textContent = '';
    PART_NAMES.forEach(function (part) {
      var value = scenario.parts[part[0]];
      if (!(value > 0)) return;
      var piece = document.createElement('span');
      piece.className = 'part-' + part[0];
      piece.style.width = (value / scenario.counted * 100).toFixed(2) + '%';
      bar.appendChild(piece);
      key.appendChild(keyLine(part[1], rupees(value), 'part-' + part[0]));
    });
    if (scenario.takenOff > 0) {
      var owe = keyLine('What you owe', '−' + rupees(scenario.takenOff), null);
      owe.className = 'parts-owe';
      key.appendChild(owe);
      var left = keyLine('Left after that', rupees(scenario.result), null);
      left.className = 'parts-left';
      key.appendChild(left);
    }
  }

  // One line of the text beside the bar: a colour key, a name, a figure.
  function keyLine(name, figure, colour) {
    var line = document.createElement('li');
    var label = document.createElement('span');
    if (colour) {
      var square = document.createElement('span');
      square.className = 'key ' + colour;
      label.appendChild(square);
    }
    label.appendChild(document.createTextNode(name));
    var value = document.createElement('span');
    value.className = 'num';
    value.textContent = figure;
    line.appendChild(label);
    line.appendChild(value);
    return line;
  }

  // "Nisab today: ₹93,402 (silver), as of 20 November 2026", its figure
  // one tap from its source. When only gold (or only silver) is counted,
  // the words about the weight rule instead.
  var GOLD_ONLY_WORDS = 'You entered only gold. When gold is all you own, zakat starts at 87.48 g of gold. ' +
    'If you have any cash or bank money of your own, even a little, add it: scholars then add everything ' +
    'together and use the lower, silver minimum.';
  var SILVER_ONLY_WORDS = 'You entered only silver. When silver is all you own, zakat starts at 612.36 g of silver.';

  function drawNisab(answer) {
    var kind = answer.high.nisab.kind;
    var weightWords = kind === 'gold-weight' ? GOLD_ONLY_WORDS : kind === 'silver-weight' ? SILVER_ONLY_WORDS : '';
    show('weight-line', !!weightWords);
    show('nisab-line', !weightWords);
    if (weightWords) {
      setText('weight-line', weightWords);
      return;
    }
    var gold = kind === 'gold';
    var own = ownRate(gold ? 'gold' : 'silver');
    var rates = ratesInUse();
    var nisab = gold ? Nisab.goldNisab(rates.gold24k) : Nisab.silverNisab(rates.silver);
    setText('nisab-words', own ? 'Nisab at your rate:' : 'Nisab today:');
    setWords(byId('nisab-figure'), Nisab.formatRupees(nisab));
    setText('nisab-kind', gold ? '(gold)' : '(silver)');
    show('nisab-asof', !own);
    var date = byId('nisab-date');
    if (date && ibja.asOf) {
      date.setAttribute('datetime', ibja.asOf);
      setText('nisab-date', Nisab.formatDate(ibja.asOf));
    }
  }

  function drawDiffer(answer) {
    var open = answer.open.length;
    show('differ-line', open > 0);
    if (open > 0) setText('differ-line', 'Scholars differ on ' + open + ' of your answers.');
  }

  function drawRunningTotal(answer) {
    setText('running-amount', answer.isRange
      ? rupees(answer.low.zakat) + ' to ' + rupees(answer.high.zakat)
      : rupees(answer.zakat));
  }


  /* 7. QUICK AND FULL ====================================================
     The page opens with the quick calculator (three boxes). "Add more"
     opens the full one: a phone shows one group at a time, with Back and
     Next; a computer shows every group (site.css, section 34). */

  var currentGroup = 1;
  var GROUP_COUNT = groups.length;

  function isFull() {
    return form.classList.contains('is-full');
  }

  function openFull(group, scroll) {
    form.classList.remove('is-quick');
    form.classList.add('is-full');
    show('add-more', false);
    show('step-nav', true);
    showGroup(group || 1, scroll);
    draw();
    placeRunningTotal();
  }

  // Shows one group. With "scroll", the page moves to its top and its
  // heading takes the focus (never a box: that would pop up the phone's
  // keyboard), so keyboard and screen-reader users carry on from there.
  function showGroup(number, scroll) {
    currentGroup = Math.min(GROUP_COUNT, Math.max(1, number));
    groups.forEach(function (group) {
      group.classList.toggle('is-current', Number(group.getAttribute('data-group')) === currentGroup);
    });
    var current = form.querySelector('.step-group.is-current .step-name');
    setText('step-place', (current ? current.textContent + ' · ' : '') + currentGroup + ' of ' + GROUP_COUNT);
    byId('step-back').disabled = currentGroup === 1;
    setText('step-next', currentGroup === GROUP_COUNT ? 'See my zakat' : 'Next');
    if (!scroll) return;
    form.scrollIntoView({ block: 'start', behavior: lessMotion ? 'auto' : 'smooth' });
    var heading = form.querySelector('.step-group.is-current .step-legend');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function goToAnswer() {
    card.scrollIntoView({ block: 'start', behavior: lessMotion ? 'auto' : 'smooth' });
    card.focus({ preventScroll: true });
  }

  byId('add-more').addEventListener('click', function () {
    openFull(1, true);
  });
  byId('step-back').addEventListener('click', function () { showGroup(currentGroup - 1, true); });
  byId('step-next').addEventListener('click', function () {
    if (currentGroup < GROUP_COUNT) showGroup(currentGroup + 1, true);
    else goToAnswer();
  });


  /* 8. MORE ROWS =========================================================
     "Add more gold", "Add more silver" and "Add another loan" copy a row
     from its <template> at the bottom of the page and number its boxes
     (gold-2, gold-3…). */

  function addRow(kind, focus) {
    var template = byId(kind + '-row-template');
    var list = byId(kind + '-rows');
    if (!template || !list) return;
    var number = rowsOf(kind).length + 1;
    var html = template.innerHTML.replace(/-N\b/g, '-' + number).replace('Loan N', 'Loan ' + number);
    list.insertAdjacentHTML('beforeend', html);
    if (focus) {
      var rows = rowsOf(kind);
      var box = rows[rows.length - 1].querySelector('.step-input');
      if (box) box.focus();
    }
  }

  byId('add-gold').addEventListener('click', function () { addRow('gold', true); draw(); });
  byId('add-silver').addEventListener('click', function () { addRow('silver', true); draw(); });
  byId('add-loan').addEventListener('click', function () { addRow('loan', true); draw(); });


  /* 9. UNITS, AND INDIAN COMMAS ==========================================
     A tap on "g", "tola" or "kg" picks the unit; the number stays as it
     is. A ₹ box shows Indian commas (1,00,000) once it loses focus. The
     box is never changed while it has focus: changing it then would undo
     a "select all" and add the new digits to the old ones. Commas typed
     or left in a box are fine: part 2 leaves them out when it reads. */

  form.addEventListener('click', function (event) {
    var button = event.target.closest ? event.target.closest('.unit-pick button') : null;
    if (!button) return;
    button.parentNode.querySelectorAll('button').forEach(function (each) {
      each.setAttribute('aria-pressed', each === button ? 'true' : 'false');
    });
    draw();
  });

  // A number as a ₹ box shows it: 200000 → "2,00,000"; 1234.5 → "1,234.5".
  function moneyWords(number) {
    var parts = String(number).split('.');
    return Nisab.withIndianCommas(parts[0]) + (parts[1] ? '.' + parts[1] : '');
  }

  form.addEventListener('focusout', function (event) {
    var input = event.target;
    if (!input.matches || !input.matches('[data-money]')) return;
    var rate = input.getAttribute('data-rate');
    // An emptied rate box goes back to IBJA's rate.
    if (rate && cleaned(input) === '') {
      rateTyped[rate] = false;
      fillRateBoxes();
      draw();
      return;
    }
    var text = cleaned(input);
    if (!isNumberText(text)) return;              // not a number: left as typed
    input.value = rate ? rateWords(parseFloat(text)) : moneyWords(parseFloat(text));
  });

  // Every change redraws the answer.
  form.addEventListener('input', function (event) {
    var rate = event.target.getAttribute && event.target.getAttribute('data-rate');
    if (rate) rateTyped[rate] = true;
    draw();
  });
  form.addEventListener('change', draw);
  card.addEventListener('change', draw);          // question 1 sits in the answer card
  form.addEventListener('submit', function (event) { event.preventDefault(); });


  /* 10. SAVE, CLEAR, SHARE, WHAT NEXT, PRINT ============================= */

  var noteTimer = null;

  // A short line under the three buttons ("Saved on this phone"…).
  function showNote(words, forMilliseconds) {
    window.clearTimeout(noteTimer);
    note.textContent = words;
    if (forMilliseconds) {
      noteTimer = window.setTimeout(function () { note.textContent = ''; }, forMilliseconds);
    }
  }

  // Everything typed and picked, to keep on the phone. IBJA's rates are
  // never kept (they change every day); a rate the visitor typed is.
  function readState() {
    var state = {
      version: 1,
      mode: isFull() ? 'full' : 'quick',
      group: currentGroup,
      rows: { gold: rowsOf('gold').length, silver: rowsOf('silver').length, loan: rowsOf('loan').length },
      boxes: {},
      picks: {},
      ticks: {},
      units: {}
    };
    document.querySelectorAll('#zakat-form input, #answer input').forEach(function (input) {
      if (input.type === 'radio') {
        if (input.checked) state.picks[input.name] = input.value;
      } else if (input.type === 'checkbox') {
        state.ticks[input.id] = input.checked;
      } else if (input.id && input.value.trim() !== '') {
        var rate = input.getAttribute('data-rate');
        if (rate && !ownRate(rate)) return;
        state.boxes[input.id] = input.value;
      }
    });
    form.querySelectorAll('.unit-pick').forEach(function (pick) {
      state.units[pick.id] = unitOf(pick.parentNode);
    });
    return state;
  }

  function save() {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(readState()));
    } catch (problem) {
      showNote('This phone did not let the page save. Your numbers are still on the screen.', 0);
      return;
    }
    showNote('Saved on this phone', SAVED_NOTE_TIME);
    show('clear-line', true);
  }

  // Puts saved numbers back. Gives back true if there were any.
  function restore() {
    var state = null;
    try {
      state = JSON.parse(window.localStorage.getItem(SAVE_KEY) || 'null');
    } catch (problem) {
      return false;
    }
    if (!state || state.version !== 1) return false;
    countedUpOnce = true;      // numbers already on screen never count up

    ['gold', 'silver', 'loan'].forEach(function (kind) {
      var wanted = Math.min(20, Number(state.rows && state.rows[kind]) || 1);
      while (rowsOf(kind).length < wanted) addRow(kind, false);
    });
    Object.keys(state.boxes || {}).forEach(function (id) {
      var input = byId(id);
      if (!input || input.tagName !== 'INPUT') return;
      input.value = String(state.boxes[id]).slice(0, 40);
      var rate = input.getAttribute('data-rate');
      if (rate) rateTyped[rate] = true;
    });
    document.querySelectorAll('#zakat-form input[type="radio"], #answer input[type="radio"]').forEach(function (input) {
      if (state.picks && state.picks[input.name] === input.value) input.checked = true;
    });
    Object.keys(state.ticks || {}).forEach(function (id) {
      var input = byId(id);
      if (input && input.type === 'checkbox') input.checked = !!state.ticks[id];
    });
    Object.keys(state.units || {}).forEach(function (id) {
      var pick = byId(id);
      if (!pick) return;
      pick.querySelectorAll('button').forEach(function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-unit') === state.units[id] ? 'true' : 'false');
      });
    });
    if (state.mode === 'full') openFull(Number(state.group) || 1, false);
    show('clear-line', true);
    return true;
  }

  // Deletes the saved numbers and empties every box.
  function clearNumbers() {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch (problem) { /* nothing was saved */ }
    ['gold', 'silver', 'loan'].forEach(function (kind) {
      rowsOf(kind).slice(1).forEach(function (row) { row.remove(); });
    });
    form.reset();
    card.querySelectorAll('input[name="choice-nisab"]').forEach(function (input) {
      input.checked = input.defaultChecked;
    });
    form.querySelectorAll('.unit-pick').forEach(function (pick) {
      pick.querySelectorAll('button').forEach(function (button, index) {
        button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      });
    });
    rateTyped = { gold: false, silver: false };
    fillRateBoxes();
    show('clear-line', false);
    showNote('Your numbers are cleared from this phone.', SAVED_NOTE_TIME);
    draw();
  }

  // The phone's share sheet, with the link and one line, never the
  // amount. A computer with no share sheet copies them instead.
  function share() {
    var words = SHARE_WORDS + ' ' + PAGE_ADDRESS;
    if (navigator.share) {
      navigator.share({ title: 'Zakat calculator', text: SHARE_WORDS, url: PAGE_ADDRESS })
        .catch(function () { /* closing the share sheet is fine */ });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(words).then(
        function () { showNote('Link copied. Paste it in a message.', SAVED_NOTE_TIME); },
        function () { showNote(words, 0); });
      return;
    }
    showNote(words, 0);
  }

  function toggleWhatNext() {
    var button = byId('next-button');
    var open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    show('what-next', open);
  }

  // Today's date on the printout ("Zakat worked out on 21 November 2026").
  function setPrintedDate() {
    var today = new Date();
    var iso = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    setText('printed-date', Nisab.formatDate(iso));
  }

  byId('save-button').addEventListener('click', save);
  byId('share-button').addEventListener('click', share);
  byId('next-button').addEventListener('click', toggleWhatNext);
  byId('clear-button').addEventListener('click', clearNumbers);
  byId('print-button').addEventListener('click', function () {
    setPrintedDate();
    window.print();
  });
  window.addEventListener('beforeprint', setPrintedDate);


  /* 11. THE RUNNING TOTAL ================================================
     "Your zakat so far: ₹…" stays at the bottom of the screen while the
     full calculator is being filled and the answer card is out of view.
     A tap jumps to the answer. */

  var formInView = true;
  var answerInView = true;

  function placeRunningTotal() {
    var wanted = isFull() && formInView && !answerInView;
    if (running.hidden === wanted) running.hidden = !wanted;
    if (section) section.classList.toggle('has-running-total', wanted);
  }

  if ('IntersectionObserver' in window) {
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === form) formInView = entry.isIntersecting;
        if (entry.target === card) answerInView = entry.isIntersecting;
      });
      placeRunningTotal();
    });
    watcher.observe(form);
    watcher.observe(card);
  }

  running.addEventListener('click', function (event) {
    event.preventDefault();
    goToAnswer();
  });


  /* 12. START ============================================================
     Saved numbers first (a number already on screen never counts up),
     then the first answer, then fresh rates from prices.json. */

  fillRateBoxes();
  restore();
  draw();

  if (!window.fetch) return;
  fetch('/assets/data/prices.json', { cache: 'no-cache' })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (prices) {
      var fresh = ratesFromFile(prices);
      if (!fresh || fresh.asOf < ibja.asOf) return;   // the page's own rates are newer
      ibja = fresh;
      showRatesOnPage();
      fillRateBoxes();
      draw();
    })
    .catch(function () { /* offline with no saved copy: the page's own rates stay */ });

})();
