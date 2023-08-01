const express = require("express");
const router = express.Router();
const User = require("../models/User.model")

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
module.exports = router;


