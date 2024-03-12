const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: String,
  isFinished: Boolean,
});

const User = mongoose.model("tasks", TaskSchema);

module.exports = Task;
