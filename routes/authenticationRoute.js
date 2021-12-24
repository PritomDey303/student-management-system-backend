const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  keepLogin,
} = require("../controller/authenticationController");
const { checkLogin } = require("../middlewares/checkLogin");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/userValidator");

router.post("/login", login);
//router.delete("/logout", logout);
router.get("/logout", logout);
//keep login
router.get("/keeplogin", checkLogin, keepLogin);
module.exports = router;
