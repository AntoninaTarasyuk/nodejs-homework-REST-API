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

router.get('/', tryCatchWrapper(auth), tryCatchWrapper(listContacts));
router.get('/:contactId', tryCatchWrapper(getContactById));
router.delete('/:contactId', tryCatchWrapper(removeContact));
router.post('/', tryCatchWrapper(auth), tryCatchWrapper(addContact));
router.put('/:contactId', tryCatchWrapper(updateContact));
router.patch('/:contactId/favorite', tryCatchWrapper(updateStatusContact));

module.exports = router;
