const request = require("supertest");
const app = require("../../app");
const { db } = require("../../database/db");
const moment = require("moment");

QUnit.module("/users/ Testing");

const validUserData = {
  email: "test@test.com",
  password: "tester",
  firstName: "tester",
  lastName: "test",
  gender: "m",
  birthdate: moment("2001-10-20").toISOString(),
  height: 60,
  weight: 160
};

QUnit.test(
  "Should allow user to register with valid user data",
  async assert => {
    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .post("/users/register")
        .send(validUserData)
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "ok");
      assert.equal(response.body.message, `email: ${validUserData.email}`);
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    }
  }
);

QUnit.test(
  "Should not allow to register a user if missing data",
  async assert => {
    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .post("/users/register")
        .send({ email: "somebademail", password: "somebadpassword" })
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: missing user data");
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    }
  }
);

QUnit.test("Should not allow duplicate emails to register", async assert => {
  const assertAsync = assert.async();

  try {
    const response = await request(app)
      .post("/users/register")
      .send(validUserData)
      .expect("Content-Type", /json/);
    assertAsync();
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "error: email already exists");
  } catch (err) {
    assertAsync();
    assert.ok(false, `FAIL /users/register, with error ${err}`);
  }
});

QUnit.test("Checks that password is hashed", async assert => {
  const assertAsync = assert.async();
  try {
    const result = await db.any(
      "SELECT pswd_hash FROM users WHERE email = $[email]",
      {
        email: validUserData.email
      }
    );
    assertAsync();
    assert.notEqual(
      result[0].pswd_hash,
      validUserData.email,
      "Not the same value as the original password"
    );
    assert.equal(result[0].pswd_hash.length, 60, "Is hashed to 60 characters");
  } catch (err) {
    assertAsync();
    assert.ok(false, `FAIL /users/register, with error ${err}`);
  }
});

QUnit.test(
  "Should not allow login if email does not exist when trying to login",
  async assert => {
    const assertAsync = assert.async();

    try {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "somebogusemail@email.com",
          password: "someboguspassword"
        })
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: email does not exist");
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/login, with error ${err}`);
    }
  }
);

QUnit.test("Should not allow login if password is incorrect", async assert => {
  const assertAsync = assert.async();

  try {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: validUserData.email,
        password: "wrongpassword"
      })
      .expect("Content-Type", /json/);
    assertAsync();
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "error: wrong password");
  } catch (err) {
    assertAsync();
    assert.ok(false, `FAIL /users/login, with error ${err}`);
  }
});

QUnit.test(
  "Should allow login and return token if password is correct",
  async assert => {
    const assertAsync = assert.async();

    try {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: validUserData.email,
          password: validUserData.password
        })
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "ok");
      assert.equal(response.body.message.email, validUserData.email);
      assert.equal(response.body.message.token.length > 120, true);
      assert.equal(response.body.message.token.startsWith("ey"), true);
      const date = moment(response.body.message.expiresIn);
      const timeLeft = moment.duration(date.diff(moment())).as("seconds");
      assert.equal(
        timeLeft > 60400 && timeLeft < 604800,
        true,
        "should have time left of less than 604800 seconds after creation"
      );
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/login, with error ${err}`);
    }
  }
);

QUnit.test(
  "Should return back correct user details if have token for user",
  async assert => {
    const userDetails = {
      email: "test@test.com",
      first_name: "tester",
      last_name: "test",
      gender: "m",
      birthdate: moment("2001-10-20").toISOString(),
      height: 60,
      weight: 160
    };

    const assertAsync = assert.async();

    try {
      const tokenResponse = await request(app)
        .post("/users/login")
        .send({
          email: validUserData.email,
          password: validUserData.password
        });
      const profileResponse = await request(app)
        .get("/users/profile")
        .set("Authorization", `Bearer ${tokenResponse.body.message.token}`);
      assertAsync();
      assert.deepEqual(profileResponse.body.message, userDetails);
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/login, with error ${err}`);
    }
  }
);

QUnit.test("Should return back unauthorized if missing token", async assert => {
  const assertAsync = assert.async();

  try {
    const response = await request(app).get("/users/profile");
    assertAsync();
    assert.equal(response.status, 401);
  } catch (err) {
    assertAsync();
    assert.ok(false, `FAIL /users/login, with error ${err}`);
  }
});

QUnit.test(
  "Should return back unauthorized if token is wrong",
  async assert => {
    const assertAsync = assert.async();

    try {
      const response = await request(app)
        .get("/users/profile")
        .set("Authorization", `Bearer somebadtoken`);
      assertAsync();
      assert.equal(response.status, 401);
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL /users/login, with error ${err}`);
    }
  }
);
