const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found!"));
}

function errorHandler(err, req, res, next) {
  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("There is an error!");
  }
}
module.exports = { errorHandler, notFoundHandler };
