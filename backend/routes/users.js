const express = require("express");
const router = express.Router();
const {
  addUser,
  filterByEmail,
  filterById,
  signUpToCourse,
  deleteUserFromCourse,
  login,
  fetchUnlistedCourses,
  fetchLitedCourses,
  resetPassword,
} = require("../config/DB");

const authToken = require("../middleware/auth");

router.post("/new-user", function (req, res, next) {
  addUser(req, res);
});

router.get("/fetch-email/:email", function (req, res, next) {
  filterByEmail(req, res);
});

router.get("/fetch-id/:id", function (req, res, next) {
  filterById(req, res);
});

router.post("/course-sign-up", authToken, function (req, res, next) {
  signUpToCourse(req, res);
  // res.send("Welcome");
});

router.delete("/remove-user-from-course", authToken, function (req, res, next) {
  deleteUserFromCourse(req, res);
});

router.get("/get-unlisted-courses", authToken, function (req, res, next) {
  fetchUnlistedCourses(req, res);
});

router.get("/get-enlisted-courses", authToken, function (req, res, next) {
  fetchLitedCourses(req, res);
});

router.put("/reset-password", authToken, function (req, res, next) {
  resetPassword(req, res);
});

router.post("/login", function (req, res, next) {
  login(req, res);
});

module.exports = router;
