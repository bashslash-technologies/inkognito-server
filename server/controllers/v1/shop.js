'use strict';

const express = require('express');
const shopService = require('../../services/v1/shop');
const storageService = require('../../services/v1/storage');
const { handleSuccess, resolveVendor } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.post('/', storageService.uploadCertificate().single("certificate"), resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.createShop(req.user_id, req.body);
			handleSuccess(res, result, 'shop created successful');
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/', async function(req, res, next) {
		try {
			let result = await shopService.retrieveShops(req.user_id, req.query);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/shop/:shop_id', resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.retrieveShop(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.put('/', resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.updateShop(req.user_id, req.body);
			handleSuccess(res, result, 'shop details updated successfully');
		}
		catch(err) {
			next(err);
		}
	});

	router.put('/logo', storageService.uploadLogo().single('logo'), resolveVendor, async function(req, res, next) {
		try {
			req.body.logo = req.file.location;
			let result = await shopService.updateLogo(req.user_id, req.body);
			handleSuccess(res, result, 'logo updated successfully');
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/wallet', resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.checkBalance(req.user_id, req.params);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/me', resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.myShops(req.user_id);
			handleSuccess(res, result);
		}
		catch (err) {
			next(err);
		}
	});

	router.post('/cashout', resolveVendor, async function(req, res, next) {
		try {
			let result = await shopService.cashOut(req.user_id, req.body);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;