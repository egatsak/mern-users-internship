const { Schema, model } = require("mongoose");

const BlockedUserSchema = new Schema({
  email: { type: String,  unique: true, ref: "User" },
});

module.exports = model("BlockedUser", BlockedUserSchema);
