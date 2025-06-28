const path = require("path");
const { getdb } = require(path.join(__dirname, "..", "util", "databaseUtil"));
const modelErrorHandler = require(path.join(__dirname, "..", "util", "modelerrorHandle"));
const { envData } = require(path.join(__dirname, "..", "config"));
const jwt = require("jsonwebtoken");
const { key } = envData;
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const saltRounds = 10;

module.exports = class User {
  constructor(name, email, password, confirmPassword, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.role = role;
    this.Favourites = [];
    this.cart = [];
    this.address = [];
  }
  // Save User data after Sign Up
  saveUserSignUp = () =>
    modelErrorHandler(async () => {
      const db = getdb();
      const emailCheck = await db
        .collection("User")
        .findOne({ email: this.email });
      if (emailCheck) {
        return { message: "email already exist", success: false };
      } else {
        this.password = await bcrypt.hash(this.password, saltRounds);
        this.confirmPassword = await bcrypt.hash(
          this.confirmPassword,
          saltRounds
        );
        await db.collection("User").insertOne(this);
        return { message: "Sign up successfuly", success: true };
      }
    }, "saveUserSignUp");
  //////////save payments after payment////////
  static savepayment = (paymentDeails, email) =>
    modelErrorHandler(
      async (paymentDeails, email) => {
        const db = getdb();
        const payment = await db
          .collection("User")
          .updateOne({ email: email }, { $set: { payment: paymentDeails } });
        return { addressHave: true, payment };
      },
      "savepayment",
      paymentDeails,
      email
    );

  ///////Save Adress//////
  static saveAddress = (adress, email) =>
    modelErrorHandler(
      async (adress, email) => {
        const db = getdb();
        const user = await db.collection("User").findOne({ email: email });
        if (user.address.length === 0) {
          await db
            .collection("User")
            .updateOne({ email: email }, { $addToSet: { address: adress } });
          return { addressHave: true };
        }
      },
      "saveAddress",
      adress,
      email
    );

  // Login User Method
  static loggedIn = (email, password) =>
    modelErrorHandler(
      async (email, password) => {
        const db = getdb();
        const user = await db.collection("User").findOne({ email: email });

        if (user) {
          const IspasswordSame = await bcrypt.compare(password, user.password);
          const jwtToken = jwt.sign(
            { email: user.email, role: user.role },
            key,
            {
              expiresIn: "24h",
            }
          );
          if (IspasswordSame) {
            const checkAdress = user.address.length === 0 ? false : true;
            return {
              message: "Logged In successfully",
              success: true,
              token: jwtToken,
              name: user.name,
              role: user.role,
              email: user.email,
              adressHave: checkAdress,
              address: user.address,
            };
          } else {
            return {
              message: "Invalid Email or Passwrod",
              success: false,
            };
          }
        } else {
          return { message: "Invalid Email and Passwrod", success: false };
        }
      },
      "loggedIn",
      email,
      password
    );

  // Add product to User Favourite List
  static addFav = (id, email) =>
    modelErrorHandler(
      async (id, email) => {
        const db = getdb();
        const product = await db.collection("product").findOne({ id: id });
        const obId = product._id;

        await db
          .collection("User")
          .updateOne({ email: email }, { $addToSet: { Favourites: obId } });
        return { title: product.title };
      },
      "addFav",
      id,
      email
    );

  // Fetch All Favourite product of user and return them favourite product
  static fetchAllFav = (email) =>
    modelErrorHandler(
      async (email) => {
        const db = getdb();
        const user = await db.collection("User").findOne({ email: email });
        const cartList = user.Favourites;
        if (cartList.length !== 0) {
          const favProductPromises = cartList.map((fav, i) =>
            db
              .collection("product")
              .find({ _id: new ObjectId(fav) })
              .toArray()
          );
          const favPro = await Promise.all(favProductPromises);
          const favProducts = favPro.flat();
          return { favProducts };
        } else {
          return { message: "No favourites product found" };
        }
      },
      "fetchAllFav",
      email
    );

  // Remove Fav item
  static removeFavProduct = (email, id) =>
    modelErrorHandler(
      async (email, id) => {
        const db = getdb();
        const product = await db.collection("product").findOne({ id: id });
        await db
          .collection("User")
          .updateOne({ email: email }, { $pull: { Favourites: product._id } });
      },
      "removeFavProduct",
      email,
      id
    );

  // Add to Cart

  static addToCart = (id, email) =>
    modelErrorHandler(
      async (id, email) => {
        const db = getdb();
        const product = await db.collection("product").findOne({ id: id });
        const result = await db
          .collection("User")
          .updateOne(
            { email, "cart.product": product._id },
            { $inc: { "cart.$.quantity": 1 } }
          );
        if (result.modifiedCount === 0) {
          await db
            .collection("User")
            .updateOne(
              { email },
              { $push: { cart: { product: product._id, quantity: 1 } } }
            );
        }
        return { title: product.title };
      },
      "addToCart",
      id,
      email
    );

  // Fetch All cart product of user and return them cart product
  static fetchAllCart = (email) =>
    modelErrorHandler(
      async (email) => {
        const db = getdb();
        const [user] = await db.collection("User").find({ email }).toArray();
        const cartList = user.cart || [];

        if (cartList.length === 0) {
          return { message: "No cart items found" };
        }

        const cartProductPromises = cartList.map(async (fav) => {
          const product = await db
            .collection("product")
            .findOne({ _id: new ObjectId(fav.product) });
          product.quantity = Number(fav.quantity);
          return product;
        });

        const cartProducts = await Promise.all(cartProductPromises);
        const totalCartPrice = cartProducts.reduce(
          (acc, item) => item.quantity * Number(item.price) + acc,
          0
        );
        const totalPrice = Number(totalCartPrice.toFixed(2));
        return { cartProducts, totalPrice };
      },
      "fetchAllCart",
      email
    );

  // Remove Fav item or Decrease quantity
  static removecartProduct = (email, id) =>
    modelErrorHandler(
      async (email, id) => {
        const db = getdb();
        const product = await db.collection("product").findOne({ id: id });
        const user = await db.collection("User").findOne({ email: email });

        const quntityCheck = user.cart.filter((item) =>
          item.product.equals(product._id)
        );

        if (quntityCheck[0] && quntityCheck[0].quantity > 0) {
          await db
            .collection("User")
            .updateOne(
              { email: email, "cart.product": product._id },
              { $inc: { "cart.$.quantity": -1 } }
            );
        } else {
          User.deletItem(email, id);
        }
      },
      "removecartProduct",
      email,
      id
    );
  // Delete cart item
  static deletItem = (email, id) =>
    modelErrorHandler(
      async (email, id) => {
        const db = getdb();
        const product = await db.collection("product").findOne({ id: id });
        await db
          .collection("User")
          .updateOne(
            { email: email, "cart.product": product._id },
            { $pull: { cart: { product: product._id } } }
          );
      },
      "deletItem",
      email,
      id
    );

  // Clear All Cart item
  static clearItem = (email) =>
    modelErrorHandler(
      async (email) => {
        const db = getdb();
        await db
          .collection("User")
          .updateOne({ email: email }, { $set: { cart: [] } });
      },
      "clearItem",
      email
    );
};
