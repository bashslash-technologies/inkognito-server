"use strict";

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "shops",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "categories",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", ProductSchema);
