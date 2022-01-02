const express = require("express");
const {
  updateResult,
  getResult,
  getResultById,
} = require("../controller/resultController");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();

router.post("/updateresult", checkLogin, updateResult);
router.get("/getresult/:id", checkLogin, getResultById);
router.get("/getresult", checkLogin, getResult);
module.exports = router;
