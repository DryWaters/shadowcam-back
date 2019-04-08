const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

let token;

QUnit.module("/workouts/ Testing", {
  // get a valid token
  before: async assert => {
    const assertAsync = assert.async();
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

    try {
      await request(app)
        .post("/users/register")
        .send(validUserData);
      const response = await request(app)
        .post("/users/login")
        .send({
          email: validUserData.email,
          password: validUserData.password
        });
      assertAsync();
      token = response.body.message.token;
    } catch (err) {
      assertAsync();
    }
  }
});

QUnit.test(
  "Should allow user to retrieve workouts with valid token",
  async assert => {
    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .get("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "ok");
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL GET /workouts, with error ${err}`);
    }
  }
);

QUnit.test(
  "Should return back unauthorized if token is wrong",
  async assert => {
    const assertAsync = assert.async();

    try {
      const response = await request(app)
        .get("/workouts")
        .set("Authorization", `Bearer somebadtoken`);
      assertAsync();
      assert.equal(response.status, 401);
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL GET /workouts, with error ${err}`);
    }
  }
);

QUnit.test(
  "Should create a workout if has all required workout data",
  async assert => {
    const validWorkoutData = {
      recording_date: new moment().format(),
      workout_length: 120,
      num_of_intervals: 1,
      interval_length: 120
    };

    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .post("/workouts/create")
        .set("Authorization", `Bearer ${token}`)
        .send(validWorkoutData)
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "ok");
      assert.equal(typeof response.body.message.work_id, "number");
      assert.ok(response.body.message.work_id > 0);
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL POST /workouts, with error ${err}`);
    }
  }
);

QUnit.test("Should respond if missing workout data", async assert => {
  const invalidWorkoutData = {
    recording_date: new moment().format(),
    num_of_intervals: 1,
    interval_length: 120
  };

  const assertAsync = assert.async();
  try {
    const response = await request(app)
      .post("/workouts/create")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidWorkoutData)
      .expect("Content-Type", /json/);
    assertAsync();
    assert.equal(response.body.status, "error");
    assert.equal(
      response.body.message,
      "error: missing user data: workout_length"
    );
  } catch (err) {
    assertAsync();
    assert.ok(false, `FAIL POST /workouts, with error ${err}`);
  }
});
