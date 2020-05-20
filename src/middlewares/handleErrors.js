const HandleError = function (err, req, res, next) {
	res
		.status(err.status || 400)
		.json({
			success: null,
			error: true,
			message: err.message,
		});
};
module.exports = HandleError;