require("dotenv").config();
const { db, pgp } = require("../database/db");
const utils = require("../database/utils");

QUnit.done(() => {
  // Reset everything back and close database connection
  console.log('calling done');
  utils.rebuildData().then(() => pgp.end());
});
