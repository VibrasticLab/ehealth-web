const mongoose = require("mongoose");

const ROLE = ["patient", "doctor", "admin"];

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    patient: [
      {
        patientId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
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
    password: {
      type: String,
      required: true,
      default: "user-123",
    },
    role: {
      type: String,
      default: "public",
      enum: ROLE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
