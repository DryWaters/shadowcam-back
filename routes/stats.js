const express = require("express");
const router = (module.exports = express.Router());
const passport = require("passport");
const { db } = require("../database/db");
const sql = require("../database/sql");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    (work_id, jab, power_rear, left_hook, right_hook, left_uppercut, 
      right_uppercut, left_body_hook, right_body_hook)
    const requiredFields = new Set([
      "work_id",
      "jab",
      "power_rear",
      "left_hook",
      "right_hook",
      "left_uppercut",
      "right_uppercut",
      "left_body_hook",
      "right_body_hook"
    ]);

    const stats = Object.assign({}, req.body);

    for (let field of requiredFields) {
      if (!stats.hasOwnProperty(field)) {
        return res.json({
          status: "error",
          message: `error: missing stat data: ${field}`
        });
      }
    }

    db.any(sql.stats.createStats, stats)
      .then(result => {
        if (result[0]) {
          res.json({
            status: "ok",
            message: {
              stat_id: result[0].stat_id
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