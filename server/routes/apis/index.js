'use strict';

const express = require('express');

function init(io) {
	let router = express.Router();

	router.use('/v1', require('./v1')(io));

	return router;
}

module.exports = init;