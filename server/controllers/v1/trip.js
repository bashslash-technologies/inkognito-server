'use strict';

const express = require('express');
const tripService = require('../../services/v1/trip');
const { handleSuccess } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.get('/', async function(req, res, next) {
		try {
			let result = await tripService.retrieveTrips(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/open', async function(req, res, next) {
		try {
			let result = await tripService.retrieveOpenTrips(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/courier', async function(req, res, next) {
		try {
			let result = await tripService.retrieveCourierTrips(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/accept/:trip_id', async function(req, res, next) {
		try {
			let result = await tripService.acceptTrip(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/start/:trip_id', async function(req, res, next) {
		try {
			let result = await tripService.startTrip(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/end/:trip_id', async function(req, res, next) {
		try {
			let result = await tripService.endTrip(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;