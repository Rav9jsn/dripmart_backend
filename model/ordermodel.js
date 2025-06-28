const path = require("path");
const { ObjectId } = require("mongodb");
const { getdb } = require(path.join(__dirname, "..", "util", "databaseUtil"));
const modelErrorHandler = require(path.join(__dirname, "..", "util", "modelerrorHandle"));
const User = require(path.join(__dirname, "userSign"));

module.exports = class Order {
  constructor(userId, amount, payments, shippingAddress) {
    this.userId = userId;
    this.items = [];
    this.amount = amount;
    this.payments = payments;
    this.shippingAddress = shippingAddress;
    this.createdAt = new Date();
  }

  // Save new order to DB using user's cart and payment info
  orderSave = (email, amount) =>
    modelErrorHandler(
      async (email, amount) => {
        const db = getdb();
        const user = await db.collection("User").findOne({ email });

        // Prepare order data from user
        this.userId = user._id;
        this.items = user.cart;
        this.amount = amount;
        this.payments = user.payment;
        this.shippingAddress = user.address[0];

        // Save to "order" collection
        const res = await db.collection("order").insertOne(this);

        // Clear cart after order
        await User.clearItem(email);

        return res;
      },
      "orderSave",
      email,
      amount
    );

  // Get all orders of a user and return products + summary
  static getOrders = (email) =>
    modelErrorHandler(
      async (email) => {
        const db = getdb();
        const user = await db.collection("User").findOne({ email });

        // Find all orders for user
        const orders = await db
          .collection("order")
          .find({ userId: user._id })
          .toArray();
        const amountDate = []; // Store amount + createdAt

        if (orders.length !== 0) {
          const product = orders.map(async (orderItems) => {
            // Push amount and date
            amountDate.push({
              amount: orderItems.amount,
              date: orderItems.createdAt,
            });

            // Map each order item to product details
            const cartProductPromises = orderItems.items.map(async (fav) => {
              const products = await db
                .collection("product")
                .findOne({ _id: new ObjectId(fav.product) });
              products.quantity = Number(fav.quantity);
              return products;
            });

            const cartpro = await Promise.all(cartProductPromises);
            const cartProducts = cartpro.flat();
            return cartProducts;
          });

          const itemsData = await Promise.all(product);

          return {
            itemsAllData: itemsData.reverse(), // Reverse order to show latest first
            amountAndDate:  amountDate.reverse(),
            succes: true,
          };
        } else {
          return { message: "No Order", succes: false };
        }
      },
      "getOrders",
      email
    );
};
