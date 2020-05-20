const { Router } = require("express");
const { uploadProducts } = require("../../broker/utility/upload");
const handleSuccess = require("../../middlewares/handleSuccess")
const multer = require("multer");

module.exports = ({ ProductService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all products
		.get(async (req, res, next) => {
			try{
				let result = await ProductService.read();
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//create a product
		.post(uploadProducts.array("files", 5), async (req, res, next) => {
			try{
				req.body.images = req.files.map((file) => file.location);
				let result = await ProductService.create(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	//update a product
	router.put("/:id", uploadProducts.array("files", 5), async (req, res, next) => {
		try{
			let result = await ProductService.update(req.params.id, req.body);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	//delete a product
	router.delete("/:id", async (req, res, next) => {
		try{
			let result = await ProductService.destroy(req.params.id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	return router;
};
