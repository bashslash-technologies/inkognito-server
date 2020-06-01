const { groupBy, entries, sumBy, map, uniq, sum, min } = require("lodash");
const PayStack = require("../utility/PayStack");
const haversine = require("haversine");
const Graph = require("node-dijkstra");
const mongoose = require("mongoose");

const OrderService = ({ ORM }) => {
	//create an order
	const create = async (user_id, {cart, delivery: {location, d_type}}) => {
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
					delivery: {
						location: location,
						d_type: d_type,
					},
					order: items,
					cost: sumBy(items, ({price, quantity})=>(price*quantity)),
				})
				await __suborder.save();
				__subcarts.push(__suborder);
			}

			let __delivery = await calculatePricing({
				user_location: location,
				vendors: uniq(map(__cart, 'vendor'))
			})

			let __order = new ORM.Orders({
				user: user_id,
				cart: map(__subcarts, '_id'),
				delivery: {
					d_type: d_type,
				},
				cost: {
					products: sumBy(__subcarts, 'cost'),
					delivery: __delivery[d_type]
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
			return decipherLocationVendor(user_location, __vendors);
		}
		catch (err) {
			throw err
		}
	}

	const decipherLocationVendor = (user_location, vendors) => {
		let express = sum(vendors.map(({business_location}, index)=> haversine(user_location, business_location))) * 0.5
		if (vendors.length <= 1) {
			return ({
				express: express
			})
		}
		let __paths = {
			'user': {}
		}
		vendors.map(({location, _id})=>{
			__paths['user'][_id] = haversine(user_location, location)
			__paths[_id] = {}
			__paths[_id]['user'] = haversine(user_location, location)
		})
		for (let i = 0; i < vendors.length; i++) {
			for (let j = 0; j < vendors.length; j++) {
				if (i !== j) {
					__paths[vendors[i]._id][vendors[j]._id] = haversine(vendors[i].location, vendors[j].location)
					__paths[vendors[j]._id][vendors[i]._id] = haversine(vendors[i].location, vendors[j].location)
				}
			}
		}
		const route = new Graph(__paths)
		const costs = vendors.map((vendor)=>route.path('user', vendor._id.toString(), {cost: true}).cost * 0.5)
		const standard = min(costs)
		return ({
			standard: standard,
			express: express,
		})
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
