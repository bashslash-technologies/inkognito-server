const NotFound = function (req, res, next) {
	res
		.status(400)
		.send('route not found')
};
  
  module.exports = NotFound;
  