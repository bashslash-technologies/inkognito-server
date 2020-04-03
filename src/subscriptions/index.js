const SocketIO = require("socket.io");

module.exports = (broker) => {
  const io = new SocketIO();
  io.on("connection", (socket) => {
    console.log("Heck ya, Connection established");
  });
  return io;
};
