const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const vibio_terai = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    uuid_user: {
        type: String,
        required: true,
      },
    json_data: {
      type: String,
      required: true,
    },
    terapi: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vibio_terapi", vibio_terai);
