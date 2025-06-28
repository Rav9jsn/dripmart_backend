const express = require("express");

const authRouter = express.Router();
const authController = require("../Controller/authController");
const ensurAuthentication = require("../middleware/ensurAuthentication");
const {
  signupValidation,
  validationCheck,
} = require("../middleware/authMiddleware");

authRouter.post(
  "/signup",
  signupValidation,
  validationCheck,
  authController.CreateAccount
);
authRouter.post(
  "/login",
  authController.loggedAccount
);
authRouter.post(
  "/saveadress",
  ensurAuthentication,
  authController.saveAdresss
);

module.exports = authRouter;
