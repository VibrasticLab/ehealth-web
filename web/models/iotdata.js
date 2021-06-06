const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const iotdataSchema = new Schema(
  {
    devid: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    datastring: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Iotdata", iotdataSchema);
