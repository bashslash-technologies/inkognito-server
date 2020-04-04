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
    if (!req.file) throw new Error("no file added");
    req.body.image = uuid.v4() + "." + req.file.mimetype.split("/")[1];
    let file = await Jimp.read(req.file.buffer);
    file.resize(800, Jimp.AUTO);
    makeDirectory(`${__dirname}/../../uploads`);
    const fileDirectory = `${__dirname}/../../uploads/products`;
    const ensureDirectoryExistence = makeDirectory(fileDirectory);
    if (!ensureDirectoryExistence)
      throw new Error("File directory not created");
    file.write(`${__dirname}/../../uploads/products/${req.body.image}`);
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

module.exports = {
  UploadProducts,
  uploadCertificate,
};
