const HandleError = function (err, req, res, next) {
	console.log(err.message)
	res
		.status(err.status || 200)
		.json({
			success: false,
			message: err.message,
		});
};
module.exports = HandleError;