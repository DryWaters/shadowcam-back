const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const database = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res, next) => {
  let { email, password } = req.body;

  return bcrypt
    .genSalt(10)
    .then(salt => {
      return bcrypt.hash(password, salt);
    })
    .then(hash => {
      password = hash;
    })
    .then(() => {
      return database.db.any(sql.users.create, [email, password]);
    })
    .then(result => {
      res
        .json({
          status: "OK",
          email: result[0].email
        })
        .end();
    })
    .catch(err => {
      console.log(err.detail);
      res.json(err.detail).end();
    });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;

  return database.db
    .any(sql.users.findUser, [email])
    .then(result => {
      if (result[0].password) {
        return bcrypt.compare(password, result[0].password);
      }
    })
    .then(result => {
      if (result) {
        const token = jwt.sign(req.body, process.env.DB_PASS, {
          expiresIn: 604800
        });
        let expireDate = Date.now();
        expireDate += 604800 * 1000;
        expireDate = new Date(expireDate);
        res
          .json({
            email,
            token,
            expiresIn: expireDate.toLocaleString()
          })
          .end();
      } else {
        return res.json({ success: false, msg: "Wrong Password" });
      }
    })
    .catch(err => console.log(err));
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ email: req.user[0].email });
  }
);

module.exports = router;
