const HandleError = function (err, req, res, next) {
  res
    .status(err.status || 200)
    .send({ message: err.message })
    .end();
};
module.exports = HandleError;
