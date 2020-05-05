const ORMBuilder = require("./db");

//services
const ProductService = require("./services/productService");
const SellerService = require("./services/sellerService");
const UserService = require("./services/userServices");

module.exports = async ({ DB_URI = "mongodb://localhost:27017/inkognito" }) => {
  try {
    const ORM = await ORMBuilder({ DB_URI });

    return {
      ProductService: ProductService({ ORM }),
      SellerService: SellerService({ ORM }),
      UserService: UserService({ ORM }),
    };
  } catch (e) {
    return new Error(e);
  }
};
