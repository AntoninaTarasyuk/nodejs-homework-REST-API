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
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required()
});

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);
    if (!contactById) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.status(200).json(contactById);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      return res.status(404).json({ code: '404', message: 'Not found' });
    }
    return res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: '400', message: `Missing required field. Validation error: ${error.message}` });
    };
    const newContact = await addContact(name, email, phone);
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: '400', message: `Missing required field. Validation error: ${error.message}` });
    }
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ code: '404', message: 'Not found' });
    }
    return res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
