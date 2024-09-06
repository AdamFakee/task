const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type : String,
      required : true,
    },
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    createdBy : String,
    deletedBY : String,
    updatedBy : Array,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;