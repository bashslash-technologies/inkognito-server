const { Router } = require("express");
const handleSuccess = require("../../middlewares/handleSuccess");

module.exports = ({ OrderService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all orders
		.get(async (req, res, next) => {
			try{
				let result = await OrderService.read(req.user_id);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//create an order
		.post(async (req, res, next) => {
			try{
				let result = await OrderService.create(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	//update an order
	router.put("/:id", async (req, res, next) => {
		try{
			let result = await OrderService.update(req.params.id, req.body);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	//cancel an order
	router.delete("/:id", async (req, res, next) => {
		try{
			let result = await OrderService.cancel(req.params.id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	return router;
};
