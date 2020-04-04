const { Schema, model } = require("mongoose");

//Email,
//Contact,
//Company Name,
//Registration number

const schema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    registration_number: {
      type: String,
      required: true,
    },
    certificate_image: { type: String, sparse: true },
    verified: {
      type: Boolean,
      default: false,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Seller", schema);
