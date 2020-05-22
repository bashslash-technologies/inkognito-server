const app = require("./app");
const API = require("./api");
const Broker = require("./broker");

const startServer = async() => {
	//start broker here
	try {
		const broker = await Broker({ DB_URI: process.env.DATABASE_URI });
		console.log(broker)

		app.get("/", (req, res) => {
			res.send("Working");
		});

		app.use((req, res, next)=>{
			console.log(req)
			next()
		})

		API.setup(app, broker);

		//listen on port
		const PORT = process.env.PORT || 5000;
		const subscriber = app.listen(PORT, (e) => {
			if (e) throw error;
			console.log(`Server started on ${process.env.PORT}`);
		});

		require("./subscriptions/index")(broker).listen(subscriber);
	} catch (err) {
		console.log(err);
		process.exit(0)
	}
};

startServer();
