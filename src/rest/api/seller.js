const { Router } = require("express");

module.exports = ({ SellerService }) => {
  const router = Router();

  router.route("/").get(async (req, res) => {
    res.send("Seller routes are here");
  });
  router.post("/create", async (req, res) => {
    const response = await SellerService.create(req.body);
    if (response instanceof Error) {
      return res.status(400).json({
        success: null,
        error: true,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      error: null,
      message: "Account Created successfully",
      payload: response,
    });
  });

  router.post("/login", async (req, res) => {
    const response = await SellerService.login(req.body);
    if (response instanceof Error) {
      return res.status(400).json({
        success: null,
        error: true,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      error: null,
      message: "User authenticated successfully",
      payload: response,
    });
  });

  return router;
};
