const SMS = require("../utility/SMS");
const { random, padStart, toUpper } = require("lodash");

const UserService = ({ ORM }) => {
  //REGISTERATON
  //register a user
  const create = async ({ email, contact, name, password, role }) => {
    try {
      let _user = await ORM.Users.findOne({
        $or: [{ email }, { contact: "233" + padStart(contact, 9) }],
      });
      if (_user) throw new Error("User already exists");
      let __user = new ORM.Users({
        email,
        contact: "233" + padStart(contact, 9),
        hash: password,
        name,
        role,
        util: {
          verification: {
            code: random(999999),
          },
        },
      });
      await __user.save();
      SMS.sendMessage(
        __user.contact,
        `Kindly verify your account with code ${__user.util.verification.code}`
      )
        .then((sus) => {
          console.log(sus);
        })
        .catch((err) => {
          console.log(err);
        });
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };
  //setup a user
  const setup = async (user_id, { licence, identification, business_name }) => {
    try {
      let __user = await ORM.Users.findById(user_id);
      if (!__user) throw new Error("User not found");
      let updates = {
        $set: {
          business_name,
          documents: {},
        },
      };
      if (!(licence && licence.number && licence.certificate)) {
        throw new Error("Please provide a licence");
      }
      updates["$set"]["documents"]["licence"] = {
        number: licence.number,
        certificate: licence.certificate,
        verified: false,
      };
      if (__user.role === "VENDOR") {
        if (
          !(
            identification &&
            identification.number &&
            identification.certificate &&
            identification.id_type
          )
        ) {
          throw new Error("Please provide a form of identification");
        }
        updates["$set"]["documents"]["identification"] = {
          number: identification.number,
          certificate: identification.certificate,
          id_type: identification.id_type,
          verified: false,
        };
      }
      await __user.updateOne(updates, {
        new: true,
      });
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };

  //AUTHENTICATION
  // authenticate a user into the system
  const login = async ({ username, password }) => {
    try {
      let __user = await ORM.Users.findOne({
        $or: [{ email: username }, { contact: "233" + padStart(username, 9) }],
      });
      if (!__user) throw new Error("account not found");
      if (!__user.isVerified) {
        SMS.sendMessage(
          __user.contact,
          `Kindly verify your account with code ${__user.util.verification.code}`
        );
        throw new Error("account not verified");
      }
      let isValid = await __user.comparePasswords(password);
      if (!isValid) throw new Error("incorrect password");
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };

  //VERIFICATION
  //verify a user contact
  const verifyCode = async ({ username, code }) => {
    try {
      let __user = await ORM.Users.findOne({
        $or: [{ email: username }, { contact: "233" + padStart(username, 9) }],
      });
      if (!__user) throw new Error("account not found");
      if (!__user.util.verification)
        throw new Error("account already verified");
      if (__user.util.verification.code !== code)
        throw new Error("invalid code");
      await __user.updateOne(
        {
          $unset: {
            "util.verification": 1,
          },
        },
        {
          new: true,
        }
      );
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };
  //send verification
  const sendVerifyCode = async ({ username }) => {
    try {
      let __user = await ORM.Users.findOne({
        $or: [{ email: username }, { contact: "233" + padStart(username, 9) }],
      });
      if (!__user) throw new Error("account not found");
      await __user.updateOne(
        {
          $set: {
            util: {
              verification: {
                code: random(999999),
              },
            },
          },
        },
        {
          new: true,
        }
      );
      SMS.sendMessage(
        "233" + padStart(__user.contact, 9),
        `Kindly verify your account with code ${__user.util.verification.code}`
      );
      return true;
    } catch (err) {
      throw err;
    }
  };

  //RESET
  //verify reset code
  const verifyResetCode = async ({ username, code }) => {
    try {
      let __user = await ORM.Users.findOne({
        $or: [{ email: username }, { contact: "233" + padStart(username, 9) }],
      });
      if (!__user) throw new Error("account not found");
      if (!__user.util.reset) throw new Error("no reset code found");
      if (__user.util.reset.code !== code) throw new Error("invalid code");
      await __user.updateOne(
        {
          $unset: {
            "util.reset": 1,
          },
        },
        {
          new: true,
        }
      );
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };

  //send reset code
  const sendResetCode = async ({ username }) => {
    try {
      let __user = await ORM.Users.findOne({
        $or: [{ email: username }, { contact: "233" + padStart(username, 9) }],
      });
      if (!__user) throw new Error("account not found");
      await __user.updateOne(
        {
          $set: {
            util: {
              reset: {
                code: random(999999),
              },
            },
          },
        },
        {
          new: true,
        }
      );
      SMS.sendMessage(
        __user.contact,
        `Kindly verify your account with code ${__user.util.reset.code}`
      );
      return true;
    } catch (err) {
      throw err;
    }
  };

  //reset password
  const resetPassword = async (user_id, { password }) => {
    try {
      let __user = await ORM.Users.findById(user_id);
      if (!__user) throw new Error("account not found");
      __user.hash = password;
      await __user.save();
      return {
        user: __user,
        token: await __user.generateAuthToken(),
      };
    } catch (err) {
      throw err;
    }
  };

  //RETRIVE USERS
  const getUsers = async ({ role = "user" }) => {
    try {
      return await ORM.Users.find({ role: toUpper(role) });
    } catch (err) {
      throw err;
    }
  };

  return {
    create,
    setup,
    login,
    verifyCode,
    sendVerifyCode,
    verifyResetCode,
    sendResetCode,
    resetPassword,
    getUsers,
  };
};

module.exports = UserService;
