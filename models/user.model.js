/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      min: 5,
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
    ward: {
      type: String,
      default: '',
      // required: true,
    },
    street: {
      type: String,
      default: '',
      // required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      default:
        'https://res.cloudinary.com/binzlark/image/upload/v1608198688/my-blog/avatar/avatar_r3kfar.png',
    },
    phone: {
      type: String,
      match: /[+0-9]{10,11}/,
      required: true,
      trim: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ['male', 'female', 'another'],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next(); // if user not change password
  const salt = parseInt(process.env.BCRYPT_HASH, 10);
  bcrypt.hash(user.password, salt, (err, hash) => {
    if (err) throw err;
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

userSchema.virtual('wardInfo', {
  ref: 'Ward',
  localField: 'ward',
  foreignField: 'code',
  justOne: true, // for many-to-1 relationships
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
