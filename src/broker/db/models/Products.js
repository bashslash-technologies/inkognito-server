const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
		min: 0,
	},
	categories: [{
		type: mongoose.Types.ObjectId,
		ref: 'categories'
	}],
}, {
	timestamps: true,
});

module.exports = mongoose.model('products', ProductSchema);