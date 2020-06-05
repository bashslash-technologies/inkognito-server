'use strict';

const redis = require('redis');
const config = require('../../configs');

const client = redis.createClient({
	host: config.cache.host,
	port: config.cache.port,
	password: config.cache.password
});

client.on("error", function(error) {
	console.error(error);
});

module.exports = client;