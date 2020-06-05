'use strict';

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../../../configs');

aws.config.update({
	accessKeyId: config.storage.key_id,
	secretAccessKey: config.storage.access_key,
	region: config.storage.region,
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
			bucket: config.storage.bucket,
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
			bucket: config.storage.bucket,
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
			bucket: config.storage.bucket,
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
			Bucket: config.storage.bucket,
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
			Bucket: config.storage.bucket,
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
