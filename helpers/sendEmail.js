const sgMail = require('@sendgrid/mail');
require('dotenv').config()

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async(date) => {
  const email = {...date, from: "elena88555@gmail.com"};
  await sgMail.send(email)
  return true;
}

module.exports = sendEmail