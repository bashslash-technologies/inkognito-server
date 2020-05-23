const paystack = require('paystack')

const PayStack = paystack(process.env.PAYMENT_SECRET);

module.exports = PayStack;