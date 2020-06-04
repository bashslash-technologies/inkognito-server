'use strict';

const HandleSuccess = function (res, data, message) {
	res
		.status(200)
		.json({
			success: true,
			message: message || 'successful',
			payload: data,
		});
};

module.exports = HandleSuccess;