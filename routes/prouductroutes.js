const express = require("express");

const productRouter = express.Router();
const productController = require("../Controller/ProductController");
const ensurAuthentication = require("../middleware/ensurAuthentication");
productRouter.get("/", ensurAuthentication, productController.getProduct);

module.exports = productRouter;
