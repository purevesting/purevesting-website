/* ==========================================================================
   RUNS EVERY TEST IN THIS FOLDER — for the command in CLAUDE.md:
       node --test tests/
   Newer Node (version 22 and up) reads "tests/" as one file to run, and
   that file is this one: it loads every *.test.js file next to it. Older
   Node finds the *.test.js files by itself and never runs this one. Either
   way, each test runs once.
   A new test file needs nothing here: name it something.test.js.
   Not published on the site (tests/ is in .assetsignore).
   ========================================================================== */

const fs = require('node:fs');
const path = require('node:path');

fs.readdirSync(__dirname)
  .filter((name) => name.endsWith('.test.js'))
  .sort()
  .forEach((name) => require(path.join(__dirname, name)));
