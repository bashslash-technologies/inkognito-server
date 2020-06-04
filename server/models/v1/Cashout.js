'use strict';

const mongoose = require("mongoose");

const CashoutSchema = new mongoose.Schema(
	{
		wallet_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'wallets',
			unique: true,
			required: true,
		},
		amount: {
			type: Number,
			min: 0,
		},
		payment: {
			integration: String,
			domain: String,
			amount: Number,
			currency: String,
			source: String,
			reason: String,
			recipient: String,
			status: Boolean,
			transfer_code: String,
			id: String,
			createdAt: Date,
			updatedAt: Date
		}
	}, {
		timestamps: true
	}
);

module.exports = mongoose.model("cashouts", CashoutSchema);
