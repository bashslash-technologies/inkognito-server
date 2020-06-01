const mongoose = require("mongoose");

const SubOrderSchema = new mongoose.Schema(
	{
		vendor: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true,
		},
		order: [{
			product: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'products',
				required: true,
			},
			quantity: {
				type: Number,
				min: 1,
			},
		}],
		delivery: {
			trip: {
				type: mongoose.Types.ObjectId,
				ref: "trips",
			},
			location: {
				longitude: String,
				latitude: String,
			},
			d_type: {
				type: String,	
			}
		},
		cost: {
			type: Number,
			min: 0,
		},
		processed: {
			type: Boolean,
			default: false,
		},
		delivered: {
			type: Boolean,
			default: false,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("suborders", SubOrderSchema);
