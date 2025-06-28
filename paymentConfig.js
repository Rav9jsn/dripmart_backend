//RazorPay Integrationh////////
const { envData } = require("./config");
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: envData.razorApi,
  key_secret: envData.razorApiSecret,
});
module.exports = instance;
