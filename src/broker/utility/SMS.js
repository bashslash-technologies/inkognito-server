const axios = require("axios");

axios.defaults.baseURL = "https://api.wittyflow.com/v1/";

const config = {
  app_secret: process.env.SMS_API_SECRET,
  app_id: process.env.SMS_API_KEY,
  from: process.env.APP_NAME,
  type: 1,
};

module.exports = async (to, message, other = "") => {
  let newMessage =
    other.trim() === ""
      ? `${message} is your inkognito verification code`
      : other;
  await axios
    .post("/messages/send", {
      ...config,
      to,
      message: newMessage,
    })
    .then((res) => {
      console.log("Sent");
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
