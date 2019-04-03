const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql").users;
const bcrypt = require("bcryptjs");
const moment = require('moment');
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: '../public/videos',
  filename: function(req, res, cb){
    cb(null, file.fieldname + '-' + Date.now() + '.webm');
  }
});

// Init upload
const upload = multer({
  storage: storage
}).single('myVideo'); 
// We will replace 'myVideo' with whatever you set as fieldname.
// You also need to add enctype='multipart/form-data to the form you are sending the file.

// Upload video
router.post('/upload', (req, res) =>
{
  upload(req, res, (err) => {
    if(err){
      res.json({
        status: "error",
        message: "Error: " + err.toString()
      })
    } else {
      console.log(req.file);
      // Take file information and store it in database, or get information from front-end json
      // { fieldname: username, filename: filename, size: size}
      res.json({ 
        status: "ok",
        message: "Video upload successful"
      })
    }
  })
})

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
            return db.any(sql.createUser, user);
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
            let expireDate = moment();
            expireDate.add(604800, 's');
            res.json({
              status: "ok",
              message: {
                email,
                token,
                expiresIn: expireDate.format()
              }
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
    db.any(sql.getUserProfile, { email: req.user.email }).then(result => {
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
