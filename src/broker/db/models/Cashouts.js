const mongoose = require("mongoose");
const mongoose = require("mongoose");

const CashoutSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	amount: {
		type: Number,
		min: 10,
		required: true
	},
	status: {
		type: String,
		enum: ['PENDING', 'PAID'],
		default: 'PAID',
		required: true
	},
	stamps: {
		created:{
			type: Date,
			default: Date.now()
		},
		completed: Date,
	},
	transaction: {
		reference: String,
		account_type: {
			type: String,
			enum: ['AIRTEL', 'MTN', 'VODAFONE']
		},
		account_number: {
			type: String,
		},
		account_holder: String
	}
}, {
	timestamps: true,
});

CashoutSchema.virtual('status').get(function(){
	if(this.stamps){
		if(this.stamps.completed){
			return 'COMPLETED';
		}
		else{
			return 'PAYMENT'
		}
	}
	return 'N/A'
})

module.exports = mongoose.model("cashouts", CashoutSchema);