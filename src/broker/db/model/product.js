const Mongoose = require("mongoose");

const ProductSchema = new Mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    images: [String],
    description: { type: String, trim: true, required: true },
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    categories: [String],
    manufacturer: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("Product", ProductSchema);
