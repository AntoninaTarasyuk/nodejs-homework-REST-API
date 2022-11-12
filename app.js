const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts.router');
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({message: err.message});
  };
  if (err.name === "CastError") {
    return res.status(400).json({message: 'Incorrect id'});
  };
  res.status(500).json({ message: err.message });
});

module.exports = app;
