const express = require("express");
const {
  Halls,
  Semesters,
  Sessions,
} = require("../controller/academcInfoController");
const router = express.Router();

router.get("/halls", Halls);
router.get("/semesters", Semesters);
router.get("/sessions", Sessions);
module.exports = router;
