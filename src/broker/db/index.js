const Mongoose = require("mongoose");
const BuildORMFromModels = require("./buildORMFromModels");
const boot = require("./boot");

//models
const ProductModel = require("./model/product");
const SellerModel = require("./model/seller");
const OrderModel = require("./model/order");
const CounterModel = require("./model/counter");
const CustomerModel = require("./model/Customer");
const RiderModel = require("./model/Rider");

const createConnection = async ({ DB_URI }) => {
	try {
		await Mongoose.connect(DB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log("Database connected successfully");
		await CounterModel.findOneAndUpdate({_id:'order'}, {} ,{ upsert: true, new: true, setDefaultsOnInsert: true });
	} catch (e) {
		throw new Error(e);
	}

	//boot system
	await boot();

	//return the models
	return {
		Product: BuildORMFromModels(ProductModel),
		Seller: BuildORMFromModels(SellerModel),
		Order: BuildORMFromModels(OrderModel),
		User: BuildORMFromModels(CustomerModel),
		Rider: BuildORMFromModels(RiderModel)
	};
};

module.exports = createConnection;
