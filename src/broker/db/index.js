const Mongoose = require("mongoose");
const boot = require("./boot");

const createConnection = async ({ DB_URI }) => {
	try {
		await Mongoose.connect(DB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log("Database connected successfully");
		await require("./models/Counters").findOneAndUpdate({_id:'order'}, {} ,{ upsert: true, new: true, setDefaultsOnInsert: true });
	} catch (e) {
		throw new Error(e);
	}

	//boot system
	await boot();

	//return the models
	return {
		Cashouts: require("./models/Cashouts"),
		Categories: require("./models/Categories"),
		Counters: require("./models/Counters"),
		Orders: require("./models/Orders"),
		Products: require("./models/Products"),
		Transactions: require("./models/Transactions"),
		Trips: require("./models/Trips"),
		Users: require("./models/Users"),
	};
};

module.exports = createConnection;
