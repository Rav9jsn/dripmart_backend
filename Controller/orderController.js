const path = require("path");
const Order = require(path.join(__dirname, "..", "model", "ordermodel"));
const asyncHandler = require(path.join(__dirname, "..", "util", "asyncHandler"));


exports.saveOrder = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { amount } = req.body;
  const newOrder = new Order();
  const result = await newOrder.orderSave(email, amount);
  res.status(200).json({ result });
});
exports.getOrder = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const result = await Order.getOrders(email);
  if (result.succes) {
    const { itemsAllData, amountAndDate } = result;
    res.status(200).json({ itemsAllData, amountAndDate,succes: true });
  }else{
    const { message } = result;
    res.status(200).json({ message ,succes: false});
  }
});
