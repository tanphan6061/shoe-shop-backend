const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxlength: 30,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Size = mongoose.model('Size', sizeSchema, 'sizes');
module.exports = Size;
