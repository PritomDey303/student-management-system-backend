const express = require("express");
const {
  allStudents,
  singleStudent,
  singleStudentById,
  filteredstudents,
} = require("../controller/studentsController");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();
//routes
router.get("/allstudents", checkLogin, allStudents);
router.get("/singlestudent", checkLogin, singleStudent);
router.get("/selectstudentbyid/:id", checkLogin, singleStudentById);
router.get("/filterstudents", checkLogin, filteredstudents);

module.exports = router;
