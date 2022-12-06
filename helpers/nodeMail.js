const nodemailer = require('nodemailer');
require('dotenv').config();
const {SENDER, META_USER, META_PASSWORD } = process.env;

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: META_USER,
      pass: META_PASSWORD,
    }
  });

  const mailOptions = {
    from: SENDER,
    to: email,
    subject: 'Email verification',
    html: `<p>You have registered in our application<br/><a target="_blanc" href="http://localhost:3000/api/users/verify/${verificationToken}">Click here to verify your email</a></p> `,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent', info);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendVerificationEmail;