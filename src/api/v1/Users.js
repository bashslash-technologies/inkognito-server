const {Router} = require("express");
const handleSuccess = require("../../middlewares/handleSuccess")

module.exports = ({UserService}) => {
    const router = Router();

    //REGISTERATION
    //register a user
    router.post("/create", async (req, res, next) => {
        try {
            let result = await UserService.create(req.body);
            return handleSuccess(res, result, "Account created successfully");
        } catch (err) {
            next(err);
        }
    });
    //setup a user
    router.post("/setup", async (req, res, next) => {
        try {
            let result = await UserService.setup(req.body);
            return handleSuccess(res, result, "Account setup successfully");
        } catch (err) {
            next(err);
        }
    });


    //AUTHENTICATION
    // authenticate a user into the system
    router.post("/login", async (req, res, next) => {
        try {
            let result = await UserService.login(req.body);
            return handleSuccess(res, result);
        } catch (err) {
            next(err);
        }
    });


    //VERIFICATION
    //verify a user phone
    router.post("/verify", async (req, res, next) => {
        try {
            let result = await UserService.verifyCode(req.body);
            return handleSuccess(res, result, "Sucessfully verified account");
        } catch (err) {
            next(err);
        }
    })
    //resend a verification code
    router.get("/verify", async (req, res, next) => {
        try {
            let result = await UserService.sendVerifyCode(req.body);
            return handleSuccess(res, result, "Code sent successfully");
        } catch (err) {
            next(err);
        }
    })


    //RESET
    //handle forgot password
    router.get("/reset", async (req, res, next) => {
        try {
            let result = await UserService.sendResetCode(req.body);
            return handleSuccess(res, result, "Code sent successfully");
        } catch (err) {
            next(err);
        }
    });

    // reset password
    router.post("/reset", async (req, res, next) => {
        try {
            let result = await UserService.verifyResetCode(req.body);
            return handleSuccess(res, result, "Password reset successful");
        } catch (err) {
            next(err);
        }
    });

    // reset password
    router.post("/password", async (req, res, next) => {
        try {
            let result = await UserService.resetPassword(req.user_id, req.body);
            return handleSuccess(res, result, "Password reset successful");
        } catch (err) {
            next(err);
        }
    });

    //GET USERS
    router.get("/delivery", async (req, res, next) => {
        try {
            let result = await UserService.getUsers(req.query);
            return handleSuccess(res, result, "successful");
        } catch (err) {
            next(err);
        }
    })

    return router;
};
