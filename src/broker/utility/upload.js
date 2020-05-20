const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
	accessKeyId: process.env.STORAGE_KEY_ID,
	secretAccessKey: process.env.STORAGE_ACCESS_KEY,
	region: process.env.STORAGE_REGION,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
	}
};

const uploadProducts = multer({
	fileFilter,
	storage: multerS3({
		acl: "public-read",
		s3: s3,
		bucket: "mongobid",
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			let est = file.mimetype === "image/jpeg" ? ".jpeg" : ".png";
			cb(null, "products/" + Date.now().toString() + est);
		},
	}),
});

const uploadDocuments = multer({
	storage: multerS3({
		acl: "public-read",
		s3: s3,
		bucket: "mongobid",
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			let est = file.mimetype === "image/jpeg" ? ".jpeg" : ".png";
			cb(null, "products/" + Date.now().toString() + est);
		},
	}),
});

module.exports = {
	uploadProducts,
	uploadDocuments,
}