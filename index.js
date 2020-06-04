'use strict';

require("dotenv").config({
	path: ".env",
});

const server = require('./server')();
const config = require('./configs');

server.create(config);
server.start();
