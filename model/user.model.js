const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  refreshToken: String,
  deleted: {
    type: Boolean,
    default: false
  },
  status : {
    type : String,
    enum : ['active', 'inactive'],
    default : 'active'
  },
  role : {
    type : String,
    enum : ['staff', 'lead'],
    default : 'staff'
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;