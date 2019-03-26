const request = require("supertest");
const app = require("../../app");

QUnit.module("User Testing");

const validUserData = {
  email: "test@test.com",
  password: "tester",
  firstName: "tester",
  lastName: "test",
  gender: "m",
  birthdate: "2019-1-1",
  height: 60,
  weight: 160
};

QUnit.test("Should allow user to register with valid user data", assert => {
  const assertAsync = assert.async();
  request(app)
    .post("/users/register")
    .send(validUserData)
    .expect("Content-Type", /json/)
    .then(response => {
      assertAsync();
      assert.equal(response.body.status, "ok");
      assert.equal(response.body.message, `email: ${validUserData.email}`);
    })
    .catch(err => {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    });
});

QUnit.test("Should not allow to register a user if missing data", assert => {
  const assertAsync = assert.async();
  request(app)
    .post("/users/register")
    .send({ email: "somebademail", password: "somebadpassword" })
    .expect("Content-Type", /json/)
    .then(response => {
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: missing user data");
    })
    .catch(err => {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    });
});
