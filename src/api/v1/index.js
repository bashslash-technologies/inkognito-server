const { Router } = require("express");

const v1_routes = (broker) => {
	const router = Router();

	router.get("/", (req, res) => {
		res.send("API v1 working");
	});

	router.use("/cashouts", require("./Cashouts")(broker));
	router.use("/categories", require("./Categories")(broker));
	router.use("/orders", require("./Orders")(broker));
	router.use("/products", require("./Products")(broker));
	router.use("/transactions", require("./Transactions")(broker));
	router.use("/trips", require("./Trips")(broker));
	router.use("/users", require("./Users")(broker));
	
	return router;
};

module.exports = v1_routes;
