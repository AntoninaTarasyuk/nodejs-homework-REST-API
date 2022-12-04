const multer = require('multer');
const path = require('path');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../', 'tmp'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadAvatar = multer({ storage: multerConfig });

module.exports = uploadAvatar;