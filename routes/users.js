const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  // Get email and password from request's body
  let { email, password } = req.body;

  // DB call to make sure user does not already exist
  db.any(sql.users.findUser, [email]).then(result => {
    if (result[0]) {
      //  if have result (email already used), return back error message
      res.json({
        error: "Username already exists"
      });
    } else {
      // Must have good email so start encryption and insertion of new user
      // Use bcrypt to generate salt
      bcrypt
        .genSalt(10)
        // call bcrypt with unecrypted password and salt to hash
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        // have hash, reassign old unecryped password to hashed
        .then(hash => {
          password = hash;
        })
        // call DB with create user with email and hashed password
        .then(() => {
          return db.any(sql.users.create, [email, password]);
        })
        // if successful return the user's email with status message
        .then(result => {
          res.json({
            status: "OK",
            email: result[0].email
          });
        })
        // error inserting user, DB error
        .catch(err => {
          console.log(err.detail);
          res.json(err.detail).end();
        });
    }
  });
});

router.post("/login", (req, res) => {
  // Get email and password from request's body
  const { email, password } = req.body;

  // DB call to get verify the user exists by checking email
  db.any(sql.users.findUser, [email]).then(result => {
    // If user does not exist, return with error that user does not exist
    // no need to continue
    if (!result[0]) {
      res.json({ success: false, msg: "User does not exist" });
    } else {
      // else have a user, verify that the password matches the hashed password
      bcrypt
        .compare(password, result[0].password)

        // If there is a result (true) from the .compare(), then it is valid
        // else passwords do not match, result will be false
        .then(result => {
          if (result) {
            console.log(result);

            // jwt.sign expects first argument as object of the keys that you want to encrypt into the token,
            // second argument is the encryption secret key you want to use, and the 3rd is a options you want
            // to set for the token:  expiresIn sets the number of seconds before the token is invalid
            const token = jwt.sign({ email }, process.env.DB_PASS, {
              expiresIn: 604800
            });

            // Add a key that also shows at what time the token will expire at
            let expireDate = Date.now();
            expireDate += 604800 * 1000;
            expireDate = new Date(expireDate);

            // respond back with the email, token, and the date the token will expire
            res.json({
              email,
              token,
              expiresIn: expireDate.toLocaleString()
            });
          } else {
            // password did not match...return error message
            return res.json({ success: false, msg: "Wrong Password" });
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
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ email: req.user[0].email });
  }
);

module.exports = router;
