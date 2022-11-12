const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find(contact => contact.id === contactId);
    return contactById;
  } catch (error) {
    return error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const removedContact = contacts.find(contact => contact.id === contactId);
    if (!removedContact) { return null };
    const newData = contacts.filter(contact => contact.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(newData));
    return removedContact;
  } catch (error) {
    return error;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    const newData = [...contacts, newContact];
    fs.writeFile(contactsPath, JSON.stringify(newData));
    return newContact;
  } catch (error) {
    return error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    let updatedContact;
    const newData = contacts.map(contact => {
      if (contact.id === contactId) {
        // updatedContact = Object.assign(contact, body);
        updatedContact = { id: contactId, ...body }; 
        return updatedContact;
      } else {
        return contact;
      }
    });
    fs.writeFile(contactsPath, JSON.stringify(newData));
    return updatedContact;
  } catch (error) {
    return error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};