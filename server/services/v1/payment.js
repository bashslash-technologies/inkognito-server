'use strict';

const PayStack = require('paystack');
const config = require('../../../configs');

module.exports = PayStack(config.payment.secret_key);