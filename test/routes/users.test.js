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

QUnit.test("Should not allow duplicate emails to register", assert => {
  const assertAsync = assert.async();
  request(app)
    .post("/users/register")
    .send(validUserData)
    .expect("Content-Type", /json/)
    .then(response => {
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: email already exists");
    })
    .catch(err => {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    });
});

QUnit.test("Checks that password is hashed", assert => {
  const assertAsync = assert.async();
  db.any("SELECT pswd_hash FROM users WHERE email = $[email]", {
    email: validUserData.email
  })
    .then(result => {
      assert.notEqual(
        result[0].pswd_hash,
        validUserData.email,
        "Not the same value as the original password"
      );
      assert.equal(
        result[0].pswd_hash.length,
        60,
        "Is hashed to 60 characters"
      );
      assertAsync();
    })
    .catch(err => {
      assertAsync();
      assert.ok(false, `FAIL /users/register, with error ${err}`);
    });
});

QUnit.test(
  "Should not allow login if email does not exist when trying to login",
  assert => {
    const assertAsync = assert.async();
    request(app)
      .post("/users/login")
      .send({
        email: "somebogusemail@email.com",
        password: "someboguspassword"
      })
      .expect("Content-Type", /json/)
      .then(response => {
        assertAsync();
        assert.equal(response.body.status, "error");
        assert.equal(response.body.message, "error: email does not exist");
      })
      .catch(err => {
        assertAsync();
        assert.ok(false, `FAIL /users/login, with error ${err}`);
      });
  }
);

QUnit.test("Should not allow login if password is incorrect", assert => {
  const assertAsync = assert.async();
  request(app)
    .post("/users/login")
    .send({
      email: validUserData.email,
      password: "wrongpassword"
    })
    .expect("Content-Type", /json/)
    .then(response => {
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: wrong password");
    })
    .catch(err => {
      assertAsync();
      assert.ok(false, `FAIL /users/login, with error ${err}`);
    });
});

QUnit.test(
  "Should allow login and return token if password is correct",
  assert => {
    const assertAsync = assert.async();
    request(app)
      .post("/users/login")
      .send({
        email: validUserData.email,
        password: validUserData.password
      })
      .expect("Content-Type", /json/)
      .then(response => {
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
      })
      .catch(err => {
        assertAsync();
        assert.ok(false, `FAIL /users/login, with error ${err}`);
      });
  }
);

QUnit.test(
  "Should return back correct user details if have token for user ",
  assert => {
    const assertAsync = assert.async();
    let token;
    request(app)
      .get("/users/login")
      .send({
        email: validUserData.email,
        password: validUserData.password
      })
      .then(res => {
        token = res.body.message.token
        return request(app)
          .get("users/profile")
          .set("Authorization", `Bearer ${token}`)
          .then(res => console.log(res))
          .catch(err => {
            assertAsync();
            assert.ok(false, `FAIL /users/login, with error ${err}`);
          });
      })
      .then(res => console.log(res))

      .catch(err => {
        assertAsync();
        assert.ok(false, `FAIL /users/login, with error ${err}`);
      });
  }
);
