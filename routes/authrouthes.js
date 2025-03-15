const express = require("express");
const {signup,login} = require("../controller/authController");
const {loginValidation,signupValidation,validation} = require("../Validation/authValidation");
const router = express.Router();
router.post("/signup",signupValidation,validation,signup);
router.post("/login",loginValidation,validation,login);
module.exports = router;