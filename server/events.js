const eventEmitter = require('events');
const mailer = require('./helpers/mailer')

const emitter = new eventEmitter();

emitter.on('confirmation', (email) => {

    mailer.sendMail({
        from: "robert.czikkel@gmail.com",
        to: email,
        subject: "Message title",
        text: "Plaintext version of the message",
        html: "<div><h1>HTML version of the message</h1></div>"
}, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
});

emitter.on('purchase', (email) => {

  mailer.sendMail({
      from: "robert.czikkel@gmail.com",
      to: email,
      subject: "Message title",
      text: "Plaintext version of the message",
      html: "<div><h1>HTML version of the message</h1></div>"
}, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  
});

module.exports = emitter;