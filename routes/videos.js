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

    // Save filename in outerscope so can return later in JSON response.
    let filename;

    const storage = multer.diskStorage({
      destination: "./public/videos/",
      filename: function(req, file, cb) {
        // Get other file info fields from body.
        // The text keys need to be appended to the request before the file 
        // itself.
        const videoInfo = {
          file_size: req.body.file_size,
          work_id: req.body.work_id
        };

        insertVideoInfo(videoInfo, res)
          .then(result => {
            if (result[0]) {
              filename = `${result[0].video_id}.webm`
              // If able to insert into video table, name the file the after 
              // video_id.
              cb(null, filename);
              // Do you actually need this else clause if you are catching the 
              // error anyways?
            } else {
              res.json({
                status: "error",
                message: "error inserting video info"
              });
            }
          })
          .catch(err => {
            res.json({
              status: "error",
              message: `error inserting video info with error: ${err}`
            });
          });
      }
    });

    // Init upload function.
    // Set fieldname='video' and enctype='multipart/form-data' in the form.
    const upload = multer({
      storage: storage
    }).single("video");

    upload(req, res, err => {
      if (err) {
        res.json({
          status: "error",
          message: `error uploading file with error: ${err}`
        });
      } else {
        res.json({
          status: "ok",
          message: `Video upload successful: ${filename}`
        });
      }
    });
  }
);

const insertVideoInfo = (videoInfo, res) => {
  const requiredFields = new Set(["work_id", "file_size"]);

  console.log(videoInfo);

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

// Get video by work_id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    db.any(sql.videos.getVideosByWorkID, { work_id: req.params.id })
    .then(result => {
      if(result[0]){
        res.json(result);
      } else {
        res.json({
          status: "error",
          message: "missing workout videos"
        })
      }
    })
    .catch(err => {
      res.json({
        status: "error",
        message: `get videos by work id error: ${err}`
      })
    })
  }
)
