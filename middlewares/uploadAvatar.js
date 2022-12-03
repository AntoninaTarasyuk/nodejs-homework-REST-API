const multer = require('multer');
const path = require('path');

// const multerConfig = multer.diskStorage({
//   destination: path.join(__dirname, '../tmp'),
//   filename: function (req, file, cb) {
//     const [filename, extention] = file.originalname.split('.');
//     cb(null, `${filename}.${extention}`);
//   },
// });
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