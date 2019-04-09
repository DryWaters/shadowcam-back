const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

let token;

const validStatsData = {
    work_id : 1,
    jab : 10,
    power_rear : 10,
    left_hook : 10,
    right_hook : 10,
    left_uppercut : 10,
    right_uppercut : 10,
    left_body_hook : 10,
    right_body_hook: 10
}

QUnit.module("/stats/ Testing", {
    // get a valid token
    before: async assert => {
        let assertAsync = assert.async();
        const validUserData = {
            email: "test2@test.com",
            password: "tester",
            firstName: "tester",
            lastName: "test",
            gender: "m",
            birthdate: moment("2001-10-20").toISOString(),
            height: 60,
            weight: 160
        };

        // registering user, logging in user, storing user token for later
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
            email: "test2@test.com",
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
    }
})

QUnit.test(
    "Inserting stats with valid token and work_id -> expecting ok status",
    async assert => {

        const assertAsync = assert.async();
        
        try {
            const response = await request(app)
            .post("/stats")
            .set("Authorization", `Bearer ${token}`)
            .send(validStatsData)
            .expect("Content-Type", /json/);
            assertAsync();
            assert.equal(response.body.status, "ok");
            assert.equal(response.body.message.stat_id, 1)
        } catch (err) {
            assertAsync();
            assert.ok(false, `FAIL POST /stats, with ${err}`);
        }
    }
);

QUnit.test(
    "Inserting stats with invalid token -> expecting error status",
    async assert => {
        const assertAsync = assert.async();
        
        try {
            const response = await request(app)
            .post("/stats")
            .set("Authorization", `Bearer somebadtoken`)
            .send(validStatsData)
            assertAsync();
            assert.equal(response.status, 401);
        } catch (err) {
            assertAsync();
            assert.ok(false, `FAIL POST /stats, ${err}`);
        }
    }
);

QUnit.test(
    "Inserting stats with missing values -> expecting error status",
    async assert => {
        
        const invalidStatsData = {
            work_id : 1,
            power_rear : 10,
            left_hook : 10,
            left_uppercut : 10,
            right_uppercut : 10,
            right_body_hook: 10
        }

        const assertAsync = assert.async();
        
        try {
            const response = await request(app)
            .post("/stats")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidStatsData)
            .expect("Content-Type", /json/);
            assertAsync();
            assert.equal(response.body.status, "error");
        } catch (err) {
            assertAsync();
            assert.ok(false, `FAIL POST /stats, with ${err}`);
        }
    }
);

QUnit.test(
    "Inserting stats with an non existent workout id -> expecting error status",
    async assert => {
        
        const invalidStatsData = {
            work_id : 2,
            jab : 10,
            power_rear : 10,
            left_hook : 10,
            right_hook : 10,
            left_uppercut : 10,
            right_uppercut : 10,
            left_body_hook : 10,
            right_body_hook: 10
        }

        const assertAsync = assert.async();
        
        try {
            const response = await request(app)
            .post("/stats")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidStatsData)
            .expect("Content-Type", /json/);
            assertAsync();
            assert.equal(response.body.status, "error");
        } catch (err) {
            assertAsync();
            assert.ok(false, `FAIL POST /stats, with ${err}`);
        }
    }
);

QUnit.test(
    "Inserting stats with null values -> expecting error status",
    async assert => {
        
        const invalidStatsData = {
            work_id : 1,
            jab : 10,
            power_rear : 10,
            left_hook : "NULL",
            right_hook : 10,
            left_uppercut : 10,
            right_uppercut : "NULL",
            left_body_hook : 10,
            right_body_hook: 10
        }

        const assertAsync = assert.async();
        
        try {
            const response = await request(app)
            .post("/stats")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidStatsData)
            .expect("Content-Type", /json/);
            assertAsync();
            assert.equal(response.body.status, "error");
        } catch (err) {
            assertAsync();
            assert.ok(false, `FAIL POST /stats, with ${err}`);
        }
    }
);