'use strict';

const apiRoute = require('./apis');
const subscriptions = require('./subscriptions');

function init(server, io) {
	subscriptions(io).v1Subscriptions;
	server.get('*', function(req, res, next) {
		console.log('Request was made to: ' + req.originalUrl);
		return next();
	});

	server.use('/api', apiRoute(io));
	server.use('/status', function(req, res) {
		res.send('All Green!')
	})
}

module.exports = {init: init}