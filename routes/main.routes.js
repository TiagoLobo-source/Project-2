const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const User = require("../models/User.model");
const Jobs = require("../models/Jobs.Schema");
const mongoose = require("mongoose");

router.get("/main", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  Jobs.find({ postedBy: userId })
    .then((allJobs) => {
      // -> allTheBooksFromDB is a placeholder, it can be any word
      console.log(allJobs);

      res.render("main.hbs", { jobs: allJobs });
    })
    .catch((error) => {
      console.log("Error while getting the books from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

router.get("/main/postjob", isLoggedIn, (req, res, next) => {
  req.session.currentUser;
  res.render("../views/jobposting/jobposting.hbs");
});

router.post("/main/postjob", isLoggedIn, (req, res, next) => {
  let {
    title,
    description,
    location,
    appliedBy,
    industry,
    contractType,
    salary,
    responsabilities,
    qualifications,
  } = req.body;
  let postedBy = req.session.currentUser._id;
  return Jobs.create({
    title: title,
    description: description,
    location: location,
    postedBy: postedBy,
    appliedBy: appliedBy,
    industry: industry,
    contractType: contractType,
    salary: salary,
    responsabilities: responsabilities,
    qualifications: qualifications,
  }).then((createdJob) => {
    res.render("main", { createdJob });
  });
});

module.exports = router;
