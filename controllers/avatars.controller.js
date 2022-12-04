const fs = require('fs/promises')
const path = require('path');
const { v4 } = require('uuid');

const users = [];

const uploadAvatarController = async (req, res, next) => {
  const { path: tmpUpload, originalname } = req.file;
  const avatarDir = path.join(__dirname, '../', 'public', 'avatars')
  const resultUpload = path.join(avatarDir, originalname);
  try {
    await fs.rename(tmpUpload, resultUpload);
    const avatarPath = path.join('public', 'avatars', originalname);
    const newUser = {
      name: req.body.name,
      id: v4(5),
      avatar: avatarPath,
    };
    users.push(newUser)
    res.status(201).json(newUser);
  } catch (error) {
    await fs.unlink(tmpUpload);
    next(error);
  }
};

const getAvatarController = async (req, res, next) => {
  res.status(200).json(users);
};

module.exports = { uploadAvatarController, getAvatarController};