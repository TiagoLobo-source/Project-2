const express = require("express");
const router = express.Router();

router.get("/main", (req, res, next) => {
  res.render("../views/main.hbs");
});

module.exports = router;