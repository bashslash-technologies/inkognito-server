const HandleSuccess = function (res, data, message) {
	res
		.status(200)
		.json({
			success: true,
			error: null,
			message: message || 'successful',
			payload: data,
		});
};

module.exports = HandleSuccess;