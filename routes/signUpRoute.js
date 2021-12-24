const express = require("express");
const router = express.Router();
const {
  studentSignUp,
  studentEmailVerificaton,
  adminEmailVerification,
  adminSignUp,
} = require("../controller/signUpController");
const { imgUploader } = require("../middlewares/imgUploader");
const { sendMail, sendVerificationMail } = require("../middlewares/nodeMailer");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/userValidator");

router.post(
  "/student",
  addUserValidators,
  addUserValidationHandler,
  imgUploader,
  studentEmailVerificaton,
  sendVerificationMail
);
router.post("/verificationstudent", studentSignUp);
router.post(
  "/admin",
  addUserValidators,
  addUserValidationHandler,
  adminEmailVerification,
  sendVerificationMail
);
router.post("/verificationadmin", adminSignUp);
module.exports = router;
