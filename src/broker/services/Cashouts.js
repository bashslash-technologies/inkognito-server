const Utils = require("../utility");

const CashoutService = ({ ORM }) => {

	//request a cashout
	const create = async (user_id, {amount, payment: {account_type, account_number, account_holder}}) => {
		try {
			let __user = await ORM.Users.findById(user)
			if(!__user) throw new Error("useer not found")
			let __cashout = new ORM.Cashouts({
				user: user_id,
				amount,
				transaction: {
					reference: new Date().getTime(),
					account_type,
					account_number,
					account_holder,
				}
			})
			await __cashout.save()
			return __cashout;
		}
		catch (err) {
			throw err
		}
	};

	//retrieve all cashouts
	const read = async (user_id) => {
		try {
			return await ORM.Cashouts.find({user: user_id});
		}
		catch (err) {
			throw err
		}
	};

	//update a cashout
	const update = async (cashout_id, {something}) => {
		try {
			return await ORM.Cashouts.findById(cashout_id);
		}
		catch (err) {
			throw err
		}
	};

	return {
		read,
		create,
		update
	};
};

module.exports = CashoutService;
