const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      min: 5,
      maxlength: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-z][a-z0-9_\-\.]{2,32}@[a-z0-9_-]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model('Admin', adminSchema, 'admins');
module.exports = Admin;
