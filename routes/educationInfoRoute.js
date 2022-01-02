const express = require("express");
const {
  getEducationInfo,
  updateEducationInfo,
} = require("../controller/educationInfoController");
const { checkLogin } = require("../middlewares/checkLogin");
const { get } = require("./personalInfoRoute");
const router = express.Router();

router.get("/geteducationinfo", checkLogin, getEducationInfo);
router.post("/update", checkLogin, updateEducationInfo);
module.exports = router;
