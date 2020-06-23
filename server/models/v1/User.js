'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../configs');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		lowercase: true,
		match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
		required: true
	},
	phone: {
		type: String,
		match: /233([0-9]{9})/,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		uppercase: true,
		default: 'CLIENT',
		enum: ['CLIENT', 'COURIER', 'VENDOR', 'ADMIN']
	},
	verification: {
		code: {
			type: Number,
			length: 6
		},
		expiry: {
			type: Date
		}
	},
	reset: {
		code: {
			type: Number,
			length: 6
		},
		expiry: {
			type: Date
		}
	},
	locker: {
		tries: {
			type: Number,
			default: 0
		},
		expiry: {
			type: Date
		}
	},
}, {
	timestamps: true
});


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePasswords = async function (hash) {
    return await bcrypt.compare(hash, this.password);
};

UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign(
        {
            _id: this._id,
            role: this.role,
        },
			config.app.secret,
        {
            expiresIn: config.auth.token_expiry,
            issuer: config.app.name,
        }
    );
    return token;
};

UserSchema.virtual('isLocked').get(function(){
	return this.locker.tries > config.auth.locker_retries;
});

module.exports = mongoose.model('users', UserSchema);