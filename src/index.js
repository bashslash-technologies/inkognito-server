const app = require("./app");
const Routes = require("./rest");
const Broker = require("./broker");

const startServer = async () => {
  //start broker here
  try {
    const broker = await Broker({ DB_URI: process.env.DATABASE_LOCAL });

    app.get("/", (req, res) => {
      res.send("Working");
    });

    Routes.setup(app, broker);

    //listen on port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, (e) => {
      if (e) throw error;
      console.log(`Server started on ${process.env.PORT}`);
    });
  } catch (e) {
    throw new Error(e);
  }
};

startServer();
