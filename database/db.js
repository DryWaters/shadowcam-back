/**
 * @fileoverview Contains all database logic including the
 * parameters to connect to either local or external database
 * and column definitions for the Pokemon tables.
 */

const pgp = require('pg-promise')();
let db;

/**
 * Changes database connection based on either using local
 * environment or using Heroku External PostGres DB
 * Heroku CLI autocreates the DATABASE_URL environment
 * variable when it runs.
 */
if (process.env.LOCAL && process.env.LOCAL === 'TRUE') {
  connectionDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
  db = pgp(connectionDetails);
} else {
  db = pgp(process.env.DATABASE_URL + '?ssl=true');
}

module.exports = db;