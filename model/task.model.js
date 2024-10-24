const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type : String,
      required : true,
    },
    status: {
      type : String,
      enum : ['pending','doing', 'finish', 'assigned'],  // pending : create task but don't assign to any one
      default : 'pending'
    },
    content: String,
    timeStart: Date,
    timeFinish: Date,
    staffId : String,
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