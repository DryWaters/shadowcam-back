const express = require("express");
const router = (module.exports = express.Router());
const passport = require("passport");
const { db } = require("../database/db");
const sql = require("../database/sql");
const multer = require("multer");

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const storage = multer.diskStorage({
      destination: "./public/videos/",
      filename: function(req, file, cb) {
        // Get other file info fields from body
        // the text keys need to be appended to the request
        // before the file itself
        const videoInfo = {
          file_size: req.body.file_size,
          work_id: req.body.work_id
        };

        insertVideoInfo(videoInfo, res).then(result => {
          if (result[0]) {
            // if able to insert into video table
            // name the file the video_id
            cb(null, `${result[0].video_id}.webm`);
          } else {
            // else error, respond back
            res.json({
              status: "error",
              message: "error inserting video info"
            });
          }
        });
      }
    });

    // Init upload
    const upload = multer({
      storage: storage
    }).single("video");
    // Set fieldname='video' and enctype='multipart/form-data' in the form

    upload(req, res, err => {
      if (err) {
        res.json({
          status: "error",
          message: `error uploading file with error: ${err}`
        });
      } else {
        // Get file information from req.file and username from token, and
        // store it in database - in progress

        res.json({
          status: "ok",
          message: "Video upload successful"
        });
      }
    });

    // let video_id;

    // // get the id of the newest video on email from the token
    // db.any(sql.videos.getLatestVideoID)
    // .then(result => {
    //     if(result[0]){
    //         // returns video_id
    //         video_id = result[0].video_id

    //         const storage = multer.diskStorage({
    //           destination: './public/videos/',
    //           filename: function(req, file, cb){
    //             //   set the video name to be vid_id
    //             cb(null, JSON.stringify(video_id) + '.webm');
    //           }
    //         });

    //         // Init upload
    //         const upload = multer({
    //           storage: storage
    //         }).single('myVideo');
    //         // Set fieldname='myVideo' and enctype='multipart/form-data' in the form

    //         upload(req, res, (err) => {
    //             if(err){
    //                 res.json({
    //                     status: "error",
    //                     message: err.toString()
    //                 })
    //             } else {
    //                 // Get file information from req.file and username from token, and
    //                 // store it in database - in progress
    //                 console.log(req.file);
    //                 res.json({
    //                     status: "ok",
    //                     message: "Video upload successful"
    //                 })
    //             }
    //         })
    //     } else {
    //         res.json({
    //             status: "error",
    //             message: "Insertion failed"
    //         })
    //     }
    // })
  }
);

const insertVideoInfo = (videoInfo, res) => {
  const requiredFields = new Set(["work_id", "file_size"]);

  for (let field of requiredFields) {
    if (!videoInfo.hasOwnProperty(field)) {
      return res.json({
        status: "error",
        message: "error: missing user data"
      });
    }
  }

  return db.any(sql.videos.addVideo, videoInfo);
};

router.get("/getVideos", (req, res) => {});
