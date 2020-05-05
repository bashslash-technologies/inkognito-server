const { Router } = require("express");
const { uploadCertificate } = require("../../broker/utility/upload");
const multer = require("multer");
const upload = multer();

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

module.exports = ({ SellerService }) => {
  const router = Router();

  router.route("/").get(async (_, res) => {
    res.send("Seller routes are here");
  });
  //Register the vendor in the system
  router
    .route("/create")
    .post(async (req, res) => {
      const response = await SellerService.create(req.body);
      handleResponse(response, res, "Account created successfully");
    });

  // Authenticate the user into the system
  router.post("/login", async (req, res) => {
    const response = await SellerService.login(req.body);
    handleResponse(response, res);
  });
  //Verify the user emnail
  router.post("/verify", async (req, res) => {
    const response = await SellerService.verifyMailToken(req.body);
    handleResponse(response, res, "Sucessfully verified account");
  });
  //resend the verification mail
  router.post("/resend_mail", async (req, res) => {
    const response = await SellerService.resendMail(req.body);
    handleResponse(response, res, "Mail sent successfully");
  });

  //handle forgot password
  router.post("/forgot_password", async (req, res) => {
    const response = await SellerService.forgotPassword(req.body);
    handleResponse(response, res, "Mail sent successfully");
  });

  // reset password
  router.post("/reset_password", async (req, res) => {
    const response = await SellerService.resetPassword(req.body);
    handleResponse(response, res, "Password reset successful");
  });

  return router;
};
