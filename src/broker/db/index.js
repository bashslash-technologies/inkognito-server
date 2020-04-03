const Mongoose = require("mongoose");
const BuildORMFromModels = require("./buildORMFromModels");
const boot = require("./boot");

//models
const ProductModel = require("./model/product");

const createConnection = async ({ DB_URI }) => {
  try {
    await Mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (e) {
    throw new Error(e);
  }

  //boot system
  await boot();

  //return the models
  return {
    Product: BuildORMFromModels(ProductModel),
  };
};

module.exports = createConnection;
