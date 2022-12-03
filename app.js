const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/api/users.router');
const contactsRouter = require('./routes/api/contacts.router');
// const avatarsRouter = require('./routes/api/avatars.router');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('pablic'));

const fs = require('fs/promises')
const multer = require('multer');
const path = require('path');
const { v4 } = require('uuid');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'tmp'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadAvatar = multer({ storage: multerConfig });
const users = [];

app.post('/api/avatars', uploadAvatar.single('avatar'), async (req, res) => {
  const { path: tmpUpload, originalname } = req.file; 
  const avatarDir = path.join(__dirname, 'public', 'avatars')
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
  }
});

app.get('/api/avatars', async (req, res) => { 
  res.status(200).json(users);
})

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);
// app.post('/api/avatars', avatarsRouter);
app.use('/avatars', express.static('./public/avatars'));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({message: err.message});
  };
  if (err.name === "CastError") {
    return res.status(404).json({message: 'Not found'});
  };
  res.status(500).json({ message: err.message });
});

module.exports = app;
