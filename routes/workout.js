const express = require("express");
const router = module.exports = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");
const multer = require('multer');

router.post('/create', passport.authenticate("jwt", { session: false }), 
(req, res) => {
    const requiredFields = new Set([
        "email",
        "rec_date",
        "work_len",
        "num_of_int",
        "int_len"
    ]);

    const workout = Object.assign({}, req.body);

    for (let field of requiredFields) {
        if (!workout.hasOwnProperty(field)) {
          return res
            .json({
              status: "error",
              message: "error: missing user data"
            })
            .end();
        }
    }

    db.any(sql.workouts.createWorkout, workout)
    .then(result => {
        if(result[0]){
            // returns work_id
            res.json(result[0])
        } else {
            res.json({ 
                status: "error",
                message: "Insertion failed"
            })
        }
    })
})