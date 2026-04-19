import env from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Maps common Mongoose/JWT errors to user-friendly messages.
 */

const handleCastError = (err) => ({
  statusCode: 400,
  message: `Invalid ${err.path}: ${err.value}`,
});

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    statusCode: 409,
    message: `A record with this ${field} already exists.`,
  };
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return {
    statusCode: 400,
    message: `Validation failed: ${messages.join('. ')}`,
  };
};

const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
});

const handleJWTExpired = () => ({
  statusCode: 401,
  message: 'Token expired. Please log in again.',
});

/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'CastError') {
    ({ statusCode, message } = handleCastError(err));
  }
  if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateKey(err));
  }
  if (err.name === 'ValidationError') {
    ({ statusCode, message } = handleValidationError(err));
  }
  if (err.name === 'JsonWebTokenError') {
    ({ statusCode, message } = handleJWTError());
  }
  if (err.name === 'TokenExpiredError') {
    ({ statusCode, message } = handleJWTExpired());
  }

  // Log errors in development
  if (env.NODE_ENV === 'development') {
    console.error('🔥 ERROR:', err);
  } else {
    // In production, only log unexpected errors
    if (!err.isOperational) {
      console.error('🔥 UNEXPECTED ERROR:', err);
      message = 'Something went wrong. Please try again later.';
      statusCode = 500;
    }
  }

  sendError(res, statusCode, message);
};

export default errorHandler;
