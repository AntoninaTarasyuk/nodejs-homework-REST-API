const express = require('express');
const { tryCatchWrapper } = require('../../helpers/helpers');
const auth = require('../../middlewares/auth');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts.controller');

const router = express.Router();

router.get('/', auth, tryCatchWrapper(listContacts));
router.get('/:contactId', auth, tryCatchWrapper(getContactById));
router.delete('/:contactId', auth, tryCatchWrapper(removeContact));
router.post('/', auth, tryCatchWrapper(addContact));
router.put('/:contactId', auth, tryCatchWrapper(updateContact));
router.patch('/:contactId/favorite', auth, tryCatchWrapper(updateStatusContact));

module.exports = router;
