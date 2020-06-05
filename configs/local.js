'use strict';

let localConfig = {
	app: {
		hostname: 'localhost',
		port: process.env.PORT,
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
		port: process.env.REDIS_PORT,
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
		token_expiry: process.env.TOKEN_EXPIRY,
		reset_expiry: process.env.RESET_EXPIRY,
		verification_expiry: process.env.VERIFICATION_EXPIRY,
		locker_expiry: process.env.LOCKER_EXPIRY,
		locker_retries: process.env.LOCKER_RETRIES,
	}
};

module.exports = localConfig;
