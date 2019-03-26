require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const utils = require('./database/utils');
const { pgp } = require('./database/db');

const app = express();
const users = require("./routes/users");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

// Put which routes you want to use here.
app.use("/users", users);

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === "TRUE") {
  utils.rebuildData().then(() => {
    console.log("done setting up");
  });
}

app.listen(process.env.PORT, () => {
  console.log("Server started at port " + process.env.PORT);
});

// close database connections on exit
const closeDBConnections = () => {
  if (pgp) {
    pgp.end();
  }
  process.exit(1);
};

process.on('SIGINT', closeDBConnections);
process.on('SIGTERM', closeDBConnections);

module.exports = app;