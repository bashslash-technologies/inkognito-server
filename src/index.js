const app = require("./app");
const Routes = require("./rest");
const Broker = require("./broker");

const startServer = async () => {
  //start broker here
  try {
    const broker = await Broker({ DB_URI: process.env.NODE_ENV === 'development' ? process.env.DATABASE_LOCAL :  process.env.DATABASE });

    app.get("/", (req, res) => {
      res.send("Working");
    });

    Routes.setup(app, broker);

    //listen on port
    const PORT = process.env.PORT || 5000;
    const subscriber = app.listen(PORT, (e) => {
      if (e) throw error;
      console.log(`Server started on ${process.env.PORT}`);
    });

    require("./subscriptions/index")(broker).listen(subscriber);
  } catch (e) {
    throw new Error(e);
  }
};

startServer();
