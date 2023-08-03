const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/* GET home page */
router.get("/options", (req, res, next) => {
  console.log("asdas");
  res.render("../views/register/step2");
});

/*router.get("/options", (req, res, next) => {
  const User=req.params
  res.render("../views/register/signup",{isJobseeker: User.isJobseekers})
  console.log("asdas");
  res.render("../views/register/step2");
});*/

router.get("/login", (req, res) => res.render("../views/register/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("../views/register/login", {
      errorMessage: "Please enter both, email and password to login.",
      email,
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("../views/register/login", {
          errorMessage: "Email is not registered. Try with other email.",
          email,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("../views/register/login", {
          errorMessage: "Incorrect password.",
          email,
        });
      }
    })
    .catch((error) => next(error));
});

// routes/auth.routes.js

// nothing gets changed except the GET /userProfile route

router.get("/userProfile", (req, res) => {
  console.log(req.session);
  res.render("../views/user-profile", { currentUser: req.session.currentUser });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});
module.exports = router;
