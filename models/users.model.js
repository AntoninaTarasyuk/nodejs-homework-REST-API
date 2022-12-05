const { Schema, model } = require('mongoose');
// const bcrypt = require("bcryptjs");

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  {versionKey: false, timeStamps: true}
);

// userSchema.methods.setPassword = async function (password) {
//   const salt = await bcrypt.genSalt(5);
//   this.password = bcrypt.hash(password, salt);
// }

const Joi = require('joi');
const userValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).required(),
  password: Joi.string().min(5).required(),
});
const subscriptionValidation = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const User = model('user', userSchema);

module.exports = { User, userValidation, subscriptionValidation};