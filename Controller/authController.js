const path = require("path");
const asyncHandler = require(path.join(__dirname, "..", "util", "asyncHandler"));
const User = require(path.join(__dirname, "..", "model", "userSign"));


exports.CreateAccount = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  const user = new User(name, email, password, confirmPassword, role);
  const result = await user.saveUserSignUp();
  if (!result.success) {
    return res.status(409).json({ message: result.message, success: false });
  }
  res
    .status(201)
    .json({ message: "User registered successfully", success: true });
});
exports.loggedAccount =asyncHandler( async (req, res, next) => {
  const { email, password } = req.body;

  const result = await User.loggedIn(email, password);
  if (result.success) {
    return res.status(201).json(result);
  }
  res.status(201).json({ message: result.message, success: result.success });
});
exports.saveAdresss = asyncHandler(async (req, res) => {
  const {  address } = req.body;
  const {  email } = req.user;
  const result = await  User.saveAddress(address ,email)
  res.status(201).json({ message: 'adress Save',success:true,address });
});
