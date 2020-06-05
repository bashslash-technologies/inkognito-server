'use strict';

const _ = require('lodash');

let courierConfig = {
	baseRate: process.env.COURIER_BASE,

	rates: _.map(process.env.COURIER_RATES.split(';'), function(courier_rate){
		let [threshold, rate] = courier_rate.split(':');
		return {
			threshold: threshold,
			rate: rate
		}
	})
};

module.exports = courierConfig;
