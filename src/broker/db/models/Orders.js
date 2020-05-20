const Mongoose = require("mongoose");
const {sumBy} = require("lodash");
const CounterModel = require("./Counters");

const OrderSchema = new Mongoose.Schema(
	{
		order_number: {
			type: String,
			trim: true,
		},
		user: {
			type: Mongoose.SchemaTypes.ObjectId,
			ref: 'user',
			required: true
		},
		cart: [{
			product: {
				type: Mongoose.SchemaTypes.ObjectId,
				ref: 'product',
			},
			quantity: {
				type: Number,
				min: 1,
			},
		}],
		cost: {
			products: Number,
			delivery: Number
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
		},
		stamps: {
			created:{
				type: Date,
				default: Date.now()
			},
			paid: Date,
			delivered: Date,
			cancelled: Date,
		}
	},
	{
		timestamps: true,
	}
);

OrderSchema.virtual('cartTotal').get(function(){
	return sumby(this.cart, function(cartItem){ return cartItem.subTotal})
})

OrderSchema.virtual('status').get(function(){
	if(this.stamps){
		if(this.stamps.cancelled){
			return 'CANCELLED';
		}
		else if(this.stamps.completed){
			return 'COMPLETED';
		}
		else if(this.stamps.paid){
			return 'DELIVERY';
		}
		else{
			return 'PAYMENT'
		}
	}
	return 'N/A'
})


OrderSchema.pre('save', function(next) {
    CounterModel.findByIdAndUpdate({_id: 'order'}, {$inc: { seq: 1} }, (err, counter) => {
        if(err){ return next(err);}
        this.orderNumber = counter.seq;
        next();
    });
});

module.exports = Mongoose.model("orders", OrderSchema);
