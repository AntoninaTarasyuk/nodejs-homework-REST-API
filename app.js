const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

// app.get('/', (req, res) => {
//   res.send('Hello app');
// });
const {
  listContacts,
  getContactById,
  // removeContact,
  // addContact,
  // updateContact,
} = require('./models/contacts');

app.get('/', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ code: '200', message: 'success', contacts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/:contactId', async (req, res) => {
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

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
