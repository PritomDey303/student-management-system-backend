const express = require("express");
const {
  getPendingAdmins,
  approveAdmin,
  declineAdmin,
} = require("../controller/adminController");
const router = express.Router();

router.get("/adminpendingrequest", getPendingAdmins);
router.put("/approveadmin/:id", approveAdmin);
router.delete("/declineadmin/:id", declineAdmin);
module.exports = router;
