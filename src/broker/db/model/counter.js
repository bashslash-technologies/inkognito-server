const Mongoose = require("mongoose");

const CountersSchema = new Mongoose.Schema(
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

module.exports = Mongoose.model("counters", CountersSchema);
