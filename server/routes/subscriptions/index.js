'use strict';

const v1Subscriptions = require('./v1');

function init(io) {
	return {
		v1Subscriptions: v1Subscriptions(io.of('/v1')),
	};
}

module.exports = init;