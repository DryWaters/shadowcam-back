const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

let token;

QUnit.module("/videos/ Testing", {
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
      token = response.body.message.token;
      assertAsync();
    } catch (err) {
      assertAsync();
    }
  }
});

QUnit.test(
  "Should not allow user to upload video with invalid video info",
  async assert => {
    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .post("/videos/upload")
        .set("Authorization", `Bearer ${token}`)
        .field("file_size", "100000")
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "error");
      assert.equal(response.body.message, "error: missing user data: work_id");
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL GET /workouts, with error ${err}`);
    }
  }
);

QUnit.test(
  "Should allow user to upload video with valid video info",
  async assert => {
    const assertAsync = assert.async();
    try {
      const response = await request(app)
        .post("/videos/upload")
        .set("Authorization", `Bearer ${token}`)
        .field("file_size", "100000")
        .field("work_id", "1")
        .field("screenshot", "somelongtext")
        .expect("Content-Type", /json/);
      assertAsync();
      assert.equal(response.body.status, "ok");
    } catch (err) {
      assertAsync();
      assert.ok(false, `FAIL GET /workouts, with error ${err}`);
    }
  }
);
