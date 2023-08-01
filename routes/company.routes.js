const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;

/* GET home page */
router.get("/companySignup", (req, res, next) => {
  res.render("../views/register/signupCompany");
});


router.post("/signupCompany", (req, res, next) => {
    let { email, password, isJobseeker } = req.body;
    isJobseeker=false;
    if (email === "" || password === "")
      res.status(400).render("../views/register/signupCompany", {
        errorMessage: "Email and Password are mandatory fields.",
        email,
      });
    else {
      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((passwordHash) => {
          return User.create({ email, passwordHash,isJobseeker });
        })
        .then((user) => {
          res.render("../views/index", { user });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.render("../views/register/signupCompany", {
              errorMessage: "Email already exists.",
              email,
            });
          }
        });
    }
  });

module.exports = router;
