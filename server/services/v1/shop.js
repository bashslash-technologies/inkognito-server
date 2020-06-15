'use strict';

const {Shop, User} = require('../../models/v1');
const storageService = require('./storage');

async function createShop(owner_id, {name, location: {longitude, latitude}, certificate, certificate_number, description}) {
	try {
		let __user = await User.findById(owner_id);
		if(!__user) throw new Error('user not found');
		if(__user.role !== 'VENDOR') throw new Error('you dont have the necessary permissions, contact admin');
		let __shop = await Shop.findOne({name: name});
		if(__shop) throw new Error('shop with name already exists');
		__shop = new Shop({
			owner_id: owner_id,
			name: name,
			certificate: certificate,
			certificate_number: certificate_number,
			wallet: 0,
			location: {
				type: 'Point',
				coordinates: [longitude, latitude]
			}
		})
		if(description) {
			__shop.description = description
		}
		await __shop.save();
		return {
			shop: __shop,
		};
	}
	catch (err) {
		throw err;
	}
}

async function updateShop(owner_id, {shop_id, location, description}) {
	try {
		let __shop = await Shop.findOne({_id: shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('shop does not exists');
		if(location) {
			let {longitude, latitude} = location;
			__shop.location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			};
		}
		if(description) {
			__shop.description = description;
		}
		await __shop.save();
		return {
			shop: __shop,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function updateLogo(owner_id, {shop_id, logo}) {
	try {
		let __shop = await Shop.findOne({_id: shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('shop does not exists');
		if(__shop.logo) {
			storageService
				.deleteFile(__shop.logo)
				.catch(function(err) {
					console.log(err);
					throw new Error('An error occurred');
				})
		}
		__shop.logo = logo;
		await __shop.save();
		return {
			shop: __shop,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function verifyShop(admin_id, {shop_id}) {
	try {
		let __shop = await Shop.findById(shop_id);
		if(!__shop) throw new Error('shop does not exists');
		__shop.verified = true;
		await __shop.save();
		return {
			shop: __shop,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveShop(owner_id, {shop_id}) {
	try {
		let __shop = await Shop.findOne({$or: [{_id: shop_id}, {owner_id: owner_id}]});
		if(!__shop) throw new Error('shop does not exists');
		return {
			shop: __shop,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveShops(admin_id, {page, size}) {
	try {
		let __shops = await Shop.findById(shop_id)
			.limit(size)
			.skip(page*size);
		return {
			shops: __shops,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function checkBalance(owner_id, {shop_id}) {
	try {
		let __shop = await Shop.findOne({$or: [{_id: shop_id}, {owner_id: owner_id}]});
		if(!__shop) throw new Error('shop not found');
		return {
			wallet: __shop.wallet,
		};
	}
	catch (err) {
		throw err;
	}
}

async function cashOut(owner_id, {shop_id, amount}) {
	try {
		let __wallet = await Shop.findOne({_id: wallet_id, shop_id: shop_id, owner_id: owner_id});
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

async function myShops(owner_id) {
	try {
		let __shops = await Shop.find({owner_id: owner_id});
		return {
			shops: __shops
		};
	}
	catch (err) {
		throw err;
	}
}

module.exports = {
	createShop: createShop,
	updateShop: updateShop,
	updateLogo: updateLogo,
	retrieveShop: retrieveShop,
	retrieveShops: retrieveShops,
	verifyShop: verifyShop,
	checkBalance: checkBalance,
	cashOut: cashOut,
	myShops: myShops
};