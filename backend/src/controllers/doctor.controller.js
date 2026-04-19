import Doctor from '../models/Doctor.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

// ---- Get All Doctors (Public, with search/filter) ----
export const getAllDoctors = catchAsync(async (req, res) => {
  const { specialization, search, available, page = 1, limit = 20 } = req.query;

  const query = {};

  // Filter by specialization
  if (specialization) {
    query.specialization = specialization;
  }

  // Filter by availability
  if (available !== undefined) {
    query.available = available === 'true';
  }

  // Search by name or specialization (text search)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Doctor.countDocuments(query),
  ]);

  sendSuccess(res, 200, {
    doctors,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ---- Get Doctor by ID (Public) ----
export const getDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).select('-password');

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  sendSuccess(res, 200, { doctor });
});

// ---- Get Own Profile (Doctor Auth) ----
export const getDoctorProfile = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user.id);

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  sendSuccess(res, 200, { doctor });
});

// ---- Update Own Profile (Doctor Auth) ----
export const updateDoctorProfile = catchAsync(async (req, res, next) => {
  // Doctors can only update these fields for themselves
  const allowedFields = ['fees', 'address', 'available', 'about', 'phone'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'address' && typeof req.body[field] === 'string') {
        try {
          updates[field] = JSON.parse(req.body[field]);
        } catch {
          // If parsing fails, skip this field
        }
      } else {
        updates[field] = req.body[field];
      }
    }
  });

  const doctor = await Doctor.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return next(new AppError('Doctor not found.', 404));
  }

  sendSuccess(res, 200, { doctor }, 'Profile updated successfully');
});
