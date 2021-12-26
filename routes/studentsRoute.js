const express = require("express");
const {
  allStudents,
  singleStudent,
  singleStudentById,
  filteredstudents,
  loggedInStudent,
  approveStudent,
  declineStudent,
  getPendingStudents,
} = require("../controller/studentsController");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();
//routes
router.get("/allstudents", checkLogin, allStudents);
router.get("/loggedinstudent", checkLogin, loggedInStudent);
router.get("/selectstudentbyid/:id", checkLogin, singleStudentById);
router.get("/filterstudents", checkLogin, filteredstudents);
router.get("/pendingstudents", getPendingStudents);
router.put("/approvestudent/:id", approveStudent);
router.delete("/declinestudent/:id", declineStudent);

module.exports = router;
