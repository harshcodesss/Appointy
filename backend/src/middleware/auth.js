import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { ROLES } from '../constants/index.js';

/**
 * Authenticate a request via JWT in the Authorization header.
 * Attaches the decoded user to `req.user`.
 *
 * Supports: `Authorization: Bearer <token>`
 */
export const authenticate = async (req, _res, next) => {
  // 1. Extract token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3. Check if user/doctor still exists
    let currentUser = null;

    if (decoded.role === ROLES.ADMIN) {
      // Admin is not stored in DB — synthetic user object
      currentUser = { id: 'admin', role: ROLES.ADMIN, email: env.ADMIN_EMAIL };
    } else if (decoded.role === ROLES.DOCTOR) {
      currentUser = await Doctor.findById(decoded.id).select('_id name email');
      if (!currentUser) {
        return next(new AppError('Doctor no longer exists.', 401));
      }
      currentUser = { id: currentUser._id, role: ROLES.DOCTOR, name: currentUser.name };
    } else {
      currentUser = await User.findById(decoded.id).select('_id name email role');
      if (!currentUser) {
        return next(new AppError('User no longer exists.', 401));
      }
      currentUser = { id: currentUser._id, role: currentUser.role, name: currentUser.name };
    }

    // 4. Attach to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    return next(error);
  }
};

/**
 * Authorize access based on user roles.
 * Must be used AFTER `authenticate`.
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'doctor')
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/admin-only', authenticate, authorize('admin'), controller);
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
