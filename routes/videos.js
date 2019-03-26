const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const sql = require("../database/sql");
const bcrypt = require("bcryptjs");

router.get("/getVideos", (req, res) => {});
