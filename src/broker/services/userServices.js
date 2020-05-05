const Utils = require("../utility");

const UserService = ({ ORM: { User } }) => {
  const create = async ({
    name,
    email,
    password,
    contact,
  }) => {
    const hash = await Utils.hashPassword(password);
    try {
      const user = await User.save({
        email,
        name,
        contact,
        hash,
      });
      const token = await Utils.generateCipher({ payload: { email, hash } });
      await Utils.sendMail({
        user: user,
        token,
        subject: "Welcome to Inkognito",
        filename: "registration_confirmation",
      });
      return await user;
    } catch (error) {
      return new Error(error);
    }
  };
  const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) return new Error("User doesn't exist");
    const isValid = await Utils.comparePasswords({ password, hash: user.hash });
    if (!isValid) return new Error("Sorry invalid password");
    const token = await Utils.generateCipher({ payload: { ...user } });
    return {
      user,
      token,
    };
  };
  const verifyRegistrationToken = async ({ token, code }) => {
    const isValid = await Utils.validateCipher({ token });
    const { email } = isValid;
    const user = await User.findOne({ email });
    console.log(user);
    await user.updateOne({ $set: { verified: true } });
    return {
      isValid,
    };
  };
  const resendCode = async ({ email }) => {
    const user = await User.findOne({ email });
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
    const user = await User.findOne({ email });
    if (!user) return new Error("user doesn't exist");
    const hash = await Utils.hashPassword(password);
    await user.updateOne({ $set: { hash } });
    return {
      user,
    };
  };
  const forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });
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
    verifyRegistrationToken,
    resendCode,
    resetPassword,
    forgotPassword,
  };
};
module.exports = UserService;
