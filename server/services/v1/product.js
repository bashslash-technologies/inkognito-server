'use strict';

const {Product, Shop} = require('../../models/v1');
const storageService = require('./storage');
const mongoose = require('mongoose');

async function createProduct(owner_id, {shop_id, name, images, price, description, categories}) {
	try {
		console.log(shop_id)
		console.log(owner_id)
		let __shop = await Shop.findOne({_id: shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('Shop does not exists');
		let __product = await Product.findOne({name: name, shop_id: shop_id});
		if(__product) throw new Error('Product already exists');
		__product = new Product({
			shop_id: shop_id,
			name: name,
			images: images,
			price: price,
			description: description,
			stock: 0
		})
		if(categories) {
			__product.categories = categories;
		}
		await __product.save();
		return {
			product: __product,
		};
	}
	catch (err) {
		throw err;
	}
}

async function updateProduct(owner_id, {product_id, images, description, categories, name}) {
	try {
		let __product = await Product.findById(product_id);
		if(!__product) throw new Error('Product does not exists');
		let __shop = await Shop.findOne({_id: __product.shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('you are not authorised');
		if(name) {
			__product.name = name;
		}
		if(description) {
			__product.description = description;
		}
		if(images) {
			storageService
				.deleteFiles(__product.images)
				.then(function(data) {
					__product.images = images;
				})
				.catch(function(err) {
					throw new Error('product update failed, try later');
				})
		}
		if(categories) {
			__product.categories = categories;
		}
		await __product.save();
		return {
			product: __product,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function deleteProduct(owner_id, {product_id}) {
	try {
		let __product = await Product.findById(product_id);
		if(!__product) throw new Error('Product does not exists');
		let __shop = await Shop.findOne({_id: __product.shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('you are not authorised');
		await __product.updateOne({
			$set: {
				deleted: true,
			}
		});
		return true;
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveProductsShop({shop_id}, {page, size}) {
	try {
		let __shop = await Shop.findById(shop_id);
		if(!__shop) throw new Error('shop does not exist');
		let __products = await Product.find({shop_id: shop_id, deleted: false})
			.skip(page*size)
			.limit(size);
		return {
			products: __products,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveProducts({page, size, category}) {
	try {
		let __products = [];
		if(category) {
			__products = await Product.find({deleted: false, categories: category})
				.skip(page*size)
				.limit(size);
		}
		else {
			__products = await Product.find({deleted: false})
				.skip(page*size)
				.limit(size);
		}
		return {
			products: __products,
		};
	}
	catch (err) {
		throw err;	
	}
}

module.exports = {
	createProduct: createProduct,
	updateProduct: updateProduct,
	deleteProduct: deleteProduct,
	retrieveProductsShop: retrieveProductsShop,
	retrieveProducts: retrieveProducts
};