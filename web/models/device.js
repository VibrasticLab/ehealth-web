const { Number } = require("mongoose");
const mongoose = require("mongoose");

const ROLE = ["patient", "doctor", "admin"];
const GENDER = ["male", "female"];

const Schema = mongoose.Schema;
const deviceSchema = new Schema(
  {
    device_id: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    device_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    credential: {
      url: {
        type: String,
      },
      username: {
        type: String,
        trim: true,
      },
      password: {
        type: String,
        trim: true,
      },
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Device",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
