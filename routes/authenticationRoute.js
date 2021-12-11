const express = require("express");
const router = express.Router();
const { login, logout } = require("../controller/authenticationController");

router.post("/login", login);
//router.delete("/logout", logout);
router.get("/logout", logout);
module.exports = router;
