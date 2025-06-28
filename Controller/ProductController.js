const Product = require("../model/ProductModel");
const asyncHandler = require("../util/asyncHandler");
exports.getProduct = asyncHandler(async (req, res, next) => {
  const data = await Product.fetch();
  res.status(200).json({data})
});
