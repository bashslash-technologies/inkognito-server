const { groupBy, entries, sumBy, map } = require("lodash");

const OrderService = ({ ORM }) => {
	//create an order
	const create = async (user_id, {cart, payment: {account_type, account_number, account_holder}}) => {
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
			let __order = new ORM.Orders({
				user: user_id,
				cart: map(__subcarts, '_id'),
				cost: {
					products: sumBy(__subcarts, 'cost'),
					delivery: 'unknown'
				},
				transaction: {
					account_holder,
					account_number,
					account_type
				}
			})
			await __order.save();
			return __order;
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
			let __products = await ORM.Products({vendor: user_id});
			let __product_list = __products.map((product)=>product._id)
			return await ORM.Orders.find({
				'cart.vendor': user_id,
			});
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

	return {
		create,
		read,
		readProvider,
		update,
		cancel
	};
};

module.exports = OrderService;
