const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  patchSubscriptionUser,
} = require('../../controllers/users.controller');

const { tryCatchWrapper, validation } = require('../../helpers/helpers');
const auth = require('../../middlewares/auth');
const { userValidation, subscriptionValidation } = require('../../models/users.model');

const router = express.Router();

router.post('/register', validation(userValidation), tryCatchWrapper(registerUser));
router.post('/login', validation(userValidation), tryCatchWrapper(loginUser));
router.get('/logout', auth, tryCatchWrapper(logoutUser));
router.get('/current', tryCatchWrapper(auth), tryCatchWrapper(getCurrentUser));
router.patch('/', validation(subscriptionValidation), tryCatchWrapper(auth), tryCatchWrapper(patchSubscriptionUser));

module.exports = router;