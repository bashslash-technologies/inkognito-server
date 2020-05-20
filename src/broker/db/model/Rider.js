const { Schema, model } = require("mongoose");
const Utility = require("../../utility/index");

const NameSchema = new Schema(
  {
    last: {
      type: String,
      trim: true,
    },
    others: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);
const ResetSchema = new Schema(
  {
    token: String,
    expires: Date,
  },
  { _id: false }
);

const RiderSchema = new Schema(
  {
    profile: {
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      contact: {
        type: String,
        required: true,
      },
      name: NameSchema,
      password: String,
      license: String,
    },
    reset: ResetSchema,
    verification: {
      token: String,
      expires: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RiderSchema.pre("save", async function (next) {
  if (!this.isModified("profile.password")) return next();
  let hash = await Utility.hashPassword(this.profile.password);
  if (hash instanceof Error) return next(hash);
  this.profile.password = hash;
  next();
});

RiderSchema.methods.comparePasswords = async function (password) {
  return await Utility.comparePasswords({
    password,
    hash: this.profile.password,
  });
};

RiderSchema.virtual("isVerified").get(function () {
  return !this.verification.token;
});

module.exports = model("Rider", RiderSchema);
