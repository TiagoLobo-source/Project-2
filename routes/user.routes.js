const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

/* GET home page */
router.get("/userSignup", isLoggedOut, (req, res, next) => {
  res.render("register/signupJobseeker");
});

router.post("/signupJobseeker", (req, res, next) => {
  let errorMessage = null;
  let { email, password, repeatPassword, isJobseeker } = req.body;

  if (email === "" || password === "") {
    errorMessage = "Email and Password are mandatory fields.";
    res.status(400).render("register/signupJobseeker", {
      errorMessage,
      email,
    });
  } else if (password !== repeatPassword) {
    errorMessage = "Passwords do not match.";
    res.status(400).render("register/signupJobseeker", {
      errorMessage,
      email,
    });
  } else {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((passwordHash) => {
        return User.create({ email, passwordHash, isJobseeker });
      })
      .then((user) => {
        req.session.currentUser = user;
        res.redirect("/mainpage");
      })
      .catch((err) => {
        if (err.code === 11000) {
          errorMessage = "Email already exists.";
          res.render("register/signupJobseeker", {
            errorMessage,
            email,
          });
        }
      });
  }
});

module.exports = router;
