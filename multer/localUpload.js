const multer = require("multer");
const { db } = require("../database/db");
const sql = require("../database/sql");

const localUpload = multer({
  storage: multer.diskStorage({
    destination: "./public/videos/",
    filename: function(req, file, cb) {
      // Get other file info fields from body.
      // The text keys need to be appended to the request before the file
      // itself.

      db.any(sql.videos.addVideo, req.body)
        .then(result => {
          if (result[0]) {
            filename = `${result[0].video_id}.webm`;
            // If able to insert into video table, name the file the after
            // video_id.
            cb(null, filename);
          }
        })
        // will catch error if missing any data on the insertion:
        // res is not defined!!
        .catch(err => {
          res.json({
            status: "error",
            message: `missing user data with error ${err}`
          });
        });
    }
  })
});

module.exports = localUpload;
