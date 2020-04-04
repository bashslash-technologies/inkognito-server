const Nodemailer = require("nodemailer");
const HtmlToText = require("html-to-text");
const ejs = require("ejs");
require("dotenv").config({
  path: ".env",
});

const Transport = Nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: process.env.NODE_ENV === "development" ? true : false,
  logger: process.env.NODE_ENV === "development" ? true : false,
});

//generate html
const GenerateHTML = async (filename, options = {}) => {
  const html = ejs.renderFile(`${__dirname}/${filename}.ejs`, options);
  return html;
};

const send = async (options) => {
  try {
    let html = await GenerateHTML(options.filename, options);
    let text = HtmlToText.fromString(html);
    const MailOptions = {
      to: options.user.email,
      from: "Inkognito<noreply@inkognito.com>",
      subject: options.subject,
      text,
      html,
    };
    await Transport.sendMail(MailOptions);
    let result = await Transport.verify();
    if (!result) throw new Error(err);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { send };
