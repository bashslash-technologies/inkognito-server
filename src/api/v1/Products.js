const { Router } = require("express");
const { uploadProducts } = require("../../broker/utility/upload");
const {handleSuccess, resolveProviders} = require("../../middlewares")

module.exports = ({ ProductService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all products
		.get(resolveProviders, async (req, res, next) => {
			try{
				let result = await ProductService.read(req.user_id);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//create a product
		.post(resolveProviders, uploadProducts.array("files", 5), async (req, res, next) => {
			try{
				req.body.images = req.files.map((file) => file.location);
				let result = await ProductService.create(req.user_id, req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

		//update a product
		router.put("/:id", resolveProviders, uploadProducts.array("files", 5), async (req, res, next) => {
			try{
				let result = await ProductService.update(req.user_id, req.params.id, req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

		//update a product
		router.get("/all", async (req, res, next) => {
			try{
				let result = await ProductService.readAll();
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	//delete a product
	router.delete("/:id", resolveProviders, async (req, res, next) => {
		try{
			let result = await ProductService.destroy(req.user_id, req.params.id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	return router;
};
