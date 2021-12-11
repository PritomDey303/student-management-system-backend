const express = require("express");
const router = express.Router();
const { studentSignUp } = require("../controller/signUpController");
const { imgUploader } = require("../middlewares/imgUploader");

router.post("/student", imgUploader, studentSignUp);
module.exports = router;
