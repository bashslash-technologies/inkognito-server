const { Router } = require("express");
const handleSuccess = require("../../middlewares/handleSuccess");

module.exports = ({ TransactionService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all transactions
		.get(async (req, res, next) => {
			try{
				let result = await TransactionService.read(req.user_id);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		
		//create a transaction
		.post(async (req, res, next) => {
			try{
				let result = await TransactionService.create(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	//update a transaction
	router.put("/:id", async (req, res, next) => {
		try{
			let result = await TransactionService.update(req.params.id, req.body);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	//cancel a transaction
	router.delete("/:id", async (req, res, next) => {
		try{
			let result = await TransactionService.cancel(req.params.id);
			return handleSuccess(res, result);
		}
		catch(err){
			next(err);
		}
	});

	return router;
};
