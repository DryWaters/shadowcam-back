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

  db.any(sql.users.findUserByEmail, [user.email])
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

  db.any(sql.users.findUserByEmail, [email]).then(result => {
    if (!result[0]) {
      res.json({
        status: "error",
        message: "error: user does not exist"
      });
    } else {
      bcrypt
        .compare(password, result[0].password)
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
        // Error in checking token or DB calls.
        .catch(err => console.log(err));
    }
  });
});

// Example on how to secure a route.
// Add second parameter to .get() that sets the passport authentication middlewhere
// We are using JWT tokens and not session so set { session: false }
// Everything else is the same.  If a user tries to go to a secured route without
// a valid token then it will come back Invalid
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ email: req.user[0].email });
  }
);

module.exports = router;
