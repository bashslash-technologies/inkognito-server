const { Router } = require("express");
const { uploadCertificate } = require("../../broker/utility/upload");
const multer = require("multer");
const upload = multer();

module.exports = ({ SellerService }) => {
  const router = Router();

  router.route("/").get(async (_, res) => {
    res.send("Seller routes are here");
  });
  router
    .route("/create")
    .post(upload.single("file"), uploadCertificate, async (req, res) => {
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
