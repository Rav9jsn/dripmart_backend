const express = require("express");

const favRouter = express.Router();
const favController = require("../Controller/favouritesController");
const ensurAuthentication = require("../middleware/ensurAuthentication");

favRouter.get("/", ensurAuthentication, favController.getFavourites);
favRouter.post("/:favid", ensurAuthentication, favController.addFavourites);
favRouter.put("/:favid", ensurAuthentication, favController.removeFavourite);

module.exports = favRouter;
