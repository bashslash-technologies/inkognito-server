const { groupBy, entries, sumBy, map } = require("lodash");
const PayStack = require("../utility/PayStack");

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
				}
			});
			await PayStack
			.transaction
			.initialize({
				email: __user.email,
				name: __user.name,
				amount: __order.cost,
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
			return await ORM.SubOrders({vendor: user_id});
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
