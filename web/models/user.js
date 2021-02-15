const mongoose = require("mongoose");

const ROLE = ["patient", "doctor", "admin"];
const GENDER = ["male", "female"];

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    doctorRole: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDER,
    },
    dateOfBirth: {
      type: Date,
    },
    marital: {
      type: String,
    },
    mobileNumber1: {
      type: String,
    },
    mobileNumber2: {
      type: String,
    },
    url: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    department: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    city: {
      type: String,
    },
    patient: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    doctorList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
