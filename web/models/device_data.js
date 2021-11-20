const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const device_dataSchema = new Schema(
  {
    device_id: {
      type: Number,
      required: true,
      trim: true,
    },
    device_data: {
      type: String,
      required: true,
    },
    timestamps_data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device_Data", device_dataSchema);
