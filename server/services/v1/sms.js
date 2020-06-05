'use strict'

const wittyflow = require('wittyflow');
const {smsTemplate} = require('../../templates');
const config = require('../../../configs');

wittyflow.config({
	application_id: config.sms.app_id,
	application_secret: config.sms.app_secret,
	senderName: config.sms.app_name,
})

async function sendVerification(phone, code, expiry) {
	wittyflow.sendMessage(
		phone,
		smsTemplate.verificationTemplate.replace('CODE', code).replace('EXPIRY', expiry)
	)
	.then((sus) => {
		console.log(sus);
	})
	.catch((err) => {
		console.log(err);
	});
}

async function sendReset(phone, code, expiry) {
	wittyflow.sendMessage(
		phone,
		smsTemplate.resetTemplate.replace('CODE', code).replace('EXPIRY', expiry)
	)
	.then((sus) => {
		console.log(sus);
	})
	.catch((err) => {
		console.log(err);
	});
}

module.exports = {
	sendReset: sendReset,
	sendVerification: sendVerification
};
