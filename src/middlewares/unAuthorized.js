const UnAuthorized = function (err, req, res, next) {
  if (err.name === "Unauthorized") {
    return res.status(err.status).send({ message: err.message }).end();
  }
  next(err);
};

module.exports = UnAuthorized;
