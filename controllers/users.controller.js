const { Unauthorized, Conflict, NotFound, BadRequest } = require('http-errors');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4  } = require('uuid');
const { User } = require('../models/users.model');
const sendVerificationEmail = require('../helpers/nodeMail');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) { throw new Conflict(`User with email ${email} already registered`) };

  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(password, salt);

  const avatarURL = gravatar.url(email);

  const verificationToken = uuidv4();
  
  const newUser = await User.create({
    email, password: hashedPassword, avatarURL, verificationToken
  });
  await sendVerificationEmail(email, verificationToken);
  return res.status(201).json({ user: {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
    verificationToken: newUser.verificationToken
  } });  
};

const loginUser = async (req, res, next) => {
  const { email, password, verify } = req.body;
  const user = await User.findOne({ email });
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (!user || !isPassCorrect) {
    throw new Unauthorized('Email or password is wrong');
  };
  if (verify === false) {
    throw new Unauthorized('Not verify');
  };
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

const updateUserSubscription = async (req, res, next) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  return res.status(200).json({ user: {email, subscription}, });
};

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
const updateUserAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { host } = req.headers;
  const { path: tmpUpload, originalname } = req.file; 
  const avatarName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, avatarName);
  try {
    await fs.rename(tmpUpload, resultUpload);
    Jimp.read(resultUpload, (err, avatar) => {
      if (err) throw err;
      avatar.resize(250, 250).write(resultUpload);
    });
    const avatarURL = `http://${host}/avatars/${avatarName}`;
    await User.findByIdAndUpdate(_id, {avatarURL}, { new: true });
    return res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tmpUpload);
    throw error;
  }
};

const verifyUserEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user =await User.findOne({ verificationToken });
  if (!user) { throw new NotFound('Invalid verification token') };
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null }, { new: true });
  res.status(200).json({ message: 'Verification successful' });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) { throw new NotFound(`User with email ${email} not found`); };
  if (user.verify === true) { throw new BadRequest('Verification has already been passed'); };
  await sendVerificationEmail(user.email, user.verificationToken);
  res.status(200).json({ message: 'Verification email sent' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateUserAvatar,
  verifyUserEmail,
  resendVerificationEmail
};