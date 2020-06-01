const { Router } = require("express");
const { handleSuccess, resolveUser, resolveProviders } = require("../../middlewares");

module.exports = ({ OrderService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve my orders
		.get(resolveUser, async (req, res, next) => {
			try{
				let result = await OrderService.read(req.user_id, req.query);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//create an order
		.post(resolveUser, async (req, res, next) => {
			try{
				let result = await OrderService.create(req.user_id, req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	//get all orders
	router.get("/providers", resolveProviders, async (req, res, next) => {
		try{
			let result = await OrderService.readProvider(req.user_id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}

	})

	//get pricing for order
	router.post("/pricing", async (req, res, next) => {
		try{
			let result = await OrderService.calculatePricing(req.body);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}

	})

	//update an order
	router.put("/", resolveUser, async (req, res, next) => {
		try{
			let result = await OrderService.update(req.user_id, req.params.id, req.body);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	//cancel an order
	router.delete("/:id", resolveUser, async (req, res, next) => {
		try{
			let result = await OrderService.cancel(req.user_id, req.params.id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	return router;
};
