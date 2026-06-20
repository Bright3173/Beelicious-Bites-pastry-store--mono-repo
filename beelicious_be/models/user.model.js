const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: { type: String, unique: true },
    password: {
      type: String,
      required: true,
    },
    resetPasswordOTP: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
