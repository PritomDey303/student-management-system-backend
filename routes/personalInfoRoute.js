const express = require("express");
const {
  updatePersonalInfo,
  getPersonalInfo,
  getProfilePicture,
  updateProfilePicture,
} = require("../controller/personalInfoController");
const { checkLogin } = require("../middlewares/checkLogin");
const { imgUploader } = require("../middlewares/imgUploader");
const router = express.Router();

router.post("/update", checkLogin, updatePersonalInfo);
router.get("/getpersonalinfo", checkLogin, getPersonalInfo);
router.get("/getprofilepicture", checkLogin, getProfilePicture);
router.post(
  "/updateprofilepicture",
  checkLogin,
  imgUploader,
  updateProfilePicture
);
module.exports = router;
