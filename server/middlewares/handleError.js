'use strict';

const HandleError = function (err, req, res, next) {
	if(err.message){
		console.log(err.message)
	}else{
		console.log(err)
	}
	res
		.status(err.status || 200)
		.json({
			success: false,
			message: err.message,
		});
};
module.exports = HandleError;