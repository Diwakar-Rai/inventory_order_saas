const express = require("express");

const authController = require("../controllers/auth.controller");
const {
  loginValidator,
  registerValidator,
} = require("../validators/auth.validator");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);

router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authenticate, authController.logout);
module.exports = router;
