/**
 * Standardized API response helpers.
 * Ensures every endpoint returns a consistent JSON shape.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {object} data - Payload to include in response
 * @param {string} [message] - Optional success message
 */
export const sendSuccess = (res, statusCode, data = {}, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Send an error response (used by error handler middleware).
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 */
export const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
