const Utils = require("../utility");
const SMS = require("../utility/SMS");

const RiderService = ({ ORM: { Rider } }) => {
  const create = async ({ email, password, contact }) => {
    contact = `233${contact.slice(-9)}`;
    let token = Utils.generateCode();
    try {
      //check if rider exists
      let __old = await Rider.findOne({
        $or: [{ "profile.email": email }, { "profile.contact": contact }],
      });
      if (__old) return new Error("User already exist");
      const rider = await Rider.save({
        profile: { email, contact, password },
        verification: { token, expires: Date.now() + 3600000 },
      });
      await SMS(contact, token); //start later
      return await rider;
    } catch (error) {
      return new Error(error);
    }
  };

  const resendCode = async ({ id }) => {
    try {
      let token = Utils.generateCode();
      let rider = await Rider.findByIdAndUpdate(id, {
        verification: { token, expires: Date.now() + 3600000 },
      });
      if (!rider) return new Error("User doesn't exist");
      await SMS(rider.profile.contact, token);
      return true;
    } catch (e) {
      return new Error(e);
    }
  };

  const verifyRegistrationToken = async ({ id, code }) => {
    try {
      let rider = await Rider.findById(id);
      if (!rider) return new Error("User doesn't exist");
      if (
        code !== rider.verification.token ||
        Date.now() > rider.verification.expires
      )
        return new Error("Oops, verification code is invalid");
      rider.verification.token = undefined;
      rider.verification.expires = undefined;
      await rider.save();
      return rider;
    } catch (e) {
      return new Error(e);
    }
  };

  const updateProfile = async ({ id, last, others }) => {
    try {
      return await Rider.findByIdAndUpdate(id, {
        "profile.name": { last, others },
      });
    } catch (e) {
      return new Error(e);
    }
  };

  const uploadLicense = async ({ id, license }) => {
    try {
      return await Rider.findByIdAndUpdate(id, {
        "profile.license": license,
      });
    } catch (e) {
      return new Error(e);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const rider = await Rider.findOne({ "profile.email": email });
      if (!rider) return new Error("Sorry invalid credentials");
      let isSame = await rider.comparePasswords(password);
      if (!isSame) return new Error("Sorry invalid credentials");
      let token = Utils.generateCode();
      // check if user has been verified or not
      if (rider.isVerified === false) {
        rider.verification.token = token;
        rider.verification.expires = Date.now() + 3600000;

        await Promise.all([
          rider.save(),
          SMS(rider.profile.contact, token), //uncomment later
        ]);
      }
      return rider;
    } catch (e) {
      return new Error(e);
    }
  };

  const reset = async ({ email }) => {
    try {
      //check if user exists
      let rider = await Rider.findOne({ "profile.email": email });
      if (!rider) return new Error("User does not exists");
      let token = Utils.generateCode();
      rider.reset = {
        token,
        expires: Date.now() + 3600000,
      };
      await Promise.all([
        rider.save(),
        SMS(rider.profile.contact, token), //uncomment later
      ]);
      return rider;
    } catch (e) {
      return new Error(e);
    }
  };

  const resend_code = async ({ id }) => {
    try {
      //get user
      let driver = await Rider.findById(id);
      if (!driver) return new Error("User does not exists");
      let token = Utils.generateCode();
      driver.reset = {
        token,
        expires: Date.now() + 3600000,
      };
      await Promise.all([
        driver.save(),
        SMS(driver.profile.contact, token), //uncomment later
      ]);
      return true;
    } catch (e) {
      return new Error();
    }
  };

  let validate_code = async ({ id, code }) => {
    try {
      //get user
      let driver = await Rider.findById(id);
      if (!driver) return new Error("User does not exists");
      //check if code is same and still valid(as in, now date should be less than the one hour given)
      if (code !== driver.reset.token || Date.now() > driver.reset.expires)
        return new Error("Oops, verification code is invalid");
      return driver;
    } catch (e) {
      return new Error(e);
    }
  };

  let new_password = async ({ id, password }) => {
    try {
      let driver = await Rider.findById(id);
      if (!driver) return new Error("User does not exists");
      driver.profile.password = password;
      driver.reset.token = undefined;
      driver.reset.expires = undefined;
      await driver.save();
      return true;
    } catch (e) {
      return new Error(e);
    }
  };

  return {
    create,
    login,
    verifyRegistrationToken,
    resendCode,
    updateProfile,
    uploadLicense,
    reset,
    validate_code,
    new_password,
    resend_code,
  };
};
module.exports = RiderService;
