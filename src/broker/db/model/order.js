const Mongoose = require("mongoose");
const {sumBy} = require("lodash");
const CounterModel = require("./counter");

const OrderSchema = new Mongoose.Schema(
	{
		orderNumber: {
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
			subTotal: {
				type: Number,
			}
		}],
		payment: {
			type: Mongoose.SchemaTypes.ObjectId,
	        required:true,
			ref: 'payment'
		},
		dates: {
			orderDate:{
				type: Date,
				default: Date.now()
			},
			paidDate: Date,
			deliveredDate: Date,
		},
		status: {
			type: String,
			enum: ['PAYMENT', 'DELIVERY', 'COMPLETED', 'CANCELLED']
		},
	},
	{
		timestamps: true,
	}
);

OrderSchema.virtual('getTotalAmount').get(function(){
	return sumby(this.cart, function(cartItem){ return cartItem.subTotal})
})


OrderSchema.pre('save', function(next) {
    CounterModel.findByIdAndUpdate({_id: 'order'}, {$inc: { seq: 1} }, (err, counter) => {
        if(err){ return next(err);}
        this.orderNumber = counter.seq;
        next();
    });
});

module.exports = Mongoose.model("Order", OrderSchema);
