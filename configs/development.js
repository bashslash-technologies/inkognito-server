'use strict';

const {toNumber} = require('lodash');

let localConfig = {
	app: {
		hostname: 'localhost',
		port: toNumber(process.env.PORT),
		secret: process.env.APP_SECRET,
		name: 'inkognito demo'
	},

	database: {
		uri: process.env.DATABASE_URI,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		name: process.env.DATABASE_NAME
	},

	storage: {
		bucket: process.env.STORAGE_BUCKET,
		region: process.env.STORAGE_REGION,
		key_id: process.env.STORAGE_KEY_ID,
		access_key:  process.env.STORAGE_ACCESS_KEY
	},

	cache: {
		host: process.env.REDIS_HOST,
		port: toNumber(process.env.REDIS_PORT),
		password: process.env.REDIS_PASSWORD
	},

	sms: {
		app_id: process.env.SMS_API_KEY,
		app_secret: process.env.SMS_API_SECRET,
		app_name: process.env.SMS_APP_NAME
	},

	payment: {
		secret_key: process.env.PAYMENT_SECRET_KEY,
		public_key: process.env.PAYMENT_PUBLIC_KEY
	},

	auth: {
		token_expiry: toNumber(process.env.AUTH_TOKEN_EXPIRY),
		reset_expiry: toNumber(process.env.AUTH_RESET_EXPIRY),
		verification_expiry: toNumber(process.env.AUTH_VERIFICATION_EXPIRY),
		locker_expiry: toNumber(process.env.AUTH_LOCKER_EXPIRY),
		locker_retries: toNumber(process.env.AUTH_LOCKER_RETRIES),
	}
};

module.exports = localConfig;
