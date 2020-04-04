const { unlink } = require("fs");

const ProductService = ({ ORM }) => {
  const create = async ({
    name,
    description,
    size,
    color,
    categories,
    manufacturer,
    images,
  }) => {
    try {
      let product = await ORM.Product.save({
        name,
        images,
        description,
        size,
        color,
        categories,
        manufacturer,
      });
      return product;
    } catch (e) {
      return new Error(e);
    }
  };

  const readAll = async () => {
    try {
      let products = await ORM.Product.find({});
      return products;
    } catch (e) {
      return new Error(e);
    }
  };

  const update = async (
    _id,
    { name, description, size, color, categories, manufacturer }
  ) => {
    try {
      let product = await ORM.Product.findById(_id);
      if (!product) return new Error("Product not found");
      await product.updateOne({
        $set: {
          name,
          description,
          size,
          categories,
          color,
          manufacturer,
        },
      });
      return product;
    } catch (e) {
      return new Error(e);
    }
  };

  const deleteProduct = async (_id) => {
    try {
      let product = await ORM.Product.findById(_id);
      if (!product) return new Error("Product not found");
      console.log(product.images.length);
      //delete the product images
      for (let i = 0; i < product.images.length; i++) {
        unlink(
          `${__dirname}/../../uploads/products/${product.images[i]}`,
          (err) => {
            if (err) return new Error(err);
          }
        );
      }

      await product.delete();
      return true;
    } catch (e) {
      return new Error(e);
    }
  };
  return { create, readAll, update, deleteProduct };
};

module.exports = ProductService;
