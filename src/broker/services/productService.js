const Utils = require("../utility");

const ProductService = ({ ORM }) => {
  const create = async ({ name }) => {
    try {
      let product = await ORM.Product.save({
        name,
      });
      return product;
    } catch (e) {
      return new Error(e);
    }
  };
  return { create };
};

module.exports = ProductService;
