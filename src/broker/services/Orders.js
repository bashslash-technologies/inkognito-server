const Utils = require("../utility");

const OrderService = ({ ORM }) => {
	//create an order
	const create = async (user_id, {cart, payment: {account_type, account_number, account_holder}}) => {
		try {
			let __user = await ORM.Users.findById(user_id);
			if(!__user) throw new Error("User not found")
			let __cartTotal = 0;
			let __cart = cart.map(async(item)=>{
				let __product = await ORM.Products.findById(item.product);
				if(!__product) throw new Error(`item ${item.product} does not exist`);
				__cartTotal += (__product._id * item.quantity)
				return ({
					product: __product._id,
					quantity: item.quantity,
				})
			})
			let __order = new ORM.Orders({
				user: user_id,
				cart: __cart,
				cost: {
					products: __cartTotal,
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

	//retrieve all orders
	const read = async (user_id) => {
		try {
			return await ORM.Orders.find({user: user_id});
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
		update,
		cancel
	};
};

module.exports = OrderService;
