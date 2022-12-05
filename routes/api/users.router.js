const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateUserAvatar,
  verifyUserEmail,
  resendVerificationEmail,
} = require('../../controllers/users.controller');

const { tryCatchWrapper, validation } = require('../../helpers/helpers');
const auth = require('../../middlewares/auth');
const uploadAvatar = require('../../middlewares/uploadAvatar');
const { userValidation, subscriptionValidation } = require('../../models/users.model');

const router = express.Router();

router.post('/register', validation(userValidation), tryCatchWrapper(registerUser));
router.post('/login', validation(userValidation), tryCatchWrapper(loginUser));
router.get('/logout', auth, tryCatchWrapper(logoutUser));
router.get('/current', auth, tryCatchWrapper(getCurrentUser));
router.patch('/', auth, validation(subscriptionValidation), tryCatchWrapper(updateUserSubscription));
router.patch('/avatars', auth, uploadAvatar.single('avatar'), tryCatchWrapper(updateUserAvatar));
router.get('/verify/:verificationToken', tryCatchWrapper(verifyUserEmail));
router.post('/verify', validation(userValidation), tryCatchWrapper(resendVerificationEmail));

module.exports = router;