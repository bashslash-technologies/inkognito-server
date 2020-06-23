'use strict';

const express = require('express');
const courierService = require('../../services/v1/courier');
const storageService = require('../../services/v1/storage');
const { handleSuccess, resolveVendor, resolveAdmin } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.post('/', resolveVendor, storageService.uploadCertificate().single("certificate"), async function(req, res, next) {
		try {
			let result = await courierService.createCourier(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/', resolveVendor, async function(req, res, next) {
		try {
			let result = await courierService.retrieveCourier(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	})

	router.post('/verify', resolveAdmin, async function(req, res, next) {
		try {
			let result = await courierService.verifyCourier(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/wallet', resolveVendor, async function(req, res, next) {
		try {
			let result = await courierService.checkBalance(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.post('/cashout', resolveVendor, async function(req, res, next) {
		try {
			let result = await courierService.cashOut(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;