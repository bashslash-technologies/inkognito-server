const { Router } = require("express");

const handleResponse = (response, res, message = "Successful") => {
  if (response instanceof Error) {
    return res.status(400).json({
      success: null,
      error: true,
      message: response.message,
    });
  }

  return res.status(200).json({
    success: true,
    error: null,
    message,
    payload: response,
  });
};

module.exports = ({ UserService }) => {
  const router = Router();

  router.route("/").get(async (_, res) => {
    res.send("User routes are here");
  });
  //Register the vendor in the system
  router
    .post("/create", async (req, res) => {
      const response = await UserService.create(req.body);
      handleResponse(response, res, "Account created successfully");
    });

  // Authenticate the user into the system
  router.post("/login", async (req, res) => {
    const response = await UserService.login(req.body);
    handleResponse(response, res);
  });
  //Verify the user emnail
  router.post("/verify_code", async (req, res) => {
    const response = await UserService.verifyRegistrationToken(req.body);
    handleResponse(response, res, "Sucessfully verified account");
  });
  //resend the verification mail
  router.post("/resend_code", async (req, res) => {
    const response = await UserService.resendCode(req.body);
    handleResponse(response, res, "Code sent successfully");
  });

  //handle forgot password
  router.post("/forgot_password", async (req, res) => {
    const response = await UserService.forgotPassword(req.body);
    handleResponse(response, res, "Code sent successfully");
  });

  // reset password
  router.post("/reset_password", async (req, res) => {
    const response = await UserService.resetPassword(req.body);
    handleResponse(response, res, "Password reset successful");
  });

  return router;
};
