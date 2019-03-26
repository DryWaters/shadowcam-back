/**
 * @fileoverview SQL QueryFile helper that loads all
 * external SQL files and exports them as objects
 */

const QueryFile = require("pg-promise").QueryFile;
const path = require("path");

/**
 * Helper function to create a QueryFile object from a given
 * path and SQL file location.
 * More examples of QueryFiles are at:
 * https://github.com/vitaly-t/pg-promise-demo/blob/master/JavaScript/db/sql/index.js
 * @param {String} file The filename that contains the sql
 * @return {Object} QueryFile that PGPromise uses to run queries
 */
const sql = file => {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true, noWarnings: true });
};

module.exports = {
  users: {
    dropTable: sql("users/dropTable.sql"),
    createTable: sql("users/createTable.sql"),
    create: sql("users/createUser.sql"),
    findUserByEmail: sql("users/findUserByEmail.sql"),
    getUserProfile: sql("users/getUserProfile.sql"),
    updateUserByEmail: sql("users/updateUserByEmail.sql"),
    addUser: sql("users/addUser.sql")
  },
  videos: {
    dropTable: sql("videos/dropTable.sql"),
    createTable: sql("videos/createTable.sql")
  },
  workouts: {
    dropTable: sql("workouts/dropTable.sql"),
    createTable: sql("workouts/createTable.sql")
  },
  stats: {
    dropTable: sql("stats/dropTable.sql"),
    createTable: sql("stats/createTable.sql")
  }
};
