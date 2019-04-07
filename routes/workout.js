const express = require("express");
const router = (module.exports = express.Router());
const passport = require("passport");
const { db } = require("../database/db");
const sql = require("../database/sql");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const requiredFields = new Set([
      "recording_date",
      "workout_length",
      "num_of_intervals",
      "interval_length"
    ]);

    const workout = Object.assign({}, req.body, { email: req.user.email });

    for (let field of requiredFields) {
      if (!workout.hasOwnProperty(field)) {
        return res.json({
          status: "error",
          message: `error: missing user data: ${field}`
        });
      }
    }

    db.any(sql.workouts.createWorkout, workout).then(result => {
      if (result[0]) {
        res.json({
          status: "ok",
          message: {
            work_id: result[0].work_id
          }
        });
      } else {
        res.json({
          status: "error",
          message: "Insertion failed"
        });
      }
    });
  }
);

// Get workouts by email, descending order
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.any(sql.workouts.getWorkoutsByEmail, { email: req.user.email })
    .then(result => {
      if(result.length > 0){
        res.json(result)
      } else {
        res.json({
          message: "User have not recorded any workouts"
        })
      }
    })
  }
)
    