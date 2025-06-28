const path = require("path");
const User = require(path.join(__dirname, "..", "model", "userSign"));
const asyncHandler = require(path.join(__dirname, "..", "util", "asyncHandler"));

exports.addFavourites = asyncHandler(async (req, res, next) => {
  const Productid = Number(req.params.favid);
  const { email } = req.user;
  const { title } = await User.addFav(Productid, email);
  res.status(200).json({ message: "Added in favlist", title });
});

exports.getFavourites = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const { favProducts, message } = await User.fetchAllFav(email);
  res.status(200).json({ favProducts, message });
});
exports.removeFavourite = asyncHandler(async (req, res, next) => {
  const Productid = Number(req.params.favid);
  const { email } = req.user;
  await User.removeFavProduct(email, Productid);
  res.status(200).json({ message: "Remove From Favourites" });
});
