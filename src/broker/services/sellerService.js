const Utils = require("../utility");

const SellerService = ({ ORM: { Seller } }) => {
  const create = async ({
    company_name,
    email,
    password,
    contact,
    registration_number,
    certificate_image,
  }) => {
    const hash = await Utils.hashPassword(password);
    try {
      const seller = await Seller.save({
        email,
        company_name,
        contact,
        registration_number,
        hash,
        certificate_image,
      });
      const token = await Utils.generateCipher({ payload: { email, hash } });
      await Utils.sendMail({
        user: seller,
        token,
        subject: "Welcome to Inkognito",
        filename: "registration_confirmation",
      });
      return await seller;
    } catch (error) {
      return new Error(error);
    }
  };
  const login = async ({ email, password }) => {
    const user = await Seller.findOne({ email });
    if (!user) return new Error("User doesn't exist");
    const isValid = await Utils.comparePasswords({ password, hash: user.hash });
    if (!isValid) return new Error("Sorry invalid password");
    const token = await Utils.generateCipher({ payload: { ...user } });
    return {
      user,
      token,
    };
  };
  const verifyMailToken = async ({ token }) => {
    const isValid = await Utils.validateCipher({ token });
    const { email } = isValid;
    const user = await Seller.findOne({ email });
    console.log(user);
    await user.updateOne({ $set: { verified: true } });
    return {
      isValid,
    };
  };
  const resendMail = async ({ email }) => {
    const user = await Seller.findOne({ email });
    if (!user) return new Error("User does not exist");
    const { hash } = user;
    const token = await Utils.generateCipher({ payload: { email, hash } });
    await Utils.sendMail({
      user,
      token,
      subject: "Welcome to Inkognito",
      filename: "registration_confirmation",
    });
  };
  const resetPassword = async ({ password, token }) => {
    const isValid = await Utils.validateCipher({ token });
    const { email } = isValid;
    const user = await Seller.findOne({ email });
    if (!user) return new Error("user doesn't exist");
    const hash = await Utils.hashPassword(password);
    await user.updateOne({ $set: { hash } });
    return {
      user,
    };
  };
  const forgotPassword = async ({ email }) => {
    const user = await Seller.findOne({ email });
    if (!user) return new Error("User does not exist");
    const { hash } = user;
    const token = await Utils.generateCipher({ payload: { email, hash } });
    await Utils.sendMail({
      user,
      token,
      subject: "Reset password",
      filename: "forgotpassword",
    });
    return {
      user,
      token,
    };
  };
  return {
    create,
    login,
    verifyMailToken,
    resendMail,
    resetPassword,
    forgotPassword,
  };
};
module.exports = SellerService;
