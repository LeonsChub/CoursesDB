var express = require("express");
var router = express.Router();
const { getAllSubjectsDetailed } = require("../config/DB");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/fetch-subjects", function (req, res, next) {
  getAllSubjectsDetailed()
    .then((subjects) => res.send(subjects[0]))
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
