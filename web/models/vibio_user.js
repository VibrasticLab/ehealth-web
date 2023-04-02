const { Number } = require("mongoose");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const vibio_users = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    tanggal_lahir: {
      type: Date,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Vibio_users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vibio_users", vibio_users);
