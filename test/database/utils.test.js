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
