const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	order: {
		type: mongoose.Types.ObjectId,
		ref: 'orders',
		required: true,
	},
	amount: {
		type: Number,
		min: 0,
	},
}, {

});

module.exports = mongoose.model("transactions", TransactionSchema);