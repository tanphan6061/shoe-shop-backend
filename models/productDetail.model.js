const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Color',
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Size',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['sold-out', 'available'],
      default: 'available',
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductDetail = mongoose.model(
  'ProductDetail',
  productDetailSchema,
  'product_details',
);
module.exports = ProductDetail;
