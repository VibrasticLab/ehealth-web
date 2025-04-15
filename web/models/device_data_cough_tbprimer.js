const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const device_data_coughTBPrimerSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    device_id: {
      type: Number,
      required: true,
      trim: true,
    },
    json_data: {
      type: String,
      required: true,
    },
    cough_type: {
      type: String,
      required: true,
    },
    cough: {
      type: Number,
      required: false,
    },
    time: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device_Data_Cough_TBPrimer", device_data_coughTBPrimerSchema);
