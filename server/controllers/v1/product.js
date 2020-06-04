'use strict';

const express = require('express');
const productService = require('../../services/v1/product');
const storageService = require('../../services/v1/storage');
const { handleSuccess } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.post('/', storageService.uploadProduct().array("files", 5), async function(req, res, next) {
		try {
			req.body.images = req.files.map((file) => file.location);
			let result = await productService.createProduct(req.user_id, req.body);
			handleSuccess(res, result, 'product created successful');
		}
		catch(err) {
			next(err);
		}
	});

	router.put('/', storageService.uploadProduct().array("files", 5), async function(req, res, next) {
		try {
			if(req.files) {
				req.body.images = req.files.map((file) => file.location);
			}
			let result = await productService.updateProduct(req.user_id, req.body);
			handleSuccess(res, result, 'product details updated successfully');
		}
		catch(err) {
			next(err);
		}
	});

	router.delete('/:product_id', async function(req, res, next) {
		try {
			let result = await productService.deleteProduct(req.user_id, req.params);
			handleSuccess(res, result, 'logo updated successfully');
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/', async function(req, res, next) {
		try {
			let result = await productService.retrieveProducts(req.query);
			handleSuccess(res, result);
		}
		catch (err) {
			next(err);
		}
	});

	router.get('/shop', async function(req, res, next) {
		try {
			let result = await productService.retrieveProductsShop(req.query);
			handleSuccess(res, result);
		}
		catch (err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;