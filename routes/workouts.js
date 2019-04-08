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

    db.any(sql.workouts.createWorkout, workout)
      .then(result => {
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
      })
      .catch(err => {
        res.json({
          status: "error",
          message: `Insertion failed with error ${err}`
        });
      });
  }
);

// Get workouts by email, descending order
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.any(sql.workouts.getWorkoutsByEmail, { email: req.user.email })
      .then(results => {
        if (results.length > 0) {
          res.json({
            status: "ok",
            workouts: results
          });
        } else {
          res.json({
            status: "ok",
            message: "User does not have any recorded workouts"
          });
        }
      })
      .catch(err => {
        res.json({
          status: "error",
          message: `Insertion failed with error ${err}`
        });
      });
  }
);

// Get workouts by workout id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    work_id = { work_id: req.params.id }
    const p1 = db.any(sql.workouts.getWorkoutByWorkID, work_id)
    const p2 = db.any(sql.videos.getVideosByWorkID, work_id)
    const p3 = db.any(sql.stats.getStatsByWorkID, work_id)

    Promise.all([p1, p2, p3])
    .then(result => {
      if(result.length > 0){
        res.json({
          status: "ok",
          message: {
            workout: result[0][0],
            videos: result[1],
            stats: result[2][0]
          }
        })
      } else {
        res.json({
          status: "ok",
          message: "No results on workout id"
        })
      }
    })
    .catch(err => {
      res.json({
        status: "error",
        message: `Select failed with error ${err}`
      })
    })
  })
