const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const multer = require("multer");
const { multerCloudinary } = require("../config/cloudinary.config");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const saltRounds = 10;

/* GET home page */
router.get("/options", (req, res, next) => {
  console.log("asdas");
  res.render("register/step2");
});

/*router.get("/options", (req, res, next) => {
  const User=req.params
  res.render("register/signup",{isJobseeker: User.isJobseekers})
  console.log("asdas");
  res.render("register/step2");
});*/

router.get("/login", isLoggedOut, (req, res) => res.render("register/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("register/login", {
      errorMessage: "Please enter both, email and password to login.",
      email,
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("register/login", {
          errorMessage: "Email is not registered. Try with other email.",
          email,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("register/login", {
          errorMessage: "Incorrect password.",
          email,
        });
      }
    })
    .catch((error) => next(error));
});

// routes/auth.routes.js

// nothing gets changed except the GET /userProfile route

router.get("/mainpage", isLoggedIn, (req, res) => {
  res.render("/mainpage", { currentUser: req.session.currentUser });
});

router.post(
  "/userProfile/edit",
  multerCloudinary.single("cv"),
  isLoggedIn,
  (req, res) => {
    res.render("edit-profile", { currentUser: req.session.currentUser });
    let {
      firstName,
      lastName,
      aboutMe,
      dateOfBirth,
      professionalExperience,
      companyName,
      companyLocation,
      companyDescription,
      companyIndustry,
      companyNumberOfEmployees,
      companyContactInfo,
      salary,
    } = req.body;
    const newCvUrl = req.file ? req.file.secure_url : null;

    const userId = req.session.currentUser._id;
    User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          dateOfBirth,
          aboutMe,
          professionalExperience,
          cv: newCvUrl,
          companyName,
          companyLocation,
          companyDescription,
          companyIndustry,
          companyNumberOfEmployees,
          companyContactInfo,
          salary,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        req.session.currentUser = updatedUser;
        console.log(updatedUser);
        res.redirect("/mainpage");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/userProfile/edit", isLoggedIn, (req, res) => {
  res.render("edit-profile", { currentUser: req.session.currentUser });
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
