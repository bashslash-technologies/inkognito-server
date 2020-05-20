const { Router } = require("express");
const handleSuccess = require("../../middlewares/handleSuccess");

module.exports = ({ CategoryService }) => {
	const router = Router();

	router
		.route("/")
		//retrieve all categories
		.get(async (req, res, next) => {
			try{
				let result = await CategoryService.read(req.user_id);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		})
		//create a categories
		.post(async (req, res, next) => {
			try{
				let result = await CategoryService.create(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});

	return router;
};
