const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().min(2).max(22).required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
});

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
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      res.status(404).json({ code: '404', message: 'Not found' });
      return;
    }
    res.status(200).json({ code: '200', message: 'Successfully removed', deletedContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // if (!name || !email || !phone) {
    //   res.status(400).json({ code: '400', message: 'Missing required field' });
    //   return;
    // }
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ code: '400', message: `Missing required field. Validation error: ${error.message}` });
      return;
    };
    const newContact = await addContact(name, email, phone);
    res.status(201).json({ code: '201', message: 'Created', newContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    // if (Object.keys(req.body).length === 0) {
    //   res.status(400).json({ code: '400', message: 'Missing required field' });
    //   return;
    // }
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ code: '400', message: `Missing required field. Validation error: ${error.message}` });
      return;
    }
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      res.status(404).json({ code: '404', message: 'Not found' });
      return;
    }
    res.status(200).json({ code: '200', message: 'Successfully updated', updatedContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
