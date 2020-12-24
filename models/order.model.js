const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxlength: 30,
    },
    ward: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      trim: true,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['on-delivery', 'paypal', 'vnpay'],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['canceled', 'paid'], // đã huỷ, đã thanh toán
      default: 'paid',
    },
    phone: {
      type: String,
      match: /[+0-9]/,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    data: [
      {
        productDetail: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        quality: {
          type: Number,
          required: true,
          default: 0,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

orderSchema.virtual('wardInfo', {
  ref: 'Ward',
  localField: 'ward',
  foreignField: 'code',
  justOne: true, // for many-to-1 relationships
});

const Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;
