const path = require("path");
const asyncHandler = require(path.join(__dirname, "..", "util", "asyncHandler"));
const User = require(path.join(__dirname, "..", "model", "userSign"));


exports.addToCartItem = asyncHandler(async (req, res, next) => {
  const Productid = Number(req.params.prodid);
  const { email } = req.user;
  const { title } = await User.addToCart(Productid, email);
  res.status(200).json({ message: "Added in cart", title });
});

exports.getCartItems =asyncHandler( async (req, res, next) => {
  const { email } = req.user;
  const { cartProducts, message, totalPrice } = await User.fetchAllCart(email);
  res.status(200).json({ cartProducts, message, totalPrice });
});

exports.removeCartItems = asyncHandler(async (req, res, next) => {
  const Productid = Number(req.params.prodid);
  const { email } = req.user;
  await User.removecartProduct(email, Productid);
  res.status(200).json({ message: "Remove From cart" });
});
exports.deletCartItem = asyncHandler(async (req, res, next) => {
  const Productid = Number(req.params.prodid);
  const { email } = req.user;
  await User.deletItem(email, Productid);
  res.status(200).json({ message: "Delete item from cart" });
});
exports.clearCart = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  await User.clearItem(email);
  res.status(200).json({ message: "Clear Cart" });
});
