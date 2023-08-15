const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User.model")
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;


/* GET home page */
router.get("/userSignup", isLoggedOut, (req, res, next) => {
  res.render("register/signupJobseeker");
});


router.post("/signupJobseeker", (req, res, next) => {
    let { email, password, repeatPassword, isJobseeker } = req.body;
    
    if (email === "" || password === "")
      res.status(400).render("register/signupJobseeker", {
        errorMessage: "Email and Password are mandatory fields.",
        email,
      });
     else if (password !== repeatPassword)
    res.status(400).render("register/signupJobseeker", {
      errorMessage: "Passwords do not match.",
    });
    else {
      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((passwordHash) => {
          return User.create({ email, passwordHash,isJobseeker });
        })
        .then((user) => {
          res.render("index", { user });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.render("register/signupJobseeker", {
              errorMessage: "Email already exists.",
              email,
            });
          }
        });
    }
  });


module.exports = router;