const Utils = require("../utility");

const SellerService = ({ ORM: { Seller } }) => {
  const create = async ({
    company_name,
    email,
    password,
    contact,
    registration_number,
  }) => {
    const hash = await Utils.hashPassword(password);
    try {
      const seller = await Seller.save({
        email,
        company_name,
        contact,
        registration_number,
        hash,
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
  return { create, login };
};
module.exports = SellerService;
