// This middleware function is used to handle asynchronous route handlers in Express.js. It takes a function `fn` as an argument and returns a new function that wraps the original function in a Promise. If the original function throws an error or rejects, the error is passed to the next middleware using `next()`, allowing for centralized error handling in your Express application.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;