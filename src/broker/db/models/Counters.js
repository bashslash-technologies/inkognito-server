const mongoose = require("mongoose");

const CounterSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
			enum: ['orders', 'trips', 'transactions', 'cashouts'],
		},
		seq: {
			type: Number,
			default: 1,
		}
	}
);

module.exports = mongoose.model("counters", CounterSchema);
