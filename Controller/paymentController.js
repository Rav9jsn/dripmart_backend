const path = require("path");
const { envData } = require(path.join(__dirname, "..", "config"));
const asyncHandler = require(path.join(__dirname, "..", "util", "asyncHandler"));
const instance = require(path.join(__dirname, "..", "paymentConfig"));
const User = require(path.join(__dirname, "..", "model", "userSign"));

const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

exports.checkout = asyncHandler(async (req, res, next) => {
  const rawAmount = req.body.amount;

  const amount = Math.round(Number(rawAmount) * 100);

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount in request" });
  }

  const options = {
    amount: amount,
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).json({ message: "ok", order });
});

exports.paymentverify = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const result = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    envData.razorApiSecret
  );

  const getPaymentDetails = async (paymentId) => {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + btoa(`${envData.razorApi}:${envData.razorApiSecret}`),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay fetch failed: ${response.status} - ${error}`);
    }
    const data = await response.json();
    return { method: data.method, email: data.email };
  };

  if (result) {
    const status = result ? "paid" : "Failed";
    const verified = result;
    const { method, email } = await getPaymentDetails(razorpay_payment_id);
    const paymentDetails = {
      ...req.body,
      method,
      status,
      verified,
    };

    await User.savepayment(paymentDetails, email);
    res.redirect(
      `http://localhost:5173/Cart/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.redirect(`http://localhost:5173/Cart`);
  }
});

exports.getKey = asyncHandler(async (req, res) => {
  res.status(200).json({ key: envData.razorApi });
});
