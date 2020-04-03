const NotFound = require("../middlewares/notFound");
const UNAUTHORIZED = require("../middlewares/unAuthorized");
const HandleError = require("../middlewares/handleErrors");

exports.setup = (app, broker) => {
  app.get("/", (req, res) => {
    res.send("Index route working");
  });
  //for api routes
  app.use("/api/v1", require("./api")(broker));

  //for assets routes
  app.use("/assets", require("./assets")(broker));

  //handle 404 errors
  app.use(NotFound);

  //handle unauthorization
  app.use(UNAUTHORIZED);

  //catch errors
  app.use(HandleError);
};
