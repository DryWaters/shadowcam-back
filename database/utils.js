const { db } = require("./db");
const sql = require("./sql");

const rebuildData = () => {
  return clearDatabase()
    .then(() => createTables())
    .catch(err => console.log("Error creating DB with err " + err));
};

const clearDatabase = () => {
  return db
    .none(sql.stats.dropTable)
    .then(() => db.none(sql.videos.dropTable))
    .then(() => db.none(sql.workouts.dropTable))
    .then(() => db.none(sql.users.dropTable));
};

const createTables = () => {
  return db
    .none(sql.users.createTable)
    .then(() => db.none(sql.workouts.createTable))
    .then(() => db.none(sql.videos.createTable))
    .then(() => db.none(sql.stats.createTable));
};

module.exports = {
  rebuildData,
  clearDatabase,
  createTables
};
