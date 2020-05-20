const NotFound = require("../middlewares/notFound");
const UNAUTHORIZED = require("../middlewares/unAuthorized");
const HandleError = require("../middlewares/handleErrors");

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
	app.use(NotFound);

	//handle unauthorization
	app.use(UNAUTHORIZED);

	//catch errors
	app.use(HandleError);
};
