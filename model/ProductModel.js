const path = require("path")
const { getdb } = require(path.join(__dirname, "..", "util", "databaseUtil"));
const modelErrorHandler = require(path.join(__dirname, "..", "util", "modelerrorHandle"));
module.exports = class Product {
  static fetch = () =>
    modelErrorHandler(
      async () => {
        const db = getdb();
        return await db.collection("product").find().toArray();
      },
      "Product.fetch"
    );
};

