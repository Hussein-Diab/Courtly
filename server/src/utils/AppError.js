// An error we throw on purpose, with an HTTP status attached
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = AppError;
