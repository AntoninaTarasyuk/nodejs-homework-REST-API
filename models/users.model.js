const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs");

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
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {versionKey: false, timeStamps: true}
);

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified('password')) { next() };
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(user.password, salt);
//   user.password = hashedPassword;
//   next();
// });
userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(5);
  this.password = bcrypt.hash(password, salt);
}
const Joi = require('joi');
const joiSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }).required(),
  password: Joi.string().required(),
});

const User = model('user', userSchema);

module.exports = { User, joiSchema};