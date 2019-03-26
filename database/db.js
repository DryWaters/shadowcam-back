/**
 * @fileoverview Contains all database logic including the
 * parameters to connect to either local or external database
 * and column definitions for the Pokemon tables.
 */

const pgp = require("pg-promise")();
let db;

if (process.env.LOCAL && process.env.LOCAL === "TRUE") {
  connectionDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  };
  db = pgp(connectionDetails);
  console.log("making local DB");
} else {
  console.log("making connection to remote db");
  db = pgp(process.env.DATABASE_URL + "?ssl=true");
}

module.exports = {
  db,
  pgp
};
