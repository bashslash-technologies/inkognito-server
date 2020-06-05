'use strict';

function apiV1Controller(io){
	return {
		categoryController: require('./categories')(io),
		courierController: require('./trip')(io),
		orderController: require('./order')(io),
		productController: require('./product')(io),
		shopController: require('./shop')(io),
		tripController: require('./courier')(io),
		userController: require('./user')(io),
	}
}

module.exports = apiV1Controller;