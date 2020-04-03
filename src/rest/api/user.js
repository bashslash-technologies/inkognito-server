const { Router } = require("express");

module.exports = (broker) => {
  const router = Router();

  router.route("/").get(async (req, res) => {
    res.send("User routes are here");
  });

  return router;
};
