const { groupBy, entries, sumBy, map, uniq, sum, min } = require("lodash");
const PayStack = require("../utility/PayStack");
const haversine = require("haversine");
const Graph = require("node-dijkstra");
const mongoose = require("mongoose");

const OrderService = ({ ORM }) => {
	//create an order
	const create = async (user_id, {cart, payment: {account_type, account_number, account_holder}, delivery: {location, delivery_type}}) => {
		try {
			let __user = await ORM.Users.findById(user_id);
			if(!__user) throw new Error("User not found")
			let __cart = cart.map(async({
				product,
				quantity
			})=>{
				let __product = await ORM.Products.findById(product);
				if(!__product) throw new Error(`item ${product} does not exist`);
				return ({
					product: __product._id,
					vendor: __product.vendor,
					price: __product.price,
					quantity,
				})
			})
			let __subcarts = [];
			for (let [vendor, items] of entries(groupBy(__cart, 'vendor'))) {
				let __suborder = new ORM.SubOrders({
					vendor,
					order: items,
					cost: sumBy(items, ({price, quantity})=>(price*quantity)),
				})
				await __suborder.save();
				__subcarts.push(__suborder);
			}

			let __delivery = await calculatePricing({
				user_location: location,
				vendors: map(__cart, 'vendor')
			})

			let __order = new ORM.Orders({
				user: user_id,
				cart: map(__subcarts, '_id'),
				delivery: {
					d_type: delivery_type,
				}
				cost: {
					products: sumBy(__subcarts, 'cost'),
					delivery: __delivery["delivery_type"]
				}
			});
			await PayStack
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
				return __order;
			})
			.catch(function(err){
				console.log(err)
				throw new Error('cant process request now, try again later')
			})
		}
		catch (err) {
			throw err
		}
	};

	//retrieve user orders
	const read = async (user_id) => {
		try {
			return await ORM.Orders.find({user: user_id});
		}
		catch (err) {
			throw err
		}
	};

	//retrieve vendor orders
	const readProvider = async (user_id) => {
		try {
			return await ORM.SubOrders.find({vendor: user_id});
		}
		catch (err) {
			throw err
		}
	};

	//update an order
	const update = async ({params}) => {
		try {
			return;
		}
		catch (err) {
			throw err
		}
	};

	//create an order
	const cancel = async ({params}) => {
		try {
			return;
		}
		catch (err) {
			throw err
		}
	};

	const calculatePricing = async ({user_location, vendors}) => {
		try {
			let __vendors = vendors.map((vendor)=>mongoose.Types.ObjectId(vendor))
			__vendors = await ORM.Users.find({
				_id: {
					$in: __vendors
				}
			})
			if(!__vendors) throw new Error('no vendors found')
			let express = sum(__vendors.map(({location}, index)=> haversine(user_location, location))) * 0.5
			if (__vendors.length <= 1) {
				return ({
					express: express
				})
			}
			let __paths = {
				'user': {}
			}
			__vendors.map(({location, _id})=>{
				__paths['user'][_id] = haversine(user_location, location)
				__paths[_id] = {}
				__paths[_id]['user'] = haversine(user_location, location)
			})
			for (let i = 0; i < __vendors.length; i++) {
				for (let j = 0; j < __vendors.length; j++) {
					if (i !== j) {
						__paths[__vendors[i]._id][__vendors[j]._id] = haversine(__vendors[i].location, __vendors[j].location)
						__paths[__vendors[j]._id][__vendors[i]._id] = haversine(__vendors[i].location, __vendors[j].location)
					}
				}
			}
			const route = new Graph(__paths)
			const costs = __vendors.map((vendor)=>route.path('user', vendor._id.toString(), {cost: true}).cost * 0.5)
			const standard = min(costs)
			return ({
				standard: standard,
				express: express,
			})
		}
		catch (err) {
			throw err
		}
	}

	return {
		create,
		read,
		readProvider,
		update,
		cancel,
		calculatePricing
	};
};

module.exports = OrderService;
