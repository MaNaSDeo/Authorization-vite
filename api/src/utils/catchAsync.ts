import { type NextFunction, type Request, type Response } from "express";

function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}

export default catchAsync;

/**
 * The catchAsync function is a higher-order function that wraps asynchronous route handlers to catch any errors and pass them to Express's error handling middleware.
 * It takes an async function fn as an argument. This function is typically an Express route handler.
 * It returns a new function that Express will use as the route handler.
 * When this new function is called, it executes the original fn and wraps it in a Promise.
 * If the Promise resolves successfully, nothing special happens.
 * If the Promise rejects (i.e., an error occurs), it catches the error and passes it to the next function, which will trigger Express's error handling middleware.
 */
