const {handleNotFound, handleErrors, handleUnAuthorized} = require("../middlewares");

exports.setup = (app, broker) => {
	app.get("/", (req, res) => {
		res.send("Index route working");
	});

	//status routes
	app.get("/api", (req, res) => {
		res.send("All Green!!!");
	});
	
	//for api routes
	app.use("/api/v1", require("./v1")(broker));

	//handle 404 errors
	app.use(handleNotFound);

	//handle unauthorization
	app.use(handleUnAuthorized);

	//catch errors
	app.use(handleErrors);
};
