const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");

require("dotenv").config({
  path: ".env",
});

const app = Express();

//middleware for data
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//middleware for handshake
app.use(Cors());

module.exports = app;
