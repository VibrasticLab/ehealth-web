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
    json_data: {
      type: String,
      required: true,
    },
    // file_path: {
    //   type: String,
    //   required: false,
    // },
    time: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device_Data", device_dataSchema);
