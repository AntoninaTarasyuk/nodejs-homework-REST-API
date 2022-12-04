const express = require('express');
const {
  uploadAvatarController,
  getAvatarController
} = require('../../controllers/avatars.controller');

const { tryCatchWrapper } = require('../../helpers/helpers');
const uploadAvatar = require('../../middlewares/uploadAvatar');

const router = express.Router();

router.post('/', uploadAvatar.single('avatar'), tryCatchWrapper(uploadAvatarController));
router.get('/', tryCatchWrapper(getAvatarController));

module.exports = router;