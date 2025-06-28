const { body, validationResult } = require("express-validator");

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password must match password"),

  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];

const validationCheck = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


module.exports = {
  signupValidation,
  validationCheck
}