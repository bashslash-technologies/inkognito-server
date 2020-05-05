const Utils = require("../utility");

const RiderService = ({ ORM: { Rider } }) => {
  const create = async ({
    name,
    email,
    password,
    contact,
  }) => {
    const hash = await Utils.hashPassword(password);
    try {
      const rider = await Rider.save({
        email,
        name,
        contact,
        hash,
      });
      const token = await Utils.generateCipher({ payload: { email, hash } });
      await Utils.sendMail({
        user: rider,
        token,
        subject: "Welcome to Inkognito",
        filename: "registration_confirmation",
      });
      return await rider;
    } catch (error) {
      return new Error(error);
    }
  };
  const login = async ({ email, password }) => {
    const rider = await Rider.findOne({ email });
    if (!user) return new Error("User doesn't exist");
    const isValid = await Utils.comparePasswords({ password, hash: user.hash });
    if (!isValid) return new Error("Sorry invalid password");
    const token = await Utils.generateCipher({ payload: { ...rider } });
    return {
        rider,
      token,
    };
  };
  const verifyRegistrationToken = async ({ token, code }) => {
    const isValid = await Utils.validateCipher({ token });
    const { email } = isValid;
    const rider = await Rider.findOne({ email });
    console.log(rider);
    await rider.updateOne({ $set: { verified: true } });
    return {
      isValid,
    };
  };
  const resendCode = async ({ email }) => {
    const rider = await Rider.findOne({ email });
    if (!rider) return new Error("User does not exist");
    const { hash } = rider;
    const token = await Utils.generateCipher({ payload: { email, hash } });
    await Utils.sendMail({
        rider,
      token,
      subject: "Welcome to Inkognito",
      filename: "registration_confirmation",
    });
  };
  const resetPassword = async ({ password, token }) => {
    const isValid = await Utils.validateCipher({ token });
    const { email } = isValid;
    const rider = await Rider.findOne({ email });
    if (!rider) return new Error("rider doesn't exist");
    const hash = await Utils.hashPassword(password);
    await rider.updateOne({ $set: { hash } });
    return {
        rider,
    };
  };
  const forgotPassword = async ({ email }) => {
    const rider = await Rider.findOne({ email });
    if (!rider) return new Error("Rider does not exist");
    const { hash } = rider;
    const token = await Utils.generateCipher({ payload: { email, hash } });
    await Utils.sendMail({
      user,
      token,
      subject: "Reset password",
      filename: "forgotpassword",
    });
    return {
      rider,
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
module.exports = RiderService;
