require("dotenv").config();
const { pgp } = require("../database/db");
const utils = require("../database/utils");

QUnit.begin(() => {

})


QUnit.done(() => {
  console.log(process.env);
  // Reset everything back and close database connection
  utils.rebuildData().then(() => pgp.end());
});
