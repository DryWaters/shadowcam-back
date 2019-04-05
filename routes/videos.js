const express = require("express");
const router = module.exports = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");
const multer = require('multer');

router.post('/add', passport.authenticate("jwt", { session: false }), 
(req, res) => {
    const requiredFields = new Set([
        "work_id",
        "video_length",
        "file_size",
    ]);
    
    const video = Object.assign({}, req.body);
    
    for (let field of requiredFields) {
        if (!video.hasOwnProperty(field)) {
          return res
            .json({
              status: "error",
              message: "error: missing user data"
            })
            .end();
        }
    }
    
    db.any(sql.videos.addVideo, video)
    .then(result => {
        if(result[0]){
            // returns video_id
            res.json(result[0])
        } else {
            res.json({ 
                status: "error",
                message: "Insertion failed"
            })
        }
    })
})

router.post('/upload', passport.authenticate("jwt", { session: false }), 
(req, res) => {

    let video_id;

    // get the id of the newest video on email from the token
    db.any(sql.videos.getLatestVideoID)
    .then(result => {
        if(result[0]){
            // returns video_id
            video_id = result[0].video_id

            const storage = multer.diskStorage({
              destination: './public/videos/',
              filename: function(req, file, cb){
                //   set the video name to be vid_id
                cb(null, JSON.stringify(video_id) + '.webm');
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
        } else {
            res.json({ 
                status: "error",
                message: "Insertion failed"
            })
        }
    })
})

router.get("/getVideos", (req, res) => {});