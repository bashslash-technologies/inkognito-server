'use strict'

const wittyflow = require('wittyflow');
const {smsTemplate} = require('../../templates')

wittyflow.config({
	application_id: process.env.SMS_API_KEY,
	application_secret: process.env.SMS_API_SECRET,
	senderName: process.env.SMS_APP_NAME
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
