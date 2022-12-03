const express = require('express');
const {
  uploadAvatarController,
} = require('../../controllers/avatars.controller');

const { tryCatchWrapper } = require('../../helpers/helpers');
const uploadAvatar = require('../../middlewares/uploadAvatar');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', uploadAvatar.single('avatar'), tryCatchWrapper(uploadAvatarController));
module.exports = router;