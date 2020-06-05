'use strict';

const mongoose = require('mongoose');

<<<<<<< HEAD:src/broker/db/models/Products.js
const ProductSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
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
      min: 0,
    },
    categories: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("products", ProductSchema);
=======
const ProductSchema = new mongoose.Schema({
	shop_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'shops',
		required: true
	},
	name: {
		type: String,
		trim: true,
		required: true,
	},
	images: [{
		type: String,
	}],
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
	categories: [{
		type: mongoose.Types.ObjectId,
		ref: 'categories'
	}],
	deleted: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('products', ProductSchema);
>>>>>>> c6262b70c7ffa46cb057b3fd839a6b4b9fbe2e19:server/models/v1/Product.js
