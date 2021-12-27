const express = require("express");
const {
  updatePersonalInfo,
  getPersonalInfo,
} = require("../controller/personalInfoController");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();

router.post("/update", checkLogin, updatePersonalInfo);
router.get("/getpersonalinfo", checkLogin, getPersonalInfo);
module.exports = router;
