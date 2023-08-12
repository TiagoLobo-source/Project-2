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

      res.render("main.hbs", { jobs: allJobs });
    })
    .catch((error) => {
      console.log("Error while getting the books from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

router.get("/main/postjob", isLoggedIn, (req, res, next) => {
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
    postedJob,
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
    postedJob: postedJob,
  }).then((createdJob) => {
    res.render("main", { createdJob });
  });
});

router.get("/mainpage", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  Jobs.find().then((data) => {
    const jobs = data;
    res.render("../views/main.hbs", { currentUser, jobs });
  });
});

router.get("/mainpage/:id", isLoggedIn, (req, res, next) => {
  Jobs.findById(req.params.id).then((oneJob) => {
    res.render("jobposting/jobapply.hbs", oneJob);
  });
});


router.get("/jobsapplied", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const currentUser = req.session.currentUser;

  Jobs.find({appliedBy: userId })
    .then((jobs) => {
      if (jobs.length > 0) {
        res.render("jobsapplied.hbs", { jobs,currentUser});
      } else {
        res.render("nojobsapplied.hbs");
      }
    })
});

router.post("/mainpage/:id", isLoggedIn, (req, res, next) => {
  console.log(req.session);
  let appliedBy = req.session.currentUser._id;
  return Jobs.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { appliedBy } },
    { new: true }
  )
    .then((updatedJob) => {
      console.log(updatedJob);
      res.redirect("/mainpage");
    })
    .catch((error) => {
      console.log(error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

router.post("/mainpage/:id/delete", (req, res) => {
  Jobs.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/main");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
