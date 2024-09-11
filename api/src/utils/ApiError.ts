class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

/**
 * ApiError class is a custom error class that extends the built-in Error class. It's designed to provide more context about errors in your API.
 * statusCode: Represents the HTTP status code associated with the error.
 * isOperational: A flag to indicate if this is an operational error (expected error) or a programming error.
 * If a stack trace is provided, it uses that; otherwise, it captures the stack trace.
 */
