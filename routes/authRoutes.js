const express = require("express");
const { signup, signin } = require("../controller/authController");
const {
  loginValidation,
  signupValidation,
  validation,
} = require("../Validation/authValidation");
const router = express.Router();
router.post("/signup", signupValidation, validation, signup);
router.post("/signin", loginValidation, validation, signin);
module.exports = router;
