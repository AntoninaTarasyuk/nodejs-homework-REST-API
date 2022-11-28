const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  // patchSubscriptionUser,
} = require('../../controllers/users.controller');

const { tryCatchWrapper, validation } = require('../../helpers/helpers');
const auth = require('../../middlewares/auth');
const { joiSchema } = require('../../models/users.model');

const router = express.Router();

router.post('/signup', validation(joiSchema), tryCatchWrapper(registerUser));
router.post('/login', validation(joiSchema), tryCatchWrapper(loginUser));
router.get('/logout', tryCatchWrapper(auth), tryCatchWrapper(logoutUser));
router.get('/current', tryCatchWrapper(auth), tryCatchWrapper(getCurrentUser));
// router.patch('/', tryCatchWrapper(patchSubscriptionUser));

module.exports = router;