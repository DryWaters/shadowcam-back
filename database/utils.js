const database = require('./db');
const sql = require('./sql');

const rebuildData = () => {
  return clearDatabase()
    .then(() => createTables())
    .catch(err => console.log('Error creating DB with err ' + err))
}

const clearDatabase = () => {
  return database.db.none(sql.users.dropTable)
}

const createTables = () => {
  return database.db.none(sql.users.createTable)
}

module.exports = {
  rebuildData
}