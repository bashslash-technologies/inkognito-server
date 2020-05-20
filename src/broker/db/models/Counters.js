const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			unique: true,
			required: true,
			enum: ['order', 'payment', 'cashout'],
		},
		seq: {
			type: Number,
			default: 1,
		}
	}
);

module.exports = mongoose.model("counters", CounterSchema);
