const Jimp = require("jimp");
const uuid = require("uuid");
const { existsSync, mkdirSync } = require("fs");

function makeDirectory(directory) {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
  return true;
}

const UploadProducts = async function (req, res, next) {
  try {
    if (!req.files) throw new Error("No file added");
    //ensure my directories are ready
    makeDirectory(`${__dirname}/../../uploads`);
    const fileDirectory = `${__dirname}/../../uploads/products`;
    const ensureDirectoryExistence = makeDirectory(fileDirectory);
    if (!ensureDirectoryExistence)
      throw new Error("File directory not created");

    req.body.images = [];
    for (let i = 0; i < req.files.length; i++) {
      //appending to the req.body array
      let newName = uuid.v4() + "." + req.files[i].mimetype.split("/")[1];
      req.body.images.push(newName);
      //upload now
      let file = await Jimp.read(req.files[i].buffer);
      file.resize(800, Jimp.AUTO);
      file.write(`${__dirname}/../../uploads/products/${newName}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};

const uploadCertificate = async function (req, res, next) {
  try {
    if (!req.file) throw new Error("no file added");
    req.body.certificate_image =
      uuid.v4() + "." + req.file.mimetype.split("/")[1];
    let file = await Jimp.read(req.file.buffer);
    file.resize(800, Jimp.AUTO);
    makeDirectory(`${__dirname}/../../uploads`);
    const fileDirectory = `${__dirname}/../../uploads/certs`;
    const ensureDirectoryExistence = makeDirectory(fileDirectory);
    if (!ensureDirectoryExistence)
      throw new Error("File directory not created");
    file.write(`${__dirname}/../../uploads/certs/${req.body.image}`);
    next();
  } catch (err) {
    next(err);
  }
};
const uploadLicense = async function (req, res, next) {
  try {
    if (!req.file) throw new Error("no file added");
    req.body.license = uuid.v4() + "." + req.file.mimetype.split("/")[1];
    let file = await Jimp.read(req.file.buffer);
    file.resize(800, Jimp.AUTO);
    makeDirectory(`${__dirname}/../../uploads`);
    const fileDirectory = `${__dirname}/../../uploads/license`;
    const ensureDirectoryExistence = makeDirectory(fileDirectory);
    if (!ensureDirectoryExistence)
      throw new Error("File directory not created");
    file.write(`${__dirname}/../../uploads/license/${req.body.license}`);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  UploadProducts,
  uploadCertificate,
  uploadLicense,
};
