const Utils = require("../utility");

const UserService = ({ ORM }) => {
	//create a transaction
	const create = async ({params}) => {
		try {
			return;
		}
		catch (err) {
			throw err
		}
	};

	//retrieve all transactions
	const retrieve = async ({params}) => {
		try {
			return;
		}
		catch (err) {
			throw err
		}
	};

	//update a transaction
	const update = async ({params}) => {
		try {
			return;
		}
		catch (err) {
			throw err
		}
	};

	//cancel a transaction
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
		retrieve,
		update,
		cancel,
	};
};

module.exports = UserService;
