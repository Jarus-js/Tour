//Error i.e built in error func
class HttpError extends Error {
  //based on built-in error we wanna customize error handling
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}
module.exports = HttpError;
