'use strict';

const _ = require('lodash');
const {Order, Shop, Product, User, Trip} = require('../../models/v1');
const locationService = require('./location');
const paymentService = require('./payment');

async function createOrder(user_id, {cart, location: {longitude, latitude}, delivery_type}) {
	try {
		let __user = await User.findById(user_id);
		if(!__user) throw new Error("account not found")
		let __cart = cart.map(async({
			product,
			quantity
		})=>{
			let __product = await Product.findById(product)
				.populate('shop_id')
				.execPopulate();
			if(!__product) throw new Error(`item ${product} does not exist`);
			return ({
				product: __product._id,
				shop: __product.shop_id,
				price: __product.price,
				quantity,
			})
		})
		let [longitude_a, latitude_a] = __cart[0].shop.location.coordinates;
		let __delivery_cost = locationService.calculatePricing({longitude, latitude}, {longitude_a, latitude_a})
		let __delivery = new Trip({
			start_point: {
				type: 'Point',
				coordinates: [longitude_a, latitude_a]
			},
			end_point: {
				type: 'Point',
				coordinates: [longitude, latitude]
			},
			price: __delivery_cost[delivery_type]
		})
		let __order = new Order({
			user_id: user_id,
			cart: __cart,
			delivery: __delivery._id,
			cost: {
				delivery: __delivery_cost,
				products: _.sumBy(__cart, function({price, quantity}) {
					return price * quantity;
				})
			}
		})
		__delivery.order_id = __order._id;
		await paymentService
			.transaction
			.initialize({
				email: __user.email,
				name: __user.name,
				amount: __order.cost.products + __order.cost.delivery,
				reference: __order._id,
			})
			.then(async function(result){
				if(!result.status){
					throw new Error("an error occurred")
				}
				__order.payment = {
					authorization_url: result.data.authorization_url,
					reference: result.data.reference,
					access_code: result.data.access_code,
				};
				await __order.save();
				//alert vendor here
				await __delivery.save();
				return {
					order: __order,
					shop: __cart[0].shop._id
				};
			})
			.catch(function(err){
				console.log(err)
				throw new Error('cant process request now, try again later')
			})
	}
	catch (err) {
		throw err;
	}
}

// talk about this later
async function updateOrder(owner_id, {product_id, images, description, categories, name}) {
	try {
		let __product = await Order.findById(product_id);
		if(!__product) throw new Error('Order does not exists');
		let __shop = await Shop.findOne({_id: __product.shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('you are not authorised');
		if(name) {
			__product.name = name;
		}
		if(description) {
			__product.description = description;
		}
		if(images) {
			__product.images = images;
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

async function updateOrderReady(owner_id, {order_id, shop_id}) {
	try {
		let __shop = await Shop.find({_id: shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('shop does not exist');
		let __products = await Product.find({shop_id: shop_id});
		let __order = await Order.findOne({_id: order_id, 'cart.product': {$in: _.map(__products, '_id')}});
		if(!__order) throw new Error('order not found');
		__order.ready = new Date();
		let __trip = await Trip.findById(__order.delivery);
		__trip.ready =  true;
		await __trip.save();
		await __order.save();
		return {
			order: __order,
			trip: __trip,
		};
	}
	catch (err) {
		throw err;	
	}
}

/*
async function deleteOrder(owner_id, {product_id}) {
	try {
		let __product = await Order.findById(product_id);
		if(!__product) throw new Error('Order does not exists');
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
*/

async function retrieveOrdersShop(owner_id, {shop_id, page, size}) {
	try {
		let __shop = await Shop.find({_id: shop_id, owner_id: owner_id});
		if(!__shop) throw new Error('shop does not exist');
		let __products = await Product.find({shop_id: shop_id});
		let __orders = await Order.find({shop_id: shop_id, 'cart.product': {$in: _.map(__products, '_id')}})
			.skip(page*size)
			.limit(size);
		return {
			orders: __orders,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveOrdersUser(user_id, {page, size}) {
	try {
		let __orders = await Order.find({user_id: user_id})
			.skip(page*size)
			.limit(size);
		return {
			orders: __orders,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function retrieveOrders(admin_id, {page, size}) {
	try {
		let __orders = await Order.find({})
			.skip(page*size)
			.limit(size);
		return {
			orders: __orders,
		};
	}
	catch (err) {
		throw err;	
	}
}

async function calculateDelivery(user_id, {user_location, shop_ids}) {
	try {
		let __shop = await Shop.findById(shop_ids[0]);
		let [longitude, latitude] = __shop.location.coordinates;
		let __prices = locationService.calculatePricing(user_location, {longitude, latitude})
		return {
			prices: __prices,
		};
	}
	catch (err) {
		throw err;	
	}
}

module.exports = {
	createOrder: createOrder,
	updateOrder: updateOrder,
	updateOrderReady: updateOrderReady,
	retrieveOrdersShop: retrieveOrdersShop,
	retrieveOrdersUser: retrieveOrdersUser,
	calculateDelivery: calculateDelivery,
	retrieveOrders: retrieveOrders
};