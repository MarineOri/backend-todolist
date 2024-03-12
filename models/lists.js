const mongoose = require("mongoose");

const ListSchema = mongoose.Schema({
  title: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lists" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  access: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const User = mongoose.model("lists", listSchema);

module.exports = List;
