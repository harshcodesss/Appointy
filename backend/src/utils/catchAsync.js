/**
 * Wraps an async controller function to catch errors and forward them
 * to the global error handler. Eliminates try/catch in every controller.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
