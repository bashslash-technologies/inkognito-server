'use strict';

const _ = require('lodash');
const env = process.env.NODE_ENV || 'local';
const envConfig = require('./' + env);
const courierConfig = require('./courier')

let defaultConfig = {env: env};

module.exports = _.merge(defaultConfig, _.merge(envConfig, courierConfig));