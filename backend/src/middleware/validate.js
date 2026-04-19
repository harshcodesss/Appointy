import validator from 'validator';
import AppError from '../utils/AppError.js';
import { SPECIALIZATIONS, SLOT_TIMES } from '../constants/index.js';

/**
 * Validation middleware factory.
 * Each exported function validates a specific endpoint's request.
 */

// ---- Auth Validations ----

export const validateRegister = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required.', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long.', 400));
  }

  if (name.trim().length < 2) {
    return next(new AppError('Name must be at least 2 characters long.', 400));
  }

  next();
};

export const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  next();
};

// ---- Doctor Validations ----

export const validateAddDoctor = (req, _res, next) => {
  const { name, email, password, specialization, degree, experience, about, fees } = req.body;

  if (!name || !email || !password || !specialization || !degree || !about) {
    return next(new AppError('Missing required doctor fields (name, email, password, specialization, degree, about).', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long.', 400));
  }

  if (!SPECIALIZATIONS.includes(specialization)) {
    return next(new AppError(`Invalid specialization. Must be one of: ${SPECIALIZATIONS.join(', ')}`, 400));
  }

  if (experience !== undefined && (isNaN(experience) || Number(experience) < 0)) {
    return next(new AppError('Experience must be a non-negative number.', 400));
  }

  if (fees !== undefined && (isNaN(fees) || Number(fees) < 0)) {
    return next(new AppError('Fees must be a non-negative number.', 400));
  }

  next();
};

// ---- Appointment Validations ----

export const validateBookAppointment = (req, _res, next) => {
  const { doctorId, slotDate, slotTime } = req.body;

  if (!doctorId || !slotDate || !slotTime) {
    return next(new AppError('Doctor ID, slot date, and slot time are required.', 400));
  }

  if (!validator.isMongoId(doctorId)) {
    return next(new AppError('Invalid doctor ID format.', 400));
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(slotDate)) {
    return next(new AppError('Date must be in YYYY-MM-DD format.', 400));
  }

  const parsedDate = new Date(slotDate);
  if (isNaN(parsedDate.getTime())) {
    return next(new AppError('Invalid date provided.', 400));
  }

  // Don't allow booking in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate < today) {
    return next(new AppError('Cannot book appointments in the past.', 400));
  }

  if (!SLOT_TIMES.includes(slotTime)) {
    return next(new AppError(`Invalid time slot. Must be one of: ${SLOT_TIMES.join(', ')}`, 400));
  }

  next();
};

export const validateMongoId = (paramName) => (req, _res, next) => {
  const id = req.params[paramName] || req.body[paramName];

  if (!id || !validator.isMongoId(String(id))) {
    return next(new AppError(`Invalid ${paramName} format.`, 400));
  }

  next();
};

// ---- Profile Validations ----

export const validateUpdateProfile = (req, _res, next) => {
  const { email } = req.body;

  if (email && !validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  next();
};
