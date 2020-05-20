const { Router } = require("express");
const handleSuccess = require("../../middlewares/handleSuccess");

module.exports = ({ CashoutService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all cashouts
		.get(async (req, res, next) => {
			try{
				let result = await CashoutService.read(req.user_id);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//request cashout
		.post(async (req, res, next) => {
			try{
				let result = await CashoutService.create(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	return router;
};
