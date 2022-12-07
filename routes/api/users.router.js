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
const { emailSchema, userBodySchema, subscriptionSchema } = require('../../models/users.model');

const router = express.Router();

router.post('/register', validation(userBodySchema), tryCatchWrapper(registerUser));
router.post('/login', validation(userBodySchema), tryCatchWrapper(loginUser));
router.get('/logout', auth, tryCatchWrapper(logoutUser));
router.get('/current', auth, tryCatchWrapper(getCurrentUser));
router.patch('/', auth, validation(subscriptionSchema), tryCatchWrapper(updateUserSubscription));
router.patch('/avatars', auth, uploadAvatar.single('avatar'), tryCatchWrapper(updateUserAvatar));
router.get('/verify/:verificationToken', tryCatchWrapper(verifyUserEmail));
router.post('/verify', validation(emailSchema), tryCatchWrapper(resendVerificationEmail));

module.exports = router;