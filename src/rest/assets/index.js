const { Router } = require("express");

const AllRoutes = (broker) => {
  const router = Router();
  router.get("/", (req, res) => {
    res.send("Assets working");
  });

  return router;
};

module.exports = AllRoutes;
