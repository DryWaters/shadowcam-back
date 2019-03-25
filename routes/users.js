const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const requiredFields = new Set(
    "email",
    "password",
    "firstName",
    "lastName",
    "gender",
    "birthdate",
    "height",
    "weight"
  );
  const user = Object.assign({}, req.body);

  for (let field in requiredFields) {
    if (!user.hasOwnProperty(field)) {
      console.log("missing", field);
      return res
        .json({
          status: "error",
          message: "error: missing user data"
        })
        .end();
    }
  }

  db.any(sql.users.findUserByEmail, { email: user.email })
    .then(result => {
      if (result[0]) {
        res.json({
          status: "error",
          message: "error: username already exists"
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
            return db.any(sql.users.create, user);
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

  db.one(sql.users.findUserByEmail, { email }).then(result => {
    if (!result) {
      res.json({
        status: "error",
        message: "error: user does not exist"
      });
    } else {
      bcrypt
        .compare(password, result.pswd_hash)
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
    res.json({ email: req.user[0].email });
  }
);

module.exports = router;
