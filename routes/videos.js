const express = require("express");
const router = module.exports = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");
const multer = require('multer');

// db.any(sql.getUserProfile, { email: req.user.email }).then(result => {
//     if (result[0]) {
//         res.json({
//             status: "ok",
//             message: result[0]
//         });
//     } else {
//         res.json({
//             status: "error",
//             message: "error: email does not exists"
//         });
//     }
// });

router.post('/upload', passport.authenticate("jwt", { session: false }), 
(req, res) => {
    const email = req.user.email
    
    // Set storage engine
    const storage = multer.diskStorage({
      destination: './public/videos/',
      filename: function(req, file, cb){
        cb(null, email + '-' + Date.now() + '.webm');
      }
    });
    
    // Init upload
    const upload = multer({
      storage: storage
    }).single('myVideo'); 
    // Set fieldname='myVideo' and enctype='multipart/form-data' in the form
    
    upload(req, res, (err) => {
        if(err){
            res.json({
                status: "error",
                message: err.toString()
            })
        } else {
            // Get file information from req.file and username from token, and 
            // store it in database - in progress
            console.log(req.file);
            res.json({ 
                status: "ok",
                message: "Video upload successful"
            })
        }
    })
})

router.get("/getVideos", (req, res) => {});