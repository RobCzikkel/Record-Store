const nodemailer = require('nodemailer');


let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "robert.czikkel@gmail.com",
      pass: "G00dv1b3s04",
    },
  });

  module.exports = mailer;