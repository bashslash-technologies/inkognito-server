'use strict';

const express = require('express');
const categoryService = require('../../services/v1/category');
const { handleSuccess } = require('../../middlewares');

function init(io) {
	let router = express.Router();

	router.post('/', async function(req, res, next) {
		try {
			let result = await categoryService.createCategory(req.user_id, req.body);
			handleSuccess(res, result, 'category added successful');
		}
		catch(err) {
			next(err);
		}
	});

	router.get('/', async function(req, res, next) {
		try {
			let result = await categoryService.retrieveCategories(req.user_id);
			handleSuccess(res, result);
		}
		catch(err) {
			next(err);
		}
	});

	return router;
}

module.exports = init;