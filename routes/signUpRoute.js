const express = require("express");
const router = express.Router();
const {
  studentSignUp,
  adminSignUp,
} = require("../controller/signUpController");
const { imgUploader } = require("../middlewares/imgUploader");

router.post("/student", imgUploader, studentSignUp);
router.post("/admin", adminSignUp);

module.exports = router;
