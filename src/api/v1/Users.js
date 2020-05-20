const { Router } = require("express");
const handleSuccess = require("../../middlewares/handleSuccess")

module.exports = ({ UserService }) => {
	const router = Router();

	//REGISTERATION
		//register a user
		router.post("/create", async (req, res, next) => {
			try{
				let result = await UserService.create(req.body);
				return handleSuccess(res, result, "Account created successfully");
			}
			catch(err){
				next(err);
			}
		});
		//setup a user
		router.post("/setup", async (req, res, next) => {
			try{
				let result = await UserService.setup(req.body);
				return handleSuccess(res, result, "Account created successfully");
			}
			catch(err){
				next(err);
			}
		});
		

	//AUTHENTICATION
		// authenticate a user into the system
		router.post("/login", async (req, res, next) => {
			try{
				let result = await UserService.login(req.body);
				return handleSuccess(res, result);
			}
			catch(err){
				next(err);
			}
		});


	//VERIFICATION
		//verify a user email
		router.post("/forgot_password", async (req, res, next) => {
			try{
				let result = await UserService.verifyRegistrationToken(req.body);
				return handleSuccess(res, result, "Sucessfully verified account");
			}
			catch(err){
				next(err);
			}
		})
		//resend a verification mail
		router.post("/forgot_password", async (req, res, next) => {
			try{
				let result = await UserService.resendCode(req.body);
				return handleSuccess(res, result, "Code sent successfully");
			}
			catch(err){
				next(err);
			}
		})


	//RESET
		//handle forgot password
		router.post("/forgot_password", async (req, res, next) => {
			try{
				let result = await UserService.forgotPassword(req.body);
				return handleSuccess(res, result, "Code sent successfully");
			}
			catch(err){
				next(err);
			}
		});

		// reset password
		router.post("/reset_password", async (req, res, next) => {
			try{
				let result = await UserService.resetPassword(req.body);
				return handleSuccess(res, result, "Password reset successful");
			}
			catch(err){
				next(err);
			}
		});

	return router;
};
