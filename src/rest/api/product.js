const { Router } = require("express");
const { UploadProducts } = require("../../broker/utility/upload");
const multer = require("multer");
const upload = multer();

module.exports = (broker) => {
  const router = Router();

  router
    .route("/")
    .post(upload.single("file"), UploadProducts, async (req, res) => {
      res.send("Product routes are here");
    });

  return router;
};
