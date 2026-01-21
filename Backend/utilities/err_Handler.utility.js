export class err_Handler extends Error {
  constructor(message = "Internal server error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
