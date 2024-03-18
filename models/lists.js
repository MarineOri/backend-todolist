const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  title: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tasks" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  access: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const List = mongoose.model("lists", listSchema);

module.exports = List;
