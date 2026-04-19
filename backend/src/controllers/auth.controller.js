import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ROLES } from '../constants/index.js';

/**
 * Generate a signed JWT token.
 * @param {string} id - User/Doctor ID
 * @param {string} role - User role
 * @returns {string} Signed JWT
 */
const signToken = (id, role) =>
  jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

// ---- Register User ----
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create({ name, email, password, role: ROLES.USER });
  const token = signToken(user._id, ROLES.USER);

  sendSuccess(res, 201, { token, user }, 'Registration successful');
});

// ---- Login User ----
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and explicitly include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = signToken(user._id, ROLES.USER);

  sendSuccess(res, 200, { token, user }, 'Login successful');
});

// ---- Login Doctor ----
export const loginDoctor = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email: email.toLowerCase() }).select('+password');

  if (!doctor || !(await doctor.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = signToken(doctor._id, ROLES.DOCTOR);

  sendSuccess(res, 200, { token, doctor }, 'Login successful');
});

// ---- Login Admin ----
export const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    return next(new AppError('Invalid admin credentials.', 401));
  }

  const token = signToken('admin', ROLES.ADMIN);

  sendSuccess(res, 200, { token }, 'Admin login successful');
});
