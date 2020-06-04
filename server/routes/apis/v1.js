'use strict';

const express = require('express');

function init(io) {
	const router = express.Router();
	const {
		categoryController,
		courierController,
		orderController,
		productController,
		shopController,
		tripController,
		userController
	} = require('../../controllers/v1')(io.of('/v1'));

	router.use('/categories', categoryController);
	router.use('/couriers', courierController);
	router.use('/orders', orderController);
	router.use('/products', productController);
	router.use('/shops', shopController);
	router.use('/trips', tripController)
	router.use('/users', userController);

	return router;
}

module.exports = init;