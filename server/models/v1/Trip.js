'use strict';

const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
	courier_id: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
	},
	order_id: {
		type: mongoose.Types.ObjectId,
		ref: 'orders',
	},
	start_point: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	end_point: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	start_time: {
		type: Date
	},
	end_time: {
		type: Date
	},
	price: {
		type: Number,
		min: 0,
	},
	ready: {
		type: Boolean,
		default: false,
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("trips", TripSchema);