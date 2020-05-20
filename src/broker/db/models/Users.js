const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
    },
    contact: {
		type: String,
		unique: true,
		required: true,
    },
    hash: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	documents: {
		licence: {
			number: {
				type: String,
			},
			certificate: {
				type: String,
			},
			verified: {
				type: Boolean,
				default: false
			}
		},
		identification: {
			id_type: {
				type: String,
				enum: [''],
			},
			number: {
				type: String,
			},
			certificate: {
				type: String
			},
			verified: {
				type: Boolean,
				default: false
			}
		}
	},
	role: {
		type: String,
		enum: ['USER, DELIVERY, VENDOR, ADMIN'],
		required: true,
		default: 'USER',
	},
    util: {
		verification: {
			code: String,
			expiry: Date,
		},
    },
},
{
    timestamps: true,
});

UserSchema.virtual('contact_verified').get(function(){
	return !!this.verification.contact
})

UserSchema.virtual('email_verified').get(function(){
	return !!this.verification.email
})

UserSchema.virtual('isVerified').get(function(){
	switch(this.role){
		case 'USER':
			return !!this.util.verification
		case 'DELIVERY':
			return !!this.util.verification
				&& !!(this.documents.licence && this.documents.license.verified);
		case 'VENDOR':
			return !!this.util.verification
				&& !!(this.documents.licence && this.documents.license.verified)
				&& !!(this.documents.identification && this.documents.identification.verified);
		default:
			return !!this.util.verification;
	}
})

UserSchema.pre("save", async function(next) {
	if (!this.isModified("hash")) return next();
	try {
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(this.hash, salt)
		this.hash = hash;
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.comparePasswords = async function (hash) {
	return await bcrypt.compare(hash, this.hash);
};

UserSchema.methods.generateAuthToken = async function () {
	const token = jwt.sign(
		{
			_id: this._id,
			role: this.role,
		},
		process.env.APP_SECRET,
		{
			expiresIn: "12h",
			issuer: "inkognito"
		}
	);
	return token;
};

module.exports = mongoose.model("users", UserSchema);
