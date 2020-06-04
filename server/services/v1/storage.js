'use strict';

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
	accessKeyId: process.env.STORAGE_KEY_ID,
	secretAccessKey: process.env.STORAGE_ACCESS_KEY,
	region: process.env.STORAGE_REGION,
});

const s3 = new aws.S3();

function fileFilter(req, file, cb){
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
	}
};

function uploadProduct() {
	return multer({
		fileFilter,
		storage: multerS3({
			acl: 'public-read',
			s3: s3,
			bucket: process.env.STORAGE_BUCKET,
			metadata: function (req, file, cb) {
				cb(null, { fieldName: file.fieldname });
			},
			key: function (req, file, cb) {
				let est = file.mimetype === 'image/jpeg' ? '.jpeg' : '.png';
				cb(null, 'products/' + Date.now().toString() + est);
			},
		}),
	});
}

function uploadCertificate() {
	return multer({
		storage: multerS3({
			acl: 'public-read',
			s3: s3,
			bucket: process.env.STORAGE_BUCKET,
			metadata: function (req, file, cb) {
				cb(null, { fieldName: file.fieldname });
			},
			key: function (req, file, cb) {
				let est = file.mimetype === 'image/jpeg' ? '.jpeg' : '.png';
				cb(null, 'certificates/' + Date.now().toString() + est);
			},
		}),
	});
}

function uploadLogo() {
	return multer({
		storage: multerS3({
			acl: 'public-read',
			s3: s3,
			bucket: process.env.STORAGE_BUCKET,
			metadata: function (req, file, cb) {
				cb(null, { fieldName: file.fieldname });
			},
			key: function (req, file, cb) {
				let est = file.mimetype === 'image/jpeg' ? '.jpeg' : '.png';
				cb(null, 'certificates/' + Date.now().toString() + est);
			},
		}),
	});
}

function deleteFiles(files) {
	return new Promise(function(resolve, reject) {
		s3.deleteObjects({
			Bucket: process.env.STORAGE_BUCKET,
			Delete: {
				Objects: files.map(function(file){
					return {
						Key: file
					}
				}),
				Quiet: false
			},
		}, function(err, data) {
			if(err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		})
	})
}

function deleteFile(file) {
	return new Promise(function(resolve, reject) {
		s3.deleteObject({
			Bucket: process.env.STORAGE_BUCKET,
			Key: file,
		}, function(err, data) {
			if(err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		})
	})
}

module.exports = {
	uploadCertificate: uploadCertificate,
	uploadProduct: uploadProduct,
	uploadLogo: uploadLogo,
	deleteFiles: deleteFiles,
	deleteFile: deleteFile,
}
