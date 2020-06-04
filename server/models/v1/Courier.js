'use strict';

const mongoose = require('mongoose');

const CourierSchema = new mongoose.Schema({
	owner_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	vehicle_number: {
		type: String
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

module.exports = mongoose.model('couriers', CourierSchema);