const Bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
// const mkdirp = require("mkdirp");
// const { existsSync, mkdirSync, unlink, createWriteStream } = require("fs"); // for file upload

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
  new Promise(async function (resolve, reject) {
    try {
      let cipher = await JWT.sign(payload, process.env.SECRET, {
        expiresIn: "24h",
      });
      resolve(cipher);
    } catch (e) {
      reject(e);
    }
  });
//
exports.validateCipher = ({ token }) =>
  new Promise(async function (resolve, reject) {
    try {
      let payload = await JWT.verify(token, process.env.SECRET);
      resolve(payload);
    } catch (e) {
      reject(e);
    }
  });

// exports.sendMessage = async ({ phone, code }) => {
//   try {
//     const response = await Twilio.messages.create({
//       body: `${code} is your Ikognito verification code`,
//       from: "+12623204575",
//       from: "+12623204575",
//       to: phone,
//     });
//     console.log(response.error_message || "text successfully sent");
//     return true;
//   } catch (e) {
//     return new Error(e);
//   }
// };

// exports.sendMail = async (options) => {
//   let success = await Mail.send(options);
//   return success;
// };

// exports.deleteFile = (path) => {
//   unlink(path, (err) => {
//     if (err) return new Error(err);
//   });
//   return true;
// };

// function makeDirectory(directory) {
//   if (!existsSync(directory)) {
//     mkdirSync(directory);
//     return true;
//   }
//   return true; //if folder already exists
// }
//
// exports.uploadFile = async ({ file, type }) => {
//   try {
//     const { createReadStream, filename } = await file;
//     makeDirectory(`${__dirname}/../../Uploads`);
//     const fileDirectory = `${__dirname}/../../Uploads/${type}`;
//     const ensureDirectoryExistence = makeDirectory(fileDirectory);
//     if (!ensureDirectoryExistence)
//       throw new Error("File directory creation failure");
//     const fileURL = `${uuid.v4()}.${filename.split(".")[1]}`;
//     let creation = await createReadStream();
//     await creation.pipe(createWriteStream(`${fileDirectory}/${fileURL}`));
//     await creation.on("close", () => {});
//     return fileURL;
//   } catch (e) {
//     throw new Error(e);
//   }
// };
