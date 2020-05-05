const { Router } = require("express");

const AllRoutes = (broker) => {
  const router = Router();
  router.get("/", (req, res) => {
    res.send("Apis working");
  });

  router.use("/user", require("./user")(broker));
  router.use("/vendor", require("./seller")(broker));
  router.use("/product", require("./product")(broker));
  router.use("/rider", require("./rider")(broker));
  return router;
};

module.exports = AllRoutes;
