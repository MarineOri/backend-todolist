const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String,
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lists" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
