'use strict';

const {User, Courier} = require('../../models/v1');
const storageService = require('./storage');

async function createCourier(owner_id, {vehicle_number, certificate, certificate_number}) {
	try {
		let __user = await User.findById(owner_id);
		if(!__user) throw new Error('user not found');
		if(__user.role !== 'COURIER') throw new Error('you dont have the necessary permissions, contact admin');
		let __courier = await Courier.findOne({$or: [{vehicle_number: vehicle_number}, {certificate_number: certificate_number}]});
		if(__courier) throw new Error('courier with same details exists');
		__courier = new Courier({
			owner_id: owner_id,
			certificate: certificate,
			certificate_number: certificate_number,
			wallet: 0,
		})
		await __courier.save();
		return {
			courier: __courier,
		};
	}
	catch (err) {
		throw err;
	}
}

async function verifyCourier(admin_id, {courier_id}) {
	try {
		let __courier = await Courier.findById(courier_id);
		if(!__courier) throw new Error('courier does not exists');
		__courier.verified = true;
		await __courier.save();
		return {
			courier: __courier,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveCourier(owner_id, {courier_id}) {
	try {
		let __courier = await Courier.findOne({$or: [{_id: courier_id}, {owner_id: owner_id}]});
		if(!__courier) throw new Error('courier does not exists');
		return {
			courier: __courier,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function checkBalance(owner_id, {courier_id}) {
	try {
		let __courier = await Courier.findOne({$or: [{_id: courier_id}, {owner_id: owner_id}]});
		if(!__courier) throw new Error('account not found');
		return {
			wallet: __courier.wallet,
		};
	}
	catch (err) {
		throw err;
	}
}

async function cashOut(owner_id, {courier_id, amount}) {
	try {
		let __wallet = await Courier.findOne({_id: wallet_id, shop_id: shop_id, owner_id: owner_id});
		if(!__wallet) throw new Error('account not found');
		if(__wallet.available_balance < amount) throw new Error('insufficient balance');
		let __cashout = new Cashout({
			wallet_id: wallet_id,
			amount: amount,
		})
		// make payment initialization here
		// set payment details
		await __cashout.save();
		return {
			wallet: __wallet,
			cashout: __cashout
		};
	}
	catch (err) {
		throw err;
	}
}

module.exports = {
	createCourier: createCourier,
	verifyCourier: verifyCourier,
	retrieveCourier: retrieveCourier,
	checkBalance: checkBalance,
	cashOut: cashOut,
};