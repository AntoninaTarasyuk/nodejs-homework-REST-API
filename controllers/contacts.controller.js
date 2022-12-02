const Contacts = require('../models/contacts.model');
const { createError } = require('../helpers/helpers');

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().min(2).max(22).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
const statusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const listContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contacts.find({owner: _id}, '', {skip, limit: Number(limit)}).populate('owner','_id email');
  return res.status(200).json(contacts);
};

const getContactById = async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await Contacts.findById(id);
  if (contact) { return res.status(200).json(contact) }
  return next(createError(404));
};

const removeContact = async (req, res, next) => {
  const id = req.params.contactId;
  const removedContact = await Contacts.findByIdAndRemove(id);
  if (removedContact) { return res.status(200).json(removedContact) };
  return next(createError(404));
};

const addContact = async (req, res, next) => {
  const { _id } = req.user;
  const { error } = schema.validate(req.body);
  if (error) { return next(createError(400, error)) };
  const newContact = await Contacts.create({...req.body, owner: _id });
  return res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { error } = schema.validate(req.body);
  if (error) { return next(createError(400, error)) };
  const updatedContact = await Contacts.findByIdAndUpdate(id, req.body, { new: true });
  if (updatedContact) { return res.status(200).json(updatedContact) };
  return next(createError(404));
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { value: {favorite}, error } = statusSchema.validate(req.body);
  if (error) { return next(createError(400, error)) };
  const updatedContact = await Contacts.findByIdAndUpdate(id, { favorite }, { new: true });
  if (updatedContact) { return res.status(200).json(updatedContact) };
  return next(createError(404));
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};