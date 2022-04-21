const nodemailer = require('nodemailer');
require('dotenv').config();

let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PW,
    },
  });

  module.exports = mailer;