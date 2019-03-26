const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql").users;
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const requiredFields = new Set([
    "email",
    "password",
    "firstName",
    "lastName",
    "gender",
    "birthdate",
    "height",
    "weight"
  ]);
  const user = Object.assign({}, req.body);

  for (let field of requiredFields) {
    if (!user.hasOwnProperty(field)) {
      return res
        .json({
          status: "error",
          message: "error: missing user data"
        })
        .end();
    }
  }

  db.any(sql.findUserByEmail, { email: user.email })
    .then(result => {
      if (result[0]) {
        res.json({
          status: "error",
          message: "error: email already exists"
        });
      } else {
        bcrypt
          .genSalt(10)
          .then(salt => {
            return bcrypt.hash(user.password, salt);
          })
          .then(hash => {
            user.password = hash;
          })
          .then(() => {
            return db.any(sql.create, user);
          })
          .then(result => {
            res.json({
              status: "ok",
              message: `email: ${result[0].email}`
            });
          })
          .catch(err => {
            console.log(err);
            res.json(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.any(sql.findUserByEmail, { email }).then(result => {
    if (!result[0]) {
      res.json({
        status: "error",
        message: "error: email does not exist"
      });
    } else {
      bcrypt
        .compare(password, result[0].pswd_hash)
        .then(result => {
          if (result) {
            const token = jwt.sign({ email }, process.env.KEY, {
              expiresIn: 604800
            });
            let expireDate = Date.now();
            expireDate += 604800 * 1000;
            expireDate = new Date(expireDate);
            res.json({
              email,
              token,
              expiresIn: expireDate.toLocaleString()
            });
          } else {
            return res.json({
              status: "error",
              message: "error: wrong password"
            });
          }
        })
        .catch(err => console.log(err));
    }
  });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.any(sql.getUserProfile, { email: req.body.email }).then(result => {
      if (result[0]) {
        res.json({
          status: "ok",
          message: result[0]
        });
      } else {
        res.json({
          status: "error",
          message: "error: email does not exists"
        });
      }
    });
  }
);

module.exports = router;
