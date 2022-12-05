/* eslint-disable no-useless-catch */
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const {SENDGRID_API_KEY, SENDER} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

// const email = {
//   to: 'antoshka.tarasyuk@gmail.com',
//   from: 'antoshka.tarasyuk@gmail.com',
//   subject: 'Testing App',
//   html: '<p>Hello world!</p>'
// };

// sgMail
//   .send(email)
//   .then(() => console.log('Email sent'))
//   .catch((err) => console.log(err.message))

const sendEmail = async (data) => {
  const email = { ...data, from: SENDER };
  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;