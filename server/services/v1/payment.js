'use strict';

const PayStack = require('paystack');

module.exports = PayStack(process.env.PAYMENT_SECRET);