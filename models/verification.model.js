const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    time: {
      type: Number, // minute
      default: process.env.VERIFY_CODE_TIME_EXPIRED,
    },
    type: {
      type: String,
      enum: ['active', 'reset-password'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const Verification = mongoose.model(
  'Verification',
  verificationSchema,
  'verifications',
);
module.exports = Verification;
