'use strict';

const smsService = require('./sms');
const moment = require('moment');
const {padStart, random} = require('lodash');
const {User} = require('../../models/v1');
const config = require('../../../configs');

async function loginUser({ username, password, role }) {
	try {
		let __user = await User.findOne({
			$or: [{ email: username }, { phone: '233' + padStart(username, 9) }],
			role: role?role:'USER'
		});
		if (!__user) throw new Error('account not found');
		if (!__user.isVerified) {
			let __code = padStart(random(999999), 6, '0');
			let __expiry = new Date().setTime(new Date().getTime() + config.auth.verification_expiry);
			await __user.updateOne(
				{
					$set: {
						verification: {
							code: __code,
							expiry: __expiry
						},
					},
				},
				{
					new: true,
				}
			);
			smsService.sendVerification(__user.phone, code, expiry)
			throw new Error('account not verified');
		}
		if(__user.isLocked) throw new Error('sorry your account has been locked, kindly retry after ' + moment().calendar(__user.locker.expiry));
		let isValid = await __user.comparePasswords(password);
		if (!isValid) {
			const __expiry = new Date(new Date().getTime() + config.auth.reset_expiry)
			await __user.updateOne({
				$inc: {
					'locker.tries': 1,
					'expiry': __expiry,
				}
			})
			throw new Error('incorrect password');
		}
		if(__user.locker) {
			await __user.updateOne({
			 	$set: {
					'locker.tries': 0,
				}
			});
		}
		return {
			user: __user,
			token: await __user.generateAuthToken(),
		};
	}
	catch (err) {
		throw err;
	}
}

async function registerUser({ email, phone, name, password, role }) {
	try {
		let _user = await User.findOne({
			$or: [{ email }, { phone: '233' + padStart(phone, 9) }],
		});
		if (_user) throw new Error('account already exists');
		let __code = padStart(random(999999), 6, '0');
		let __expiry = new Date(new Date().getTime() + config.auth.verification_expiry);
		console.log(config.auth.verification_expiry)
		console.log(__expiry)
		let __user = new User({
			email: email,
			phone: '233' + padStart(phone, 9),
			password: password,
			name: name,
			role: role,
			verification: {
				code: __code,
				expiry: __expiry
			},
		});
		await __user.save();
		smsService.sendVerification(__user.phone, __code, __expiry);
		return {
			user: __user,
			token: await __user.generateAuthToken(),
		};
	}
	catch (err) {
		throw err;
	}
}

async function sendVerification({ username }) {
	try {
		let __user = await User.findOne({
			$or: [{ email: username }, { phone: '233' + padStart(username, 9) }],
		});
		if (!__user) throw new Error('account not found');
		let __code = padStart(random(999999), 6, '0');
		let __expiry = new Date(new Date().getTime() + config.auth.verification_expiry);
		await __user.updateOne(
			{
				$set: {
					verification: {
						code: __code,
						expiry: __expiry
					},
				},
			},
			{
				new: true,
			}
		);
		smsService.sendVerification(__user.phone, __code, __expiry)
		return true;
	}
	catch (err) {
		throw err;	
	}
}

async function verifyUser({username, code}) {
	try {
		let __user = await User.findOne({
			$or: [{ email: username }, { phone: '233' + padStart(username, 9) }],
		});
		if (!__user) throw new Error('account not found');
		if (!__user.verification) throw new Error('account already verified');
		if (new Date() > new Date(__user.verification.expiry)) {
			let __code = padStart(random(999999), 6, '0');
			let __expiry = new Date(new Date().getTime() + config.auth.verification_expiry);
			await __user.updateOne(
				{
					$set: {
						verification: {
							code: __code,
							expiry: __expiry
						},
					},
				},
				{
					new: true,
				}
			);
			smsService.sendVerification(__user.phone, __code, __expiry)
			throw new Error('reset code expired check new code');
		}
		console.log(code)
		console.log(__user.verification.code)
		if (String(__user.verification.code) !== String(code)) throw new Error('invalid code');
		await __user.updateOne(
			{
				$unset: {
					verification: 1,
				},
			},
			{
				new: true,
			}
		);
		return {
			user: __user,
			token: await __user.generateAuthToken(),
		};
	}
	catch (err) {
		throw err;
	}
}

async function sendReset({username}) {
	try {
		let __user = await User.findOne({
			$or: [{ email: username }, { phone: '233' + padStart(username, 9) }],
		});
		if (!__user) throw new Error('account not found');
		let __code = padStart(random(999999), 6, '0');
		let __expiry = new Date(new Date().getTime() + config.auth.reset_expiry);
		await __user.updateOne(
			{
				$set: {
					reset: {
						code: __code,
						expiry: __expiry
					},
				},
			},
			{
				new: true,
			}
		);
		smsService.sendReset(__user.phone, __code, __expiry)
		return true;
	}
	catch (err) {
		throw err;	
	}
}

async function verifyReset({username, code}) {
	try {
		let __user = await User.findOne({
			$or: [{ email: username }, { phone: '233' + padStart(username, 9) }],
		});
		if (!__user) throw new Error('account not found');
		if (!__user.reset) throw new Error('no reset code found');
		if (new Date() > new Date(__user.reset.expiry)) throw new Error('reset code expired');
		if (__user.reset.code !== code) throw new Error('invalid reset code');
		await __user.updateOne(
			{
				$unset: {
					reset: 1,
				},
			},
			{
				new: true,
			}
		);
		return {
			user: __user,
			token: await __user.generateAuthToken(),
		};
	}
	catch (err) {
		throw err;
	}
}

async function resetPassword(user_id, { password }) {
	try {
		let __user = await User.findById(user_id);
		if (!__user) throw new Error('account not found');
		__user.password = password;
		await __user.save();
		return {
			user: __user,
			token: await __user.generateAuthToken(),
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveUsers({ role, page, size }) {
	try {
		let query = {};
		if(role) {
			query = {role: role};
		}
		let __users = await User.find(query)
			.limit(size)
			.skip(page*size);
		return {
			users: __users,
		};
	}
	catch (err) {
		throw err;	
	}
}

module.exports = {
	loginUser: loginUser,
	registerUser: registerUser,
	sendVerification: sendVerification,
	verifyUser: verifyUser,
	sendReset: sendReset,
	verifyReset: verifyReset,
	resetPassword: resetPassword,
	retrieveUsers: retrieveUsers,
};