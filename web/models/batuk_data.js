const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const batuk_dataSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    consent: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    no_hp: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hasil_swab: {
      type: String,
      required: false,
    },
    background_noise: {
      type: Number,
      required: true,
    },
    submit_method: {
      type: String,
      required: true,
    },
    file_identitas: {
      type: String,
      required: false,
    },
    file_swab: {
      type: String,
      required: false,
    },
    file_audio: {
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
