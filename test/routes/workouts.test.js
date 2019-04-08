const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

let token;

QUnit.module("/workouts/ Testing", {
  // get a valid token
  before: async assert => {
    let assertAsync = assert.async();
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

    const validWorkoutData = {
      email: "test@test.com",
      recording_date: "2019-04-08",
      workout_length: 18,
      num_of_intervals: 6,
      interval_length: 3
    }

    // insert workout
    try{
      assertAsync = assert.async()
      const response = await request(app)
        .post("/workouts/create")
        .set("Authorization", `Bearer ${token}`)
        .send(validWorkoutData)
      assertAsync()
    } catch(err) {
      assertAsync()
    }

    // insert 2 videos for workout id 1
    for(i = 0; i < 2; i++){
      try{
        assertAsync = assert.async()
        const response = await request(app)
          .post("/videos/upload")
          .set("Authorization", `Bearer ${token}`)
          .field('file_size', "100000")
          .field('work_id', "1")
          .field('screenshot', "SOME REALLY LONG TEXT FILE ENCODED PNG")
          // .attach('video', __dirname + '/public/Test/test.webm')
        assertAsync()
      } catch(err) {
        assertAsync()
      }
    }

    const validStatsData = {
      work_id: 1,
      jab: 10,
      power_rear: 10,
      left_hook: 10,
      right_hook: 10,
      left_uppercut: 10,
      right_uppercut: 10,
      left_body_hook: 10,
      right_body_hook: 10
    }

    // insert stats for workout 1
    try{
      assertAsync = assert.async()
      const response = await request(app)
        .post("/stats")
        .set("Authorization", `Bearer ${token}`)
        .send(validStatsData)
      assertAsync()
    } catch(err) {
      assertAsync()
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

QUnit.test("Getting workout, video and stats information from work id", 
async assert => {
  const assertAsync = assert.async();
  
  const validReturnData = {
    status: "ok",
    message: {
      workout: 
      {
        work_id: 1,
        recording_date: "2019-04-08T07:00:00.000Z",
        workout_length: 18,
        num_of_intervals: 6,
        interval_length: 3
      },
      videos: [],
      stats: 
      {
        stat_id: 1,
        jab: 10,
        power_rear: 10,
        left_hook: 10,
        right_hook: 10,
        left_uppercut: 10,
        right_uppercut: 10,
        left_body_hook: 10,
        right_body_hook: 10
      }
    }
  }

  try{
    const response = await request(app)
      .get("/workouts/1")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      
    assertAsync()
    assert.deepEqual(validReturnData, response.body)
  }
  catch(err){
    assertAsync()
    assert.ok(false, `FAIL GET /workouts/:id, with error ${err}`)
  }
})