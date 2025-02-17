const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/api/users.router');
const contactsRouter = require('./routes/api/contacts.router');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({message: err.message});
  };
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
