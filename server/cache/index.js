'use strict';

const redis = require("redis");
const client = redis.createClient({
	password: "codeine"
});

module.exports = client;