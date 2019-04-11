const express = require("express");
const router = (module.exports = express.Router());
const passport = require("passport");
const s3Upload = require("../multer/s3Upload");
const localUpload = require("../multer/localUpload");
const { db } = require("../database/db");
const sql = require("../database/sql");

let singleUpload;
if (process.env.LOCAL === "TRUE") {
  singleUpload = localUpload.single("video");
} else {
  singleUpload = s3Upload.single("video");
}

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    singleUpload(req, res, err => {
      const videoInfo = Object.assign({}, req.body);

      const requiredFields = new Set(["work_id", "file_size", "screenshot"]);

      for (let field of requiredFields) {
        if (!(field in videoInfo)) {
          return res.json({
            status: "error",
            message: `error: missing user data: ${field}`
          });
        }
      }

      if (err) {
        console.log(err);
        db.any(sql.videos.deleteVideo, {
          work_id: videoInfo.work_id,
          file_size: videoInfo.file_size
        })
          .then(result => {
            return res.json({
              status: "error",
              message: `Deleted video that could not be uploaded`
            });
          })
          .catch(err => {
            return res.json({
              status: "error",
              message: `Unable to roll back video entry with err: ${err}`
            });
          });
      } else {
        res.json({
          status: "ok",
          message: `Video upload successful`
        });
      }
    });
  }
);
