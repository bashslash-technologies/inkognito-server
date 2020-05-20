const { Router } = require("express");
const { uploadLicense } = require("../../broker/utility/upload");
const multer = require("multer");
const upload = multer();

const handleResponse = (response, res, message = "Successful") => {
  if (response instanceof Error) {
    return res.status(400).json({
      success: false,
      error: response.message,
    });
  }

  return res.status(200).json({
    success: true,
    message,
    payload: response,
  });
};

module.exports = ({ RiderService }) => {
  const router = Router();

  router.route("/").post(async (req, res) => {
    const response = await RiderService.create(req.body);
    handleResponse(response, res, "Account created successfully");
  });

  router.patch("/resend_code", async (req, res) => {
    const response = await RiderService.resendCode(req.body);
    handleResponse(response, res, "Verification code sent");
  });
  router.patch("/verify", async (req, res) => {
    const response = await RiderService.verifyRegistrationToken(req.body);
    handleResponse(response, res, "Verification was successful");
  });
  router.patch("/updateProfile", async (req, res) => {
    const response = await RiderService.updateProfile(req.body);
    handleResponse(response, res, "Profile updated successful");
  });
  router.patch(
    "/uploadLicense",
    upload.single("image"),
    uploadLicense,
    async (req, res) => {
      const response = await RiderService.uploadLicense(req.body);
      handleResponse(response, res, "Profile updated successful");
    }
  );
  router.post("/login", async (req, res) => {
    const response = await RiderService.login(req.body);
    handleResponse(response, res, "Success login");
  });
  router.post("/reset", async (req, res) => {
    const response = await RiderService.reset(req.body);
    handleResponse(response, res, "Reset Sent");
  });
  router.post("/reset/resend_code", async (req, res) => {
    const response = await RiderService.resend_code(req.body);
    handleResponse(response, res, "Reset Sent");
  });
  router.post("/validate_code", async (req, res) => {
    const response = await RiderService.validate_code(req.body);
    handleResponse(response, res, "Verification was successful");
  });
  router.patch("/new_password", async (req, res) => {
    const response = await RiderService.new_password(req.body);
    handleResponse(response, res, "Success update");
  });

  // // Authenticate the user into the system
  // router.post("/login", async (req, res) => {
  //   const response = await SellerService.login(req.body);
  //   handleResponse(response, res);
  // });
  // //Verify the user emnail
  // router.post("/verify", async (req, res) => {
  //   const response = await SellerService.verifyMailToken(req.body);
  //   handleResponse(response, res, "Sucessfully verified account");
  // });
  // //resend the verification mail
  // router.post("/resend_mail", async (req, res) => {
  //   const response = await SellerService.resendMail(req.body);
  //   handleResponse(response, res, "Mail sent successfully");
  // });
  //
  // //handle forgot password
  // router.post("/forgot_password", async (req, res) => {
  //   const response = await SellerService.forgotPassword(req.body);
  //   handleResponse(response, res, "Mail sent successfully");
  // });
  //
  // // reset password
  // router.post("/reset_password", async (req, res) => {
  //   const response = await SellerService.resetPassword(req.body);
  //   handleResponse(response, res, "Password reset successful");
  // });

  return router;
};
