const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please enter product category'],
    },

    title: {
      type: String,
      required: [true, 'Please enter product name'],
    },

    quantity: {
      type: String,
      required: true,
      default: '0',
    },
    weight: {
      type: String,
      required: true,
      default: '',
    },

    oldPrice: {
      type: String,
      required: true,
      default: '0',
    },

    newPrice: {
      type: String,
      required: true,
      default: '0',
    },

    image: {
      type: String,
      required: false,
    },
    imageTwo: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
