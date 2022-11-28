const { Unauthorized, Conflict } = require('http-errors');
const { User } = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

// const { createError } = require('../helpers/helpers');

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) { throw new Conflict(`User with email ${email} already registered`)};
  
  const newUser = new User({ email });
  newUser.setPassword(password);
  newUser.save();
  // const salt = await bcrypt.genSalt(5);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // const newUser = await User.create({ email, password: hashedPassword });
  return res.status(201).json({ user: {
    email: newUser.email,
    subscription: newUser.subscription
  } });  
};

const loginUser = async (req, res, next) => {
  // const authHeader = req.headers.authorization || '';
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) { throw new Unauthorized('User does not exists') };
  // if (password !== user.password) { throw new Unauthorized('Wrong password') };
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (!isPassCorrect) { throw new Unauthorized('Wrong password') };
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);
  return res.json({ token: token });
}
const logoutUser = async (req, res, next) => {
  const { user } = req;
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);
  return res.json({ message: 'logout' });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};