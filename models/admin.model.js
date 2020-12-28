/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

adminSchema.pre('save', function (next) {
  const admin = this;
  if (!admin.isModified('password')) return next(); // if admin not change password
  const salt = parseInt(process.env.BCRYPT_HASH, 10);
  bcrypt.hash(admin.password, salt, (err, hash) => {
    if (err) throw err;
    admin.password = hash;
    next();
  });
});

adminSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

const Admin = mongoose.model('Admin', adminSchema, 'admins');
module.exports = Admin;
