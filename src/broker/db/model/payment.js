const Mongoose = require("mongoose");

const PaymentSchema = new Mongoose.Schema(
	{
		_id: {
			type: String,
			unique: true,
			required: true,
			enum: ['order'],
		},
		seq: {
			type: Number,
			default: 1,
		}
	}
);

module.exports = Mongoose.model("payment", PaymentSchema);
