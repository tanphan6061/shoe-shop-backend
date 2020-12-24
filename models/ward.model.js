const mongoose = require('mongoose');

const wardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      required: true,
    },
    name_with_type: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    path: {
      type: String,
      trim: true,
      required: true,
    },
    path_with_type: {
      type: String,
      trim: true,
      required: true,
    },
    parent_code: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

wardSchema.virtual('district', {
  ref: 'District',
  localField: 'parent_code',
  foreignField: 'code',
  justOne: true, // for many-to-1 relationships
});

const Ward = mongoose.model('Ward', wardSchema, 'wards');
module.exports = Ward;
