const utils = require("../../database/utils");
const { db } = require("../../database/db");

QUnit.module("Database Util Testing", {
  before: assert => {
    const done = assert.async();
    utils
      .rebuildData()
      .then(() => {
        done();
      })
      .catch(error => {
        console.err("error");
        done();
      });
  },
  after: assert => {
    const done = assert.async();
    utils
      .rebuildData()
      .then(() => {
        done();
      })
      .catch(error => {
        console.err("error");
        done();
      });
  }
});

QUnit.test("Checks that Database Utils Exists", assert => {
  assert.ok(utils !== null);
});

QUnit.test("Checks that clears tables", assert => {
  const checkTableAmount = assert.async();
  const checkClearedAllTables = assert.async();
  db.any(
    "SELECT COUNT(table_name) FROM information_schema.tables " +
      "WHERE table_schema='public'"
  )
    .then(result => {
      assert.equal(result[0].count, 4, `Current number of tables is 4`);
      checkTableAmount();
      return utils.clearDatabase();
    })
    .then(result => {
      return db.any(
        "SELECT COUNT(table_name) FROM " +
          "information_schema.tables WHERE table_schema='public'"
      );
    })
    .then(result => {
      checkClearedAllTables();
      assert.equal(result[0].count, "0", "Tables is 0");
    })
    .catch(error => {
      checkTableAmount();
      checkClearedAllTables();
      console.log(error);
      assert.ok(false, "Unable to clear tables");
    });

  assert.ok(1 == 1);
});

QUnit.test("Checks that tables are created", assert => {
  const asyncCreateTables = assert.async();
  utils
    .clearDatabase()
    .then(() => {
      return utils.createTables();
    })
    .then(() => {
      return db.any(
        "SELECT COUNT(table_name) " +
          "FROM information_schema.tables " +
          "WHERE table_schema='public'"
      );
    })
    .then(result => {
      asyncCreateTables();
      assert.equal(result[0].count, 4, "Created tables");
    })
    .catch(err => {
      asyncCreateTables();
      assert.ok(false, "Unable to create tables");
    });
});
