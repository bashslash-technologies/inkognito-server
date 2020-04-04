const { Router } = require("express");
const { UploadProducts } = require("../../broker/utility/upload");
const multer = require("multer");
const upload = multer();

const breakError = (data, res) => {
  if (data instanceof Error)
    return res.status(400).json({
      ok: false,
      data: undefined,
      error: data.message,
    });
  res.status(200).json({
    ok: true,
    data: data,
    error: undefined,
  });
};

module.exports = (broker) => {
  const router = Router();
  router
    .route("/")
    .get(async (req, res) => {
      let products = await broker.ProductService.readAll();
      return breakError(products, res);
    })
    .post(upload.array("images", 5), UploadProducts, async (req, res) => {
      try {
        let product = await broker.ProductService.create(req.body);
        return breakError(product, res);
      } catch (e) {
        throw new Error(e);
      }
    });

  router.patch("/:id", async (req, res) => {
    let product = await broker.ProductService.update(req.params.id, req.body);
    return breakError(product, res);
  });

  router.delete("/:id", async (req, res) => {
    let product = await broker.ProductService.deleteProduct(req.params.id);
    return breakError(product, res);
  });

  return router;
};
