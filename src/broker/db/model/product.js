const Mongoose = require("mongoose");

const ProductSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("Product", ProductSchema);
