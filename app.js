const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/api/users.router');
const contactsRouter = require('./routes/api/contacts.router');
const avatarsRouter = require('./routes/api/avatars.router');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('pablic'));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/avatars', avatarsRouter);
app.use('/avatars', express.static('./public/avatars'));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({message: err.message});
  };
  res.status(500).json({ message: err.message });
});

module.exports = app;
