const fs = require('fs/promises')
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.resolve('./models/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactById = contacts.find(contact => contact.id === contactId);
  if (!contactById) { return null };
  return contactById;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactForRemove = await getContactById(contactId);
  const newData = contacts.filter(contact => contact.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(newData));
  return contactForRemove;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {id: uuidv4(), name, email, phone}
  const newData = contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(newData));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIdx = contacts.findIndex(contact => contact.id === contactId);
  if (contactIdx === -1) { return null };
  const contactForUpdate = contacts[contactIdx];
  Object.assign(contactForUpdate, body);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contactForUpdate;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};