'use strict';

const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
	owner_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	name: {
		type: String,
		required: true
	},
	logo: {
		type: String,
	},
	description: {
		type: String
	},
	location: {
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
	certificate: {
		type: String
	},
	certificate_number: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false
	},
	wallet: {
		available_balance: {
			type: Number,
			min: 0,
			default: 0
		},
		current_balance: {
			type: Number,
			min: 0,
			default: 0
		},
		history_balance: {
			type: Number,
			min: 0,
			default: 0
		}
	}
}, {
	timestamps: true
});

ShopSchema.index({ "location": "2dsphere" });

module.exports = mongoose.model('shops', ShopSchema);