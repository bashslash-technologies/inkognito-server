'use strict';

const mongoose = require("mongoose");
const Counter = require("./Counter");

const OrderSchema = new mongoose.Schema(
	{
		order_number: {
			type: String,
			trim: true,
		},
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true,
		},
		cart:  [{
			product: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'products',
				required: true,
			},
			quantity: {
				type: Number,
				min: 1,
			},
		}],
		delivery: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'trips',
			required: true
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
			paid: Date,
			ready: Date,
			delivered: Date,
			settled: Date,
		}
	},
	{
		timestamps: true,
	}
);

OrderSchema.pre('save', function(next) {
    Counter.findByIdAndUpdate({_id: 'orders'}, {$inc: { seq: 1} }, (err, counter) => {
        if(err){ return next(err);}
        console.log("counter", counter)
        this.orderNumber = counter.seq;
        next();
    });
});

module.exports = mongoose.model("orders", OrderSchema);
