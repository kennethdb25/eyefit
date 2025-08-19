const createError = require("http-errors");

const BadRequest = (msg = "Bad request") => new createError.BadRequest(msg);

module.exports = BadRequest;