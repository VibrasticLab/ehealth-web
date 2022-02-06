const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const batuk_dataSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    background_noise: {
      type: Number,
      required: true,
    },
    submit_method: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batuk_Data", batuk_dataSchema);
