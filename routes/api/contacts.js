const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  // addContact,
  // updateContact,
} = require('../../models/contacts');

router.get('/', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ code: '200', message: 'Success', contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);
    if (!contactById) {
      res.status(404).json({ code: '404', message: 'Not found' });
      return;
    }
    res.status(200).json({ code: '200', message: 'Success', contactById });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const isContactDeleted = await removeContact(contactId);
    if (!isContactDeleted) {
      res.status(404).json({ code: '404', message: 'Not found' });
      return;
    }
    res.status(200).json({ code: '200', message: 'Successfully removed', isContactDeleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    
    res.status(201).json({ code: '201', message: 'Created', newContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
});

module.exports = router
