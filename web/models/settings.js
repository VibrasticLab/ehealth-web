const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    value: {
      type: String,
    },
  },
);

module.exports = mongoose.model("Settings", settingSchema);
