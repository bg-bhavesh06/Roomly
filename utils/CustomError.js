//This is the Custome Erros

class customError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = customError;
