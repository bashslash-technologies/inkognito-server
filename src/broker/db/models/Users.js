const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
    {
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
        business_name: {
            type: String,
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
                },
            },
            identification: {
                id_type: {
                    type: String,
                    enum: [""],
                },
                number: {
                    type: String,
                },
                certificate: {
                    type: String,
                },
                verified: {
                    type: Boolean,
                },
            },
        },
        role: {
            type: String,
            enum: ["USER", "DELIVERY", "VENDOR", "ADMIN"],
            required: true,
            default: "USER",
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
    }
);

UserSchema.virtual("contact_verified").get(function () {
    return !!this.verification.contact;
});

UserSchema.virtual("email_verified").get(function () {
    return !!this.verification.email;
});

UserSchema.virtual("isVerified").get(function () {
    return !!this.util.verification;
});

UserSchema.virtual("isVerifiedDocuments").get(function () {
    switch (this.role) {
        case "DELIVERY":
            return !!(this.documents
                ? this.documents.licence
                    ? this.documents.licence.verified
                    : false
                : false);
        case "VENDOR":
            return (
                !!(this.documents
                    ? this.documents.licence
                        ? this.documents.licence.verified
                        : false
                    : false) &&
                !!(this.documents
                    ? this.documents.identification
                        ? this.documents.identification.verified
                        : false
                    : false)
            );
        default:
            return !!(this.documents
                ? this.documents.licence
                    ? this.documents.licence.verified
                    : false
                : false);
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("hash")) return next();
    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(this.hash, salt);
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
            issuer: "inkognito",
        }
    );
    return token;
};

module.exports = mongoose.model("users", UserSchema);
