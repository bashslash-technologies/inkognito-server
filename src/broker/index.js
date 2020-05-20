const ORMBuilder = require("./db");

module.exports = async({ DB_URI }) => {
	try {
		const ORM = await ORMBuilder({ DB_URI });
		return {
			CashoutService: require("./services/Cashouts")({ ORM }),
			CategoryService: require("./services/Categories")({ ORM }),
			OrderService: require("./services/Orders")({ ORM }),
			ProductService: require("./services/Products")({ ORM }),
			TransactionService: require("./services/Transactions")({ ORM }),
			TripService: require("./services/Trips")({ ORM }),
			UserService: require("./services/Users")({ ORM }),
		};

	}
	catch (err) {
		throw err;
	}
};
