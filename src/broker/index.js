const ORMBuilder = require("./db");

//services
const ProductService = require("./services/productService");
const SellerService = require("./services/sellerService");

module.exports = async ({ DB_URI = "mongodb://localhost:27017/inkognito" }) => {
  try {
    const ORM = await ORMBuilder({ DB_URI });

    return {
      ProductService: ProductService({ ORM }),
      SellerService: SellerService({ ORM }),
    };
  } catch (e) {
    return new Error(e);
  }
};
