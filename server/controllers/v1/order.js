'use strict';

const express = require('express');
const orderService = require('../../services/v1/order');
const locationService = require('../../services/v1/location');
const { handleSuccess } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.post('/', async function(req, res, next) {
		try {
			let result = await orderService.createOrder(req.user_id, req.body);
			io.emit(result.shop + '-adwuma-aba', result.order)
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/ready', async function(req, res, next) {
		try {
			let result = await orderService.updateOrderReady(req.user_id, req.body);
			let [longitude, latitude] = result.trip.start_point.coordinates;
			let couriers = locationService.getFence({longitude: longitude, latitude: latitude});
			couriers.forEach(function({courier_id}) {
				io.emit(courier_id + '-galamsey_woha', result.trip);
			})
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.put('/', async function(req, res, next) {
		try {
			let result = await orderService.updateOrder(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/', async function(req, res, next) {
		try {
			let result = await orderService.retrieveOrders(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/user', async function(req, res, next) {
		try {
			let result = await orderService.retrieveOrdersUser(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/shop', async function(req, res, next) {
		try {
			let result = await orderService.retrieveOrdersShop(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/pricing', async function(req, res, next) {
		try {
			let result = await orderService.calculateDelivery(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;