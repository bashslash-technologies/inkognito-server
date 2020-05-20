const mongoose = require("mongoose");
const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
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
	start: {
		point: {

		},
		time: {
			type: Date,
		}
	},
	end: {
		point: {

		},
		time: {
			type: Date,
		}
	},
	amount: {
		type: Number,
		min: 0,
	},
}, {

});

module.exports = mongoose.model("trips", TripSchema);