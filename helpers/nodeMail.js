const nodemailer = require('nodemailer');
require('dotenv').config();
const {SENDER, MAILTRAP_USER, MAILTRAP_PASSWORD} = process.env;

const sendVerificationEmail = async (email, verificationToken) => {
  const config = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD
    }
  });
  const transporter = nodemailer.createTransport(config);
  const letter = {
    from: SENDER,
    to: email,
    subject: 'Email verification',
    html: `<a target="_blanc" href="http://localhost:3000/api/users/verify/${verificationToken}">Click here to verify your email</a> `,
  };
  transporter
    .sendMail(letter)
    .then(() => console.log('Email sent'))
    .catch((err) => console.log(err.message));
};

module.exports = sendVerificationEmail;