const nodemailer = require('nodemailer');
const config = require('../config/config');


const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "production") {
  transport
    .verify()
    .then(() => console.log("Connected to email server"))
    .catch(() =>
      console.log(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const triggerEmail = async (to, subject, text = '', html) => {
    const content = { from: config.email.from, to, subject, text, html };
    await transport.sendMail(content);
};

module.exports = {
    triggerEmail
}