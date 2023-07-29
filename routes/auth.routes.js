const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/options", (req, res, next) => {
  res.render("../views/register/step2.hbs");
});

module.exports = router;
