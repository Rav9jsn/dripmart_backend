const express = require("express");

const cartRouter = express.Router();
const cartController = require("../Controller/cartController");
const ensurAuthentication = require("../middleware/ensurAuthentication");

cartRouter.get("/", ensurAuthentication, cartController.getCartItems);
cartRouter.post("/:prodid", ensurAuthentication, cartController.addToCartItem);
cartRouter.put("/:prodid", ensurAuthentication, cartController.removeCartItems);
cartRouter.put(
  "/deleteitem/:prodid",
  ensurAuthentication,
  cartController.deletCartItem
);
cartRouter.put("/", ensurAuthentication, cartController.clearCart);

module.exports = cartRouter;
