const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
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

router.get("/userProfile", isLoggedIn, (req, res) => {
  console.log(req.session);
  res.render("user-profile", { currentUser: req.session.currentUser });
});
router.get("/userProfile/edit", isLoggedIn, (req, res) => {
  console.log(req.session);
  res.render("edit-profile", { currentUser: req.session.currentUser });
});

router.post("/userProfile/edit", isLoggedIn, (req, res, next) => {
  res.render("user-profile", { currentUser: req.session.currentUser });
  let {
    password,
    repeatPassword,
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
  } = req.body;

  if (password === "")
    res.status(400).render("edit-profile", {
      errorMessage: "Password is a mandatory field.",
    });
  else if (dateOfBirth === "") {
    res.status(400).render("edit-profile", {
      errorMessage: "Date of birth is a mandatory field.",
    });
  } else {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((passwordHash) => {
        console.log(req.session);
        const userId = req.session.currentUser._id;
        const updateObject = {
          firstName: firstName,
          passwordHash: passwordHash,
          repeatPassword: repeatPassword,
          lastName: lastName,
          aboutMe: aboutMe,
          dateOfBirth: dateOfBirth,
          professionalExperience: professionalExperience,
          companyName: companyName,
          companyLocation: companyLocation,
          companyDescription: companyDescription,
          companyIndustry: companyIndustry,
          companyNumberOfEmployees: companyNumberOfEmployees,
          companyContactInfo: companyContactInfo,
        };
        return User.findByIdAndUpdate(userId, updateObject);
      })
      .then((currentUser) => {
        req.session.currentUser = currentUser;
        res.redirect("/userProfile");
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

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
