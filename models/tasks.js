const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: String,
  isFinished: Boolean,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "lists" },
});

const Task = mongoose.model("tasks", TaskSchema);

module.exports = Task;
