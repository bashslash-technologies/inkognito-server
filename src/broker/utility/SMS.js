const wittyflow = require('wittyflow');

wittyflow.config({
  application_id: process.env.SMS_API_KEY,
  application_secret: process.env.SMS_API_SECRET,
  senderName: process.env.APP_NAME
})

module.exports = wittyflow;
