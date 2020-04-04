const Bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const mail = require("./mail");

require("dotenv").config({ path: ".env" });
/*
  Utility module Holds function that helps convey certain basic but yet useful functionalities to the application
  1. Generate Code : Generates random 5 digit code for confirming user
  2. Hash Password (takes password) : Generates a hash for a password when creating an account
  3. Compare Passwords (takes password and hash) : Compares the password from user and hash from database
  4. Generate Cipher (takes payload and keyword) : Generates an encrypted text called cipher using jsonwebtoken
  5. Validate Cipher (takes cipher and keyword) : Decrypts the the cipher and get back payload
  6. Send Message (takes phone and five digit code) : sends the digit code as text message to phone number
  7. Delete File (takes the file path) : Deletes a file provided
*/

exports.generateCode = () => {
  const code =
    Math.random() * (Math.floor(9000) - Math.ceil(1000) + 1) + Math.ceil(1000);
  return code.toFixed().toString();
};

exports.hashPassword = async (password) => {
  try {
    let salt = await Bcrypt.genSalt(10);
    let hash = await Bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    return new Error(e);
  }
};

exports.comparePasswords = async ({ password, hash }) => {
  try {
    let isSame = await Bcrypt.compare(password, hash);
    return isSame;
  } catch (e) {
    return new Error(e);
  }
};
//
exports.generateCipher = ({ payload }) =>
  new Promise(function (resolve, reject) {
    try {
      let cipher = JWT.sign(payload, process.env.SECRET, {
        expiresIn: "24h",
      });
      resolve(cipher);
    } catch (e) {
      reject(e);
    }
  });
//
exports.validateCipher = ({ token }) =>
  new Promise(function (resolve, reject) {
    try {
      let payload = JWT.verify(token, process.env.SECRET);
      resolve(payload);
    } catch (e) {
      reject(e);
    }
  });

exports.sendMail = async (options) => {
  let success = await mail.send(options);
  return success;
};
