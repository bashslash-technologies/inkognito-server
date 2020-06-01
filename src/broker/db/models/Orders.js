const mongoose = require("mongoose");
const {sumBy} = require("lodash");
const CounterModel = require("./Counters");

const OrderSchema = new mongoose.Schema(
	{
		order_number: {
			type: String,
			trim: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true,
		},
		cart: [{
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'suborders',
			required: true,
		}],
		delivery: {
			d_type: {
				type: String,
				required: true
			}
		},
		cost: {
			products: {
				type: Number,
				min: 0,
			},
			delivery: {
				type: Number,
				min: 0,
			}
		},
		payment: {
			authorization_url: String,
			access_code: String,
			reference: String
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

module.exports = mongoose.model("orders", OrderSchema);
