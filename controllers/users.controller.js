const { Unauthorized, Conflict } = require('http-errors');
const { User } = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) { throw new Conflict(`User with email ${email} already registered`)};
  // const newUser = new User({ email });
  // newUser.setPassword(password);
  // newUser.save();
  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({ email, password: hashedPassword });
  return res.status(201).json({ user: {
    email: newUser.email,
    subscription: newUser.subscription
  } });  
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) { throw new Unauthorized('Email or password is wrong'); };
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (!isPassCorrect) { throw new Unauthorized('Email or password is wrong'); };
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '2h' });
  user.token = token;
  const { subscription } = user;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(200).json({ token, user: { email, subscription }, });
};

const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null});
  return res.status(204).json();
};

const getCurrentUser = async (req, res, next) => {
  const { token, email, subscription } = req.user;
  return res.status(200).json({ token, user: { email, subscription }, });
};

const patchSubscriptionUser = async (req, res, next) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  if (!updatedUser) { throw new Unauthorized('User does not exists'); };
  return res.status(200).json({ user: {email, subscription}, });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  patchSubscriptionUser
};